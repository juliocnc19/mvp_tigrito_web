import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalEarningsStats } from '@/lib/db/queries/professional';

/**
 * Get professional earnings stats
 * @description Retrieve earnings statistics for a professional
 * @query period: string (optional) - Time period (month, quarter, year)
 * @response 200:ProfessionalEarningsStatsResponseSchema:Earnings stats retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Get professionalId and period from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');
    const period = request.nextUrl.searchParams.get('period'); // Optional: month, quarter, year

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Get earnings stats
    const stats = await getProfessionalEarningsStats(professionalId, period || undefined);

    // Prepare response data
    const responseData = {
      stats,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional earnings stats retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional earnings stats error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional earnings stats'
      ),
      { status: 500 }
    );
  }
}