import { NextRequest, NextResponse } from 'next/server';
import { GetReviewsQuerySchema, ReviewsListResponseSchema } from '@/lib/schemas/review';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { getReviews } from '@/lib/db/queries/review';

/**
 * Get reviews list
 * @description Retrieve paginated list of reviews with optional filters
 * @query GetReviewsQuerySchema
 * @response 200:ReviewsListResponseSchema:Reviews retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetReviewsQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { page, limit, reviewerId, reviewedId, transactionId, isProReview } = validation.data;

    const { reviews, total } = await getReviews({
      page,
      limit,
      reviewerId,
      reviewedId,
      transactionId,
      isProReview,
    });

    const responseData = { reviews, total };
    const responseValidation = ReviewsListResponseSchema.safeParse(responseData);

    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues,
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginationResponse(
        reviews,
        total,
        page,
        limit,
        'Reviews retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve reviews'
      ),
      { status: 500 }
    );
  }
}
