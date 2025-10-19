import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating payment status
const UpdatePaymentStatusSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  adminNotes: z.string().optional(),
});

/**
 * Update payment status
 * @description Update payment status and admin notes
 * @body UpdatePaymentStatusSchema
 * @response 200:Payment updated successfully
 * @response 404:Payment not found
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
          'ID de pago inválido'
        ),
        { status: 422 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdatePaymentStatusSchema.safeParse(body);
    
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

    // Get payment
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Pago no encontrado'
        ),
        { status: 404 }
      );
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: validation.data.status,
        details: {
          ...existingPayment.details as any,
          adminNotes: validation.data.adminNotes,
          updatedAt: new Date().toISOString(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        transaction: {
          select: {
            id: true,
            currentStatus: true,
          },
        },
      },
    });

    // Map payment data
    const paymentData = {
      id: updatedPayment.id,
      userId: updatedPayment.userId,
      transactionId: updatedPayment.transactionId,
      amount: updatedPayment.amount.toNumber(),
      fee: updatedPayment.fee.toNumber(),
      method: updatedPayment.method,
      status: updatedPayment.status,
      details: updatedPayment.details,
      createdAt: updatedPayment.createdAt.toISOString(),
      updatedAt: updatedPayment.updatedAt.toISOString(),
      recipientId: updatedPayment.recipientId,
      user: updatedPayment.user,
      transaction: updatedPayment.transaction,
    };

    return NextResponse.json(
      createSuccessResponse(paymentData, 'Pago actualizado exitosamente')
    );

  } catch (error) {
    console.error('Update payment error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar pago'
      ),
      { status: 500 }
    );
  }
}
