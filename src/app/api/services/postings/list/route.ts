import { NextRequest, NextResponse } from 'next/server';
import { GetServicePostingsQuerySchema, ServicePostingsListResponseSchema } from '@/lib/schemas/service';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getServicePostings } from '@/lib/db/queries/service';

/**
 * Get service postings
 * @description Retrieve a paginated list of service postings with optional filters
 * @query GetServicePostingsQuerySchema
 * @response 200:ServicePostingsListResponseSchema:Service postings retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    // Validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetServicePostingsQuerySchema.safeParse(queryParams);
    
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

    const {
      page,
      limit,
      status,
      category,
      minBudget,
      maxBudget,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    } = validation.data;

    // Get service postings with filters and pagination
    const { postings, total } = await getServicePostings({
      page,
      limit,
      status,
      category,
      minBudget,
      maxBudget,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    });

    // Prepare response data
    const postingsData = postings.map(posting => ({
      id: posting.id,
      clientId: posting.clientId,
      title: posting.title,
      description: posting.description,
      category: posting.category,
      budget: posting.budget,
      deadline: posting.deadline?.toISOString() || null,
      status: posting.status,
      location: posting.location,
      locationLat: posting.locationLat,
      locationLng: posting.locationLng,
      createdAt: posting.createdAt.toISOString(),
      updatedAt: posting.updatedAt.toISOString(),
      deletedAt: posting.deletedAt?.toISOString() || null,
    }));

    const responseData = {
      postings: postingsData,
      total,
    };

    // Validate response
    const responseValidation = ServicePostingsListResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginationResponse(
        postingsData,
        total,
        page,
        limit,
        'Service postings retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get service postings error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve service postings'
      ),
      { status: 500 }
    );
  }
}
