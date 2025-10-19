import { NextRequest, NextResponse } from 'next/server';
import { CreateServiceOfferRequestSchema } from '@/lib/schemas/service';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createServiceOffer, getServiceOfferById } from '@/lib/db/queries/service';

/**
 * Create service offer
 * @description Create a new service offer for a posting
 * @body CreateServiceOfferRequestSchema
 * @response ServiceOfferResponseSchema
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, CreateServiceOfferRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const {
      userId,
      postingId,
      proposedPrice,
      description,
      estimatedDuration,
    } = validation.data;

    // Create service offer
    const offer = await createServiceOffer({
      postingId,
      professionalId: userId,
      proposedPrice,
      description,
      estimatedDuration,
    });

    // Get the created offer with relations
    const createdOffer = await getServiceOfferById(offer.id);

    // Prepare response data
    const responseData = {
      offer: {
        id: createdOffer.id,
        postingId: createdOffer.postingId,
        professionalId: createdOffer.professionalId,
        proposedPrice: createdOffer.proposedPrice,
        description: createdOffer.description,
        estimatedDuration: createdOffer.estimatedDuration,
        status: createdOffer.status,
        createdAt: createdOffer.createdAt.toISOString(),
        updatedAt: createdOffer.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Service offer created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create service offer error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create service offer'
      ),
      { status: 500 }
    );
  }
}
