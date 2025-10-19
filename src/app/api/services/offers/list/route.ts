import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get offers list for admin
 * @description Retrieve paginated list of offers with filters
 * @query page, limit, status, search
 * @response 200:Offers retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { professional: { name: { contains: search, mode: 'insensitive' } } },
        { professional: { email: { contains: search, mode: 'insensitive' } } },
        { posting: { title: { contains: search, mode: 'insensitive' } } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get offers with pagination
    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          professional: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          posting: {
            select: {
              id: true,
              title: true,
              description: true,
              priceMin: true,
              priceMax: true,
              status: true,
              client: {
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
      prisma.offer.count({ where }),
    ]);

    // Map offers data
    const offersData = offers.map(offer => ({
      id: offer.id,
      postingId: offer.postingId,
      professionalId: offer.professionalId,
      price: offer.price.toNumber(),
      proposedPrice: offer.proposedPrice?.toNumber() || null,
      message: offer.message,
      status: offer.status,
      createdAt: offer.createdAt.toISOString(),
      professional: offer.professional,
      posting: offer.posting,
    }));

    return NextResponse.json(
      createSuccessResponse(
        offersData,
        'Ofertas obtenidas exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get offers error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener ofertas'
      ),
      { status: 500 }
    );
  }
}
