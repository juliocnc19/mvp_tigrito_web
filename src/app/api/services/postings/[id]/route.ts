import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get posting by ID for admin
 * @description Retrieve a specific posting with full details for admin
 * @response 200:Posting retrieved successfully
 * @response 404:Posting not found
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
          'ID de solicitud inválido'
        ),
        { status: 422 }
      );
    }

    // Get posting with full details
    const posting = await prisma.servicePosting.findUnique({
      where: { id },
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
            description: true,
          },
        },
        offers: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                professionalProfile: {
                  select: {
                    bio: true,
                    rating: true,
                    ratingCount: true,
                    yearsOfExperience: true,
                    specialties: true,
                  },
                },
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
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        media: {
          select: {
            id: true,
            url: true,
            type: true,
            filename: true,
          },
        },
      },
    });

    if (!posting) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Solicitud no encontrada'
        ),
        { status: 404 }
      );
    }

    // Map posting data
    const postingData = {
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
      media: posting.media,
    };

    return NextResponse.json(
      createSuccessResponse(postingData, 'Solicitud obtenida exitosamente')
    );

  } catch (error) {
    console.error('Get posting error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener solicitud'
      ),
      { status: 500 }
    );
  }
}
