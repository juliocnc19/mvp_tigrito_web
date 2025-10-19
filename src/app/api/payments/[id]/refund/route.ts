import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for refund request
const RefundRequestSchema = z.object({
  reason: z.string().min(1, 'La razón del reembolso es requerida'),
  adminNotes: z.string().optional(),
});

/**
 * Process payment refund
 * @description Process a refund for a completed payment
 * @body RefundRequestSchema
 * @response 200:Payment refunded successfully
 * @response 400:Payment cannot be refunded
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
    const validation = RefundRequestSchema.safeParse(body);
    
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
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Pago no encontrado'
        ),
        { status: 404 }
      );
    }

    // Check if payment can be refunded
    if (payment.status !== 'COMPLETED') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Solo se pueden reembolsar pagos completados'
        ),
        { status: 400 }
      );
    }

    // Update payment status to refunded
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        details: {
          ...payment.details as any,
          refundReason: validation.data.reason,
          refundedAt: new Date().toISOString(),
          adminNotes: validation.data.adminNotes,
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
      createSuccessResponse(paymentData, 'Pago reembolsado exitosamente')
    );

  } catch (error) {
    console.error('Refund payment error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al procesar reembolso'
      ),
      { status: 500 }
    );
  }
}
