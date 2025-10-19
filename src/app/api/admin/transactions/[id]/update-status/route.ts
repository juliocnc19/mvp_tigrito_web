import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating transaction status
const UpdateTransactionStatusSchema = z.object({
  status: z.enum(['PENDING_SOLICITUD', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']),
  adminNotes: z.string().optional(),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Update transaction status
 * @description Update transaction status and admin notes
 * @body UpdateTransactionStatusSchema
 * @response 200:Transaction updated successfully
 * @response 404:Transaction not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'ID de transacción inválido'
        ),
        { status: 422 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateTransactionStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Datos de solicitud inválidos',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    // Get transaction
    const existingTransaction = await prisma.serviceTransaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Transacción no encontrada'
        ),
        { status: 404 }
      );
    }

    // Update transaction
    const updatedTransaction = await prisma.serviceTransaction.update({
      where: { id },
      data: {
        currentStatus: validation.data.status,
        status: validation.data.status,
        ...(validation.data.scheduledDate && { 
          scheduledDate: new Date(validation.data.scheduledDate) 
        }),
        ...(validation.data.notes && { notes: validation.data.notes }),
        ...(validation.data.status === 'COMPLETED' && { 
          completedAt: new Date() 
        }),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        posting: {
          select: {
            id: true,
            title: true,
          },
        },
        proService: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Map transaction data
    const transactionData = {
      id: updatedTransaction.id,
      clientId: updatedTransaction.clientId,
      professionalId: updatedTransaction.professionalId,
      priceAgreed: updatedTransaction.priceAgreed.toNumber(),
      discountAmount: updatedTransaction.discountAmount.toNumber(),
      platformFee: updatedTransaction.platformFee.toNumber(),
      escrowAmount: updatedTransaction.escrowAmount.toNumber(),
      currentStatus: updatedTransaction.currentStatus,
      status: updatedTransaction.status,
      scheduledDate: updatedTransaction.scheduledDate?.toISOString() || null,
      postingId: updatedTransaction.postingId,
      proServiceId: updatedTransaction.proServiceId,
      promoCodeId: updatedTransaction.promoCodeId,
      yummyLogistics: updatedTransaction.yummyLogistics,
      notes: updatedTransaction.notes,
      createdAt: updatedTransaction.createdAt.toISOString(),
      updatedAt: updatedTransaction.updatedAt.toISOString(),
      completedAt: updatedTransaction.completedAt?.toISOString() || null,
      agreedPrice: updatedTransaction.agreedPrice?.toNumber() || null,
      offerId: updatedTransaction.offerId,
      client: updatedTransaction.client,
      professional: updatedTransaction.professional,
      posting: updatedTransaction.posting,
      proService: updatedTransaction.proService,
    };

    return NextResponse.json(
      createSuccessResponse(transactionData, 'Transacción actualizada exitosamente')
    );

  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar transacción'
      ),
      { status: 500 }
    );
  }
}
