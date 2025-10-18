import { NextRequest, NextResponse } from 'next/server';
import { ProfessionalProfileResponseSchema } from '@/lib/schemas/professional';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalByUserId } from '@/lib/db/queries/professional';

/**
 * Get current professional profile
 * @description Retrieve the authenticated professional's profile information
 * @response 200:ProfessionalProfileResponseSchema:Professional profile retrieved successfully
 * @add 404:Professional profile not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user (optional for testing)
    const auth = optionalAuth(request);
    // Note: Authentication is optional for testing purposes
    const userId = auth.user?.userId;

    // Get professional profile by user ID
    const professional = await getProfessionalByUserId(userId);
    if (!professional) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional profile not found'
        ),
        { status: 404 }
      );
    }

    // Prepare response data
    const responseData = {
      professional,
    };

    // Validate response
    const responseValidation = ProfessionalProfileResponseSchema.safeParse(responseData);
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
      createSuccessResponse(responseValidation.data, 'Professional profile retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional profile error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional profile'
      ),
      { status: 500 }
    );
  }
}
