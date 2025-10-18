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
  const startTime = Date.now();
  console.log('🚀 [GET /api/professions/list] Starting request');
  
  try {
    // Validate query parameters
    console.log('📝 [GET /api/professions/list] Validating query parameters...');
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    console.log('📝 [GET /api/professions/list] Query params:', queryParams);
    
    const validation = GetProfessionsQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      console.error('❌ [GET /api/professions/list] Validation failed:', validation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    console.log('✅ [GET /api/professions/list] Validation successful');

    const { page, limit, search } = validation.data;

    console.log('🔍 [GET /api/professions/list] Query filters:', {
      page,
      limit,
      search,
    });

    // Get professions with filters and pagination
    console.log('🗄️ [GET /api/professions/list] Calling getProfessions...');
    const { professions, total } = await getProfessions({
      page,
      limit,
      search,
    });

    console.log('✅ [GET /api/professions/list] Database query successful:', {
      professionsCount: professions.length,
      total,
    });
    // Prepare response data
    console.log('🔄 [GET /api/professions/list] Preparing response data...');
    const responseData = {
      professions,
      total,
    };

    // Validate response
    console.log('🔍 [GET /api/professions/list] Validating response schema...');
    const responseValidation = ProfessionsListResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      console.error('❌ [GET /api/professions/list] Response validation failed:', responseValidation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues,
        ),
        { status: 500 }
      );
    }

    console.log('✅ [GET /api/professions/list] Response validation successful');

    const response = NextResponse.json(
      paginationResponse(
        professions,
        total,
        page ?? 1,
        limit ?? 10,
        'Professions retrieved successfully'
      )
    );

    const duration = Date.now() - startTime;
    console.log(`✅ [GET /api/professions/list] Request completed successfully in ${duration}ms`);

    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [GET /api/professions/list] Error after ${duration}ms:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professions'
      ),
      { status: 500 }
    );
  }
}

