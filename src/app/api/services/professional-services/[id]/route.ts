import { NextRequest, NextResponse } from 'next/server';
import { ProfessionalServiceResponseSchema } from '@/lib/schemas/professional-service';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { getProfessionalServiceById } from '@/lib/db/queries/professional-service';

/**
 * Get professional service by ID
 * @description Retrieve a single professional service by ID
 * @response 200:ProfessionalServiceResponseSchema:Service retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(
  request: NextRequest,
) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    console.log('id', id);
    if (!id) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.VALIDATION_ERROR, 'id query parameter is required'),
        { status: 400 }
      );
    }
    const service = await getProfessionalServiceById(id);
    if (!service) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Professional service not found'),
        { status: 404 }
      );
    }


    return NextResponse.json(
      createSuccessResponse(service, 'Professional service retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional service error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional service'
      ),
      { status: 500 }
    );
  }
}
