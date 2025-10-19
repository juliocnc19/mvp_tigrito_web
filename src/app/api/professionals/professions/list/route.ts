import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalProfessionLinks } from '@/lib/db/queries/profession';

/**
 * Get professional profession links
 * @description Retrieve all profession links for the authenticated professional
 * @response 200:ProfessionalProfessionLinksListResponseSchema:Profession links retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Test 1: Validate userId parameter is required
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'userId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Test 2: Validate profession links retrieval
    const professionLinks = await getProfessionalProfessionLinks(userId);

    // Prepare response data
    const responseData = {
      professionLinks,
      total: professionLinks.length,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profession links retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional profession links error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional profession links'
      ),
      { status: 500 }
    );
  }
}
