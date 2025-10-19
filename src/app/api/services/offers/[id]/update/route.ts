import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating offer status
const UpdateOfferStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']),
  adminNotes: z.string().optional(),
});

/**
 * Update offer status
 * @description Update offer status and admin notes
 * @body UpdateOfferStatusSchema
 * @response 200:Offer updated successfully
 * @response 404:Offer not found
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
          'ID de oferta inválido'
        ),
        { status: 422 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateOfferStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Datos de solicitud inválidos',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    // Get offer
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Oferta no encontrada'
        ),
        { status: 404 }
      );
    }

    // Update offer
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        status: validation.data.status,
      },
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
    });

    // Map offer data
    const offerData = {
      id: updatedOffer.id,
      postingId: updatedOffer.postingId,
      professionalId: updatedOffer.professionalId,
      price: updatedOffer.price.toNumber(),
      proposedPrice: updatedOffer.proposedPrice?.toNumber() || null,
      message: updatedOffer.message,
      status: updatedOffer.status,
      createdAt: updatedOffer.createdAt.toISOString(),
      professional: updatedOffer.professional,
      posting: updatedOffer.posting,
    };

    return NextResponse.json(
      createSuccessResponse(offerData, 'Oferta actualizada exitosamente')
    );

  } catch (error) {
    console.error('Update offer error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar oferta'
      ),
      { status: 500 }
    );
  }
}
