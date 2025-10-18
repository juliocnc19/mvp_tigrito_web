import { NextRequest, NextResponse } from 'next/server';
import { ProfessionResponseSchema } from '@/lib/schemas/profession';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { getProfessionById } from '@/lib/db/queries/profession';

/**
 * Get profession by ID
 * @description Retrieve a single profession by its ID
 * @param params.id {string} The profession ID
 * @response 200:ProfessionResponseSchema:Profession retrieved successfully
 * @response 404:Not found
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const profession = await getProfessionById(id);

    if (!profession) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Profession not found'
        ),
        { status: 404 }
      );
    }

    const responseData = { profession };
    const responseValidation = ProfessionResponseSchema.safeParse(responseData);

    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, 'Profession retrieved successfully')
    );
  } catch (error) {
    console.error('Get profession by ID error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve profession'
      ),
      { status: 500 }
    );
  }
}
