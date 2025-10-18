import { NextRequest, NextResponse } from 'next/server';
import { GetProfessionsQuerySchema, ProfessionsListResponseSchema } from '@/lib/schemas/profession';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { getProfessions } from '@/lib/db/queries/profession';

/**
 * Get professions list
 * @description Retrieve paginated list of professions with optional search filter
 * @query GetProfessionsQuerySchema
 * @response 200:ProfessionsListResponseSchema:Professions retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetProfessionsQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { page, limit, search } = validation.data;

    // Get professions with filters and pagination
    const { professions, total } = await getProfessions({
      page,
      limit,
      search,
    });

    // Prepare response data
    const responseData = {
      professions,
      total,
    };

    // Validate response
    const responseValidation = ProfessionsListResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues,
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginationResponse(
        professions,
        total,
        page,
        limit,
        'Professions retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get professions error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professions'
      ),
      { status: 500 }
    );
  }
}
