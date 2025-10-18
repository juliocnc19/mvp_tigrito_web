import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getOfferById, updateOfferStatus } from '@/lib/db/queries/offer';
import { createServiceTransaction, updateServicePostingStatus } from '@/lib/db/queries/service';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const AcceptOfferRequestSchema = z.object({
  agreedPrice: z.number().min(0),
  notes: z.string().optional(),
});

/**
 * Accept offer and create transaction
 * @description Accept a service offer and create a service transaction
 * @body AcceptOfferRequestSchema
 * @response 200:Transaction created successfully
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

    // Parse and validate request body
    const body = await request.json();
    const validation = AcceptOfferRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid request body',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { agreedPrice, notes } = validation.data;

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
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Only the posting owner can accept offers'),
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

    // Check if posting is still open
    if ((offer as any).posting.status !== 'OPEN') {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.CONFLICT, 'Posting is no longer open'),
        { status: 409 }
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update offer status to ACCEPTED
      const updatedOffer = await tx.offer.update({
        where: { id: offerId },
        data: { status: 'ACCEPTED' },
      });

      // Create service transaction
      const transaction = await tx.serviceTransaction.create({
        data: {
          postingId: offer.postingId,
          offerId: offerId,
          clientId: (offer as any).posting.clientId,
          professionalId: offer.professionalId,
          priceAgreed: agreedPrice,
          agreedPrice: agreedPrice,
          currentStatus: 'PENDING_SOLICITUD',
          status: 'PENDING_SOLICITUD',
          notes: notes,
        },
      });

      // Update posting status to CLOSED
      await tx.servicePosting.update({
        where: { id: offer.postingId },
        data: { 
          status: 'CLOSED',
          transactionId: transaction.id,
        },
      });

      // Reject all other pending offers for this posting
      await tx.offer.updateMany({
        where: {
          postingId: offer.postingId,
          id: { not: offerId },
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      });

      return { transaction, offer: updatedOffer };
    });

    return NextResponse.json(
      createSuccessResponse(
        {
          transaction: {
            id: result.transaction.id,
            postingId: result.transaction.postingId,
            offerId: result.transaction.offerId,
            clientId: result.transaction.clientId,
            professionalId: result.transaction.professionalId,
            priceAgreed: result.transaction.priceAgreed.toNumber(),
            status: result.transaction.status,
            createdAt: result.transaction.createdAt.toISOString(),
          },
          offer: {
            id: result.offer.id,
            status: result.offer.status,
            updatedAt: result.offer.createdAt.toISOString(),
          },
        },
        'Offer accepted and transaction created successfully'
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Accept offer error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to accept offer'
      ),
      { status: 500 }
    );
  }
}
