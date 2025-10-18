import { NextRequest, NextResponse } from 'next/server';
import { UpdateReviewRequestSchema, ReviewResponseSchema } from '@/lib/schemas/review';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { requireAuth } from '@/lib/auth/middleware';
import { updateReview, getReviewById } from '@/lib/db/queries/review';

/**
 * Update review
 * @description Update an existing review
 * @param params.id {string} The review ID
 * @body UpdateReviewRequestSchema
 * @response 200:ReviewResponseSchema:Review updated successfully
 * @response 403:Forbidden - Not the author of the review
 * @response 404:Not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(request);
    if (!auth.success) {
      return auth.response;
    }
    const { userId } = auth.user;

    const { id } = await params;

    const existingReview = await getReviewById(id);
    if (!existingReview) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Review not found'),
        { status: 404 }
      );
    }

    if (existingReview.reviewerId !== userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'You are not the author of this review'),
        { status: 403 }
      );
    }

    const validation = await validateRequest(request, UpdateReviewRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { rating, comment } = validation.data;

    const review = await updateReview(id, { rating, comment });

    const responseData = { review };
    const responseValidation = ReviewResponseSchema.safeParse(responseData);
    
    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, 'Review updated successfully')
    );

  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update review'
      ),
      { status: 500 }
    );
  }
}
