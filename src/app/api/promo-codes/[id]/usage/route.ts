import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get promo code usage history
 * @description Retrieve detailed usage history for a promo code
 * @response 200:Usage history retrieved successfully
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

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Check if promo code exists
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      select: { id: true, code: true },
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

    // Get usage history with pagination
    const [usageHistory, total] = await Promise.all([
      prisma.promoCodeUsage.findMany({
        where: { promoCodeId: id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { usedAt: 'desc' },
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
            select: {
              id: true,
              priceAgreed: true,
              discountAmount: true,
              currentStatus: true,
              createdAt: true,
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
          },
        },
      }),
      prisma.promoCodeUsage.count({
        where: { promoCodeId: id },
      }),
    ]);

    // Map usage history data
    const usageData = usageHistory.map(usage => ({
      id: usage.id,
      userId: usage.userId,
      promoCodeId: usage.promoCodeId,
      transactionId: usage.transactionId,
      usedAt: usage.usedAt.toISOString(),
      user: usage.user,
      transaction: usage.transaction,
    }));

    return NextResponse.json(
      createSuccessResponse(
        usageData,
        'Historial de uso obtenido exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get promo code usage error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener historial de uso'
      ),
      { status: 500 }
    );
  }
}
