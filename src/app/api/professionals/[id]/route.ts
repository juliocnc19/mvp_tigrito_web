import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalById } from '@/lib/db/queries/professional';

/**
 * Get professional by ID
 * @description Retrieve a specific professional's profile by ID
 * @response 200:ProfessionalProfileResponseSchema:Professional retrieved successfully
 * @add 404:Professional not found
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

    // Get professional by ID
    const professional = await getProfessionalById(id);
    if (!professional) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional not found'
        ),
        { status: 404 }
      );
    }

    // Prepare response data
    const responseData = {
      professional,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional'
      ),
      { status: 500 }
    );
  }
}
