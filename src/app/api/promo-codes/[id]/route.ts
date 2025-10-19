import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get promo code by ID
 * @description Retrieve a specific promo code with details
 * @response 200:Promo code retrieved successfully
 * @response 404:Promo code not found
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
          'ID de código de promoción inválido'
        ),
        { status: 422 }
      );
    }

    // Get promo code with details
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: {
        usageHistory: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
          orderBy: { usedAt: 'desc' },
        },
        transactions: {
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
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            usageHistory: true,
            transactions: true,
          },
        },
      },
    });

    if (!promoCode) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Código de promoción no encontrado'
        ),
        { status: 404 }
      );
    }

    // Map promo code data
    const promoCodeData = {
      id: promoCode.id,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue.toNumber(),
      maxUses: promoCode.maxUses,
      usesCount: promoCode.usesCount,
      maxUsesPerUser: promoCode.maxUsesPerUser,
      validFrom: promoCode.validFrom.toISOString(),
      validUntil: promoCode.validUntil?.toISOString() || null,
      targetCategory: promoCode.targetCategory,
      isActive: promoCode.isActive,
      createdAt: promoCode.createdAt.toISOString(),
      usageHistory: promoCode.usageHistory,
      transactions: promoCode.transactions,
      totalUses: promoCode._count.usageHistory,
      totalTransactions: promoCode._count.transactions,
    };

    return NextResponse.json(
      createSuccessResponse(promoCodeData, 'Código de promoción obtenido exitosamente')
    );

  } catch (error) {
    console.error('Get promo code error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener código de promoción'
      ),
      { status: 500 }
    );
  }
}
