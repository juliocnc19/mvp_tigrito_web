import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get payment by ID
 * @description Retrieve a specific payment with details
 * @response 200:Payment retrieved successfully
 * @response 404:Payment not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(
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

    // Get payment with details
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        transaction: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            posting: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
            proService: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
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

    // Map payment data
    const paymentData = {
      id: payment.id,
      userId: payment.userId,
      transactionId: payment.transactionId,
      amount: payment.amount.toNumber(),
      fee: payment.fee.toNumber(),
      method: payment.method,
      status: payment.status,
      details: payment.details,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      recipientId: payment.recipientId,
      user: payment.user,
      transaction: payment.transaction,
    };

    return NextResponse.json(
      createSuccessResponse(paymentData, 'Pago obtenido exitosamente')
    );

  } catch (error) {
    console.error('Get payment error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener pago'
      ),
      { status: 500 }
    );
  }
}
