import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalDashboardStats } from '@/lib/db/queries/professional';

/**
 * Get professional dashboard stats
 * @description Retrieve comprehensive dashboard statistics for a professional
 * @response 200:ProfessionalDashboardStatsResponseSchema:Dashboard stats retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Test 9: Validate professionalId parameter and dashboard stats calculation
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

    // Test 13: Validate dashboard stats retrieval and response formatting
    const stats = await getProfessionalDashboardStats(professionalId);

    // Prepare response data
    const responseData = {
      stats,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional dashboard stats retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional dashboard stats error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional dashboard stats'
      ),
      { status: 500 }
    );
  }
}
