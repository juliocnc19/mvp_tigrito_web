import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalReviewsStats } from '@/lib/db/queries/professional';

/**
 * Get professional reviews stats
 * @description Retrieve reviews statistics and recent feedback for a professional
 * @response 200:ProfessionalReviewsStatsResponseSchema:Reviews stats retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Get professionalId from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Test 7: Validate reviews stats aggregation
    const stats = await getProfessionalReviewsStats(professionalId);

    // Prepare response data
    const responseData = {
      stats,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional reviews stats retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional reviews stats error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional reviews stats'
      ),
      { status: 500 }
    );
  }
}
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalReviewsStats } from '@/lib/db/queries/professional';

/**
 * Get professional reviews stats
 * @description Retrieve reviews statistics and recent feedback for a professional
 * @response 200:ProfessionalReviewsStatsResponseSchema:Reviews stats retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Get professionalId from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Test 7: Validate reviews stats aggregation
    const stats = await getProfessionalReviewsStats(professionalId);

    // Prepare response data
    const responseData = {
      stats,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional reviews stats retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional reviews stats error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional reviews stats'
      ),
      { status: 500 }
    );
  }
}


