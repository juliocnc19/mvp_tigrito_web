import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalPortfolios } from '@/lib/db/queries/professional';

/**
 * Get professional portfolio items
 * @description Retrieve all portfolio items for a professional
 * @response 200:ProfessionalPortfoliosListResponseSchema:Portfolio items retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Test 4: Validate professionalId parameter and portfolio retrieval
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

    // Get portfolio items for the professional
    const portfolios = await getProfessionalPortfolios(professionalId);

    // Prepare response data
    const responseData = {
      portfolios,
      total: portfolios.length,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional portfolio items retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional portfolio items error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional portfolio items'
      ),
      { status: 500 }
    );
  }
}
