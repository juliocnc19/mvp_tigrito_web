import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get postings list for admin
 * @description Retrieve paginated list of postings with admin details
 * @query page, limit, status, category, search
 * @response 200:Postings retrieved successfully
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
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {
      deletedAt: null, // Only non-deleted postings
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (category && category !== 'all') {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { client: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get postings with pagination
    const [postings, total] = await Promise.all([
      prisma.servicePosting.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              isVerified: true,
              isIDVerified: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          offers: {
            select: {
              id: true,
              price: true,
              status: true,
              createdAt: true,
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
          transaction: {
            select: {
              id: true,
              currentStatus: true,
              priceAgreed: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              offers: true,
            },
          },
        },
      }),
      prisma.servicePosting.count({ where }),
    ]);

    // Map postings data
    const postingsData = postings.map(posting => ({
      id: posting.id,
      clientId: posting.clientId,
      title: posting.title,
      description: posting.description,
      categoryId: posting.categoryId,
      lat: posting.lat,
      lng: posting.lng,
      address: posting.address,
      requiredFrom: posting.requiredFrom?.toISOString() || null,
      requiredTo: posting.requiredTo?.toISOString() || null,
      priceMin: posting.priceMin?.toNumber() || null,
      priceMax: posting.priceMax?.toNumber() || null,
      status: posting.status,
      createdAt: posting.createdAt.toISOString(),
      updatedAt: posting.updatedAt.toISOString(),
      expiresAt: posting.expiresAt?.toISOString() || null,
      transactionId: posting.transactionId,
      budget: posting.budget?.toNumber() || null,
      deletedAt: posting.deletedAt?.toISOString() || null,
      locationLat: posting.locationLat,
      locationLng: posting.locationLng,
      client: posting.client,
      category: posting.category,
      offers: posting.offers,
      transaction: posting.transaction,
      offersCount: posting._count.offers,
    }));

    return NextResponse.json(
      createSuccessResponse(
        postingsData,
        'Solicitudes obtenidas exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get postings error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener solicitudes'
      ),
      { status: 500 }
    );
  }
}
