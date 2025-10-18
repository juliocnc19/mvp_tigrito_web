import { NextRequest, NextResponse } from 'next/server';
import { GetProfessionalsQuerySchema, ProfessionalsListResponseSchema } from '@/lib/schemas/professional';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionals } from '@/lib/db/queries/professional';

/**
 * Get professionals list
 * @description Retrieve paginated list of professionals with optional filters
 * @query GetProfessionalsQuerySchema
 * @response 200:ProfessionalsListResponseSchema:Professionals retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Optional authentication (public endpoint but better with auth)
    const auth = optionalAuth(request);

    // Validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetProfessionalsQuerySchema.safeParse(queryParams);
    
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
      specialty,
      minRating,
      maxHourlyRate,
      minExperience,
      isVerified,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    } = validation.data;

    // Get professionals with filters and pagination
    const { professionals, total } = await getProfessionals({
      page,
      limit,
      specialty,
      minRating,
      maxHourlyRate,
      minExperience,
      isVerified,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    });

    // Prepare response data
    const responseData = {
      professionals,
      total,
    };

    // Validate response
    const responseValidation = ProfessionalsListResponseSchema.safeParse(responseData);
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
        professionals,
        total,
        page,
        limit,
        'Professionals retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get professionals error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professionals'
      ),
      { status: 500 }
    );
  }
}
