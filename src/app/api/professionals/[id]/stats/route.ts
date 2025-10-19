import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalStats } from '@/lib/db/queries/professional';

/**
 * Get professional statistics
 * @description Retrieve statistics for a specific professional
 * @response 200:ProfessionalStatsResponseSchema:Professional statistics retrieved successfully
 * @add 422:Invalid professional ID
 * @responseSet public
 * @openapi
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid professional ID'
        ),
        { status: 422 }
      );
    }

    // Get professional statistics
    const stats = await getProfessionalStats(id);

    // Prepare response data
    const responseData = {
      stats,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional statistics retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional statistics error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional statistics'
      ),
      { status: 500 }
    );
  }
}
