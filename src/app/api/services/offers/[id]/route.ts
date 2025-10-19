import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get offer by ID
 * @description Retrieve a specific offer with details
 * @response 200:Offer retrieved successfully
 * @response 404:Offer not found
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
          'ID de oferta inválido'
        ),
        { status: 422 }
      );
    }

    // Get offer with details
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
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
        posting: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            media: {
              select: {
                id: true,
                url: true,
                type: true,
              },
            },
          },
        },
        transactions: {
          select: {
            id: true,
            currentStatus: true,
            priceAgreed: true,
            createdAt: true,
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Oferta no encontrada'
        ),
        { status: 404 }
      );
    }

    // Map offer data
    const offerData = {
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
      transactions: offer.transactions,
    };

    return NextResponse.json(
      createSuccessResponse(offerData, 'Oferta obtenida exitosamente')
    );

  } catch (error) {
    console.error('Get offer error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener oferta'
      ),
      { status: 500 }
    );
  }
}
