import { NextRequest, NextResponse } from 'next/server';
import { UpdateReviewRequestSchema } from '@/lib/schemas/review';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
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
    const { id } = await params;

    const validation = await validateRequest(request, UpdateReviewRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { userId, rating, comment } = validation.data;

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

    const review = await updateReview(id, { userId, rating, comment });

    const responseData = { review };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Review updated successfully')
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
