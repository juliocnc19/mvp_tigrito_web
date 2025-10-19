import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete promo code
 * @description Delete a promo code by ID
 * @response 200:Promo code deleted successfully
 * @response 404:Promo code not found
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
          'ID de código de promoción inválido'
        ),
        { status: 422 }
      );
    }

    // Check if promo code exists
    const existingPromoCode = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!existingPromoCode) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Código de promoción no encontrado'
        ),
        { status: 404 }
      );
    }

    // Check if promo code has been used
    if (existingPromoCode.usesCount > 0) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No se puede eliminar un código de promoción que ha sido utilizado'
        ),
        { status: 400 }
      );
    }

    // Delete promo code
    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json(
      createSuccessResponse(null, 'Código de promoción eliminado exitosamente')
    );

  } catch (error) {
    console.error('Delete promo code error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al eliminar código de promoción'
      ),
      { status: 500 }
    );
  }
}
