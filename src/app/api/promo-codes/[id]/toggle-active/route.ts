import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Toggle promo code active status
 * @description Toggle the active status of a promo code
 * @response 200:Promo code status updated successfully
 * @response 404:Promo code not found
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
          'ID de código de promoción inválido'
        ),
        { status: 422 }
      );
    }

    // Get promo code
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

    // Toggle active status
    const updatedPromoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        isActive: !existingPromoCode.isActive,
      },
    });

    // Map promo code data for response
    const promoCodeData = {
      id: updatedPromoCode.id,
      code: updatedPromoCode.code,
      discountType: updatedPromoCode.discountType,
      discountValue: updatedPromoCode.discountValue.toNumber(),
      maxUses: updatedPromoCode.maxUses,
      usesCount: updatedPromoCode.usesCount,
      maxUsesPerUser: updatedPromoCode.maxUsesPerUser,
      validFrom: updatedPromoCode.validFrom.toISOString(),
      validUntil: updatedPromoCode.validUntil?.toISOString() || null,
      targetCategory: updatedPromoCode.targetCategory,
      isActive: updatedPromoCode.isActive,
      createdAt: updatedPromoCode.createdAt.toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(
        promoCodeData, 
        `Código de promoción ${updatedPromoCode.isActive ? 'activado' : 'desactivado'} exitosamente`
      )
    );

  } catch (error) {
    console.error('Toggle promo code active status error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al cambiar estado del código de promoción'
      ),
      { status: 500 }
    );
  }
}
