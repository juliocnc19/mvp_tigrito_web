import { NextRequest, NextResponse } from 'next/server';
import { CreateReviewRequestSchema } from '@/lib/schemas/review';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createReview } from '@/lib/db/queries/review';
import { getServiceTransactionById } from '@/lib/db/queries/transaction';

/**
 * Create review
 * @description Create a new review for a service transaction
 * @body CreateReviewRequestSchema
 * @response 201:ReviewResponseSchema:Review created successfully
 * @response 403:Forbidden - Not a participant of the transaction
 * @response 404:Not found - Transaction not found
 * @response 409:Conflict - Review already submitted for this transaction by the user
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, CreateReviewRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { userId, transactionId, reviewedId, rating, comment, isProReview } = validation.data;

    const transaction = await getServiceTransactionById(transactionId);

    if (!transaction) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Service transaction not found'),
        { status: 404 }
      );
    }
    
    if (transaction.clientId !== userId && transaction.professionalId !== userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'You are not a participant in this transaction'),
        { status: 403 }
      );
    }

    // Check if user has already reviewed
    const existingReview = transaction.reviews.find(r => r.reviewerId === userId);
    if (existingReview) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.CONFLICT, 'You have already submitted a review for this transaction'),
        { status: 409 }
      );
    }

    const review = await createReview(userId, { userId, transactionId, reviewedId, rating, comment, isProReview });

    const responseData = { review };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Review created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create review'
      ),
      { status: 500 }
    );
  }
}
