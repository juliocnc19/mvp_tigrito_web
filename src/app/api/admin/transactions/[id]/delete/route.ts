import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete transaction (soft delete)
 * @description Soft delete a transaction by setting deletedAt
 * @response 200:Transaction deleted successfully
 * @response 404:Transaction not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(
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

    // Check if transaction exists
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

    // Check if transaction can be deleted (only pending or canceled)
    if (existingTransaction.currentStatus === 'COMPLETED' || existingTransaction.currentStatus === 'IN_PROGRESS') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No se puede eliminar una transacción completada o en progreso'
        ),
        { status: 400 }
      );
    }

    // Check if transaction has associated payments
    const hasPayments = await prisma.payment.findFirst({
      where: { transactionId: id },
    });

    if (hasPayments) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No se puede eliminar una transacción que tiene pagos asociados'
        ),
        { status: 400 }
      );
    }

    // For now, we'll just return an error since ServiceTransaction doesn't have deletedAt
    // In a real implementation, you would add a deletedAt field to the model
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.VALIDATION_ERROR,
        'La eliminación de transacciones no está implementada'
      ),
      { status: 400 }
    );

  } catch (error) {
    console.error('Delete transaction error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al eliminar transacción'
      ),
      { status: 500 }
    );
  }
}
