import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getServiceTransactionById } from '@/lib/db/queries/transaction';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const UpdateTransactionStatusSchema = z.object({
  status: z.enum(['PENDING_SOLICITUD', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']),
  notes: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
});

/**
 * Update transaction status
 * @description Update the status of a service transaction
 * @body UpdateTransactionStatusSchema
 * @response 200:Transaction updated successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params;
    const auth = optionalAuth(request);

    if (!auth?.user?.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateTransactionStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid request body',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { status, notes, scheduledDate } = validation.data;

    // Get the transaction
    const transaction = await getServiceTransactionById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Transaction not found'),
        { status: 404 }
      );
    }

    // Check if user is participant in the transaction
    if (transaction.clientId !== auth.user.userId && transaction.professionalId !== auth.user.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'You are not a participant in this transaction'),
        { status: 403 }
      );
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      'PENDING_SOLICITUD': ['SCHEDULED', 'CANCELED'],
      'SCHEDULED': ['IN_PROGRESS', 'CANCELED'],
      'IN_PROGRESS': ['COMPLETED', 'CANCELED'],
      'COMPLETED': [], // Terminal state
      'CANCELED': [], // Terminal state
    };

    if (!validTransitions[transaction.currentStatus]?.includes(status)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          `Cannot transition from ${transaction.currentStatus} to ${status}`
        ),
        { status: 409 }
      );
    }

    // Update transaction status
    const updateData: any = {
      currentStatus: status,
      status: status,
    };

    if (notes) updateData.notes = notes;
    if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    const updatedTransaction = await prisma.serviceTransaction.update({
      where: { id: transactionId },
      data: updateData,
      include: {
        client: { select: { id: true, name: true, email: true } },
        professional: { select: { id: true, name: true, email: true } },
        posting: { select: { id: true, title: true } },
        proService: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(
      createSuccessResponse(
        {
          transaction: {
            id: updatedTransaction.id,
            clientId: updatedTransaction.clientId,
            professionalId: updatedTransaction.professionalId,
            postingId: updatedTransaction.postingId,
            proServiceId: updatedTransaction.proServiceId,
            priceAgreed: updatedTransaction.priceAgreed.toNumber(),
            status: updatedTransaction.status,
            currentStatus: updatedTransaction.currentStatus,
            scheduledDate: updatedTransaction.scheduledDate?.toISOString() || null,
            completedAt: updatedTransaction.completedAt?.toISOString() || null,
            notes: updatedTransaction.notes,
            createdAt: updatedTransaction.createdAt.toISOString(),
            updatedAt: updatedTransaction.updatedAt.toISOString(),
            client: updatedTransaction.client,
            professional: updatedTransaction.professional,
            posting: updatedTransaction.posting,
            proService: updatedTransaction.proService,
          },
        },
        'Transaction status updated successfully'
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Update transaction status error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update transaction status'
      ),
      { status: 500 }
    );
  }
}
