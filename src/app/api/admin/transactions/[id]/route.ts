import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get transaction by ID for admin
 * @description Retrieve a specific transaction with full details for admin
 * @response 200:Transaction retrieved successfully
 * @response 404:Transaction not found
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
          'ID de transacción inválido'
        ),
        { status: 422 }
      );
    }

    // Get transaction with full details
    const transaction = await prisma.serviceTransaction.findUnique({
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
            locationAddress: true,
          },
        },
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            isIDVerified: true,
            locationAddress: true,
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
        proService: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
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
        offer: {
          include: {
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            posting: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        payment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            reviewed: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        promoCode: {
          select: {
            id: true,
            code: true,
            discountType: true,
            discountValue: true,
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
        reports: {
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            reportedUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Transacción no encontrada'
        ),
        { status: 404 }
      );
    }

    // Map transaction data
    const transactionData = {
      id: transaction.id,
      clientId: transaction.clientId,
      professionalId: transaction.professionalId,
      priceAgreed: transaction.priceAgreed.toNumber(),
      discountAmount: transaction.discountAmount.toNumber(),
      platformFee: transaction.platformFee.toNumber(),
      escrowAmount: transaction.escrowAmount.toNumber(),
      currentStatus: transaction.currentStatus,
      status: transaction.status,
      scheduledDate: transaction.scheduledDate?.toISOString() || null,
      postingId: transaction.postingId,
      proServiceId: transaction.proServiceId,
      promoCodeId: transaction.promoCodeId,
      yummyLogistics: transaction.yummyLogistics,
      notes: transaction.notes,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      completedAt: transaction.completedAt?.toISOString() || null,
      agreedPrice: transaction.agreedPrice?.toNumber() || null,
      offerId: transaction.offerId,
      client: transaction.client,
      professional: transaction.professional,
      posting: transaction.posting,
      proService: transaction.proService,
      offer: transaction.offer,
      payment: transaction.payment,
      reviews: transaction.reviews,
      promoCode: transaction.promoCode,
      media: transaction.media,
      reports: transaction.reports,
    };

    return NextResponse.json(
      createSuccessResponse(transactionData, 'Transacción obtenida exitosamente')
    );

  } catch (error) {
    console.error('Get transaction error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener transacción'
      ),
      { status: 500 }
    );
  }
}
