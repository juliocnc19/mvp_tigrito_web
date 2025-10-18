import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getOfferById, updateOfferStatus } from '@/lib/db/queries/offer';

/**
 * Reject offer
 * @description Reject a service offer
 * @response 200:Offer rejected successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: offerId } = await params;
    const auth = optionalAuth(request);

    if (!auth?.user?.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      );
    }

    // Get the offer with posting details
    const offer = await getOfferById(offerId);
    if (!offer) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Offer not found'),
        { status: 404 }
      );
    }

    // Check if user is the posting owner (client)
    if ((offer as any).posting.clientId !== auth.user.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Only the posting owner can reject offers'),
        { status: 403 }
      );
    }

    // Check if offer is still pending
    if (offer.status !== 'PENDING') {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.CONFLICT, 'Offer has already been processed'),
        { status: 409 }
      );
    }

    // Update offer status to REJECTED
    const updatedOffer = await updateOfferStatus(offerId, 'REJECTED');

    return NextResponse.json(
      createSuccessResponse(
        {
          offer: {
            id: updatedOffer.id,
            status: updatedOffer.status,
            updatedAt: updatedOffer.createdAt.toISOString(),
          },
        },
        'Offer rejected successfully'
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Reject offer error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to reject offer'
      ),
      { status: 500 }
    );
  }
}
