import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get promo codes list for admin
 * @description Retrieve paginated list of promo codes with filters
 * @query page, limit, isActive, discountType, search
 * @response 200:Promo codes retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isActive = searchParams.get('isActive');
    const discountType = searchParams.get('discountType');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (isActive && isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    if (discountType && discountType !== 'all') {
      where.discountType = discountType;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { targetCategory: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get promo codes with pagination
    const [promoCodes, total] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          usageHistory: {
            select: {
              id: true,
              userId: true,
              usedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: { usedAt: 'desc' },
            take: 5, // Limit to last 5 uses for performance
          },
          _count: {
            select: {
              usageHistory: true,
              transactions: true,
            },
          },
        },
      }),
      prisma.promoCode.count({ where }),
    ]);

    // Map promo codes data
    const promoCodesData = promoCodes.map(promoCode => ({
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
      totalUses: promoCode._count.usageHistory,
      totalTransactions: promoCode._count.transactions,
    }));

    return NextResponse.json(
      createSuccessResponse(
        promoCodesData,
        'Códigos de promoción obtenidos exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get promo codes error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener códigos de promoción'
      ),
      { status: 500 }
    );
  }
}
