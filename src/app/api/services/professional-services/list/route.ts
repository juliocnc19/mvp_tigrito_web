import { NextRequest, NextResponse } from 'next/server';
import { GetProfessionalServicesQuerySchema, ProfessionalServicesListResponseSchema } from '@/lib/schemas/professional-service';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalServices } from '@/lib/db/queries/professional-service';

/**
 * Get professional services list
 * @description Retrieve paginated list of professional services with optional filters
 * @query GetProfessionalServicesQuerySchema
 * @response 200:ProfessionalServicesListResponseSchema:Services retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetProfessionalServicesQuerySchema.safeParse(queryParams);
    
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

    const { page, limit, professionalId, categoryId, search, isActive, minPrice, maxPrice } = validation.data;

    const { services, total } = await getProfessionalServices({
      page,
      limit,
      professionalId,
      categoryId,
      search,
      isActive,
      minPrice,
      maxPrice,
    });

    const responseData = { services, total };
    const responseValidation = ProfessionalServicesListResponseSchema.safeParse(responseData);

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
        services,
        total,
        page,
        limit,
        'Professional services retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get professional services error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional services'
      ),
      { status: 500 }
    );
  }
}
