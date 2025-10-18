import { NextRequest, NextResponse } from 'next/server';
import { GetProfessionalsQuerySchema, ProfessionalsListResponseSchema } from '@/lib/schemas/professional';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionals } from '@/lib/db/queries/professional';

/**
 * Get professionals list
 * @description Retrieve paginated list of professionals with optional filters
 * @query GetProfessionalsQuerySchema
 * @response 200:ProfessionalsListResponseSchema:Professionals retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 [GET /api/professionals/list] Starting request');
  
  try {
    // Optional authentication (public endpoint but better with auth)
    console.log('🔐 [GET /api/professionals/list] Checking authentication...');
    const auth = optionalAuth(request);
    console.log('🔐 [GET /api/professionals/list] Auth result:', auth ? 'authenticated' : 'anonymous');

    // Validate query parameters
    console.log('📝 [GET /api/professionals/list] Validating query parameters...');
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    console.log('📝 [GET /api/professionals/list] Query params:', queryParams);
    
    const validation = GetProfessionalsQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      console.error('❌ [GET /api/professionals/list] Validation failed:', validation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    console.log('✅ [GET /api/professionals/list] Validation successful');

    const {
      page,
      limit,
      specialty,
      minRating,
      maxHourlyRate,
      minExperience,
      isVerified,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    } = validation.data;

    console.log('🔍 [GET /api/professionals/list] Query filters:', {
      page,
      limit,
      specialty,
      minRating,
      maxHourlyRate,
      minExperience,
      isVerified,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    });

    // Get professionals with filters and pagination
    console.log('🗄️ [GET /api/professionals/list] Calling getProfessionals...');
    const { professionals, total } = await getProfessionals({
      page,
      limit,
      specialty,
      minRating,
      maxHourlyRate,
      minExperience,
      isVerified,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    });

    console.log('✅ [GET /api/professionals/list] Database query successful:', {
      professionalsCount: professionals.length,
      total,
    });

    // Prepare response data
    console.log('🔄 [GET /api/professionals/list] Preparing response data...');
    const responseData = {
      professionals,
      total,
    };

    // Validate response
    console.log('🔍 [GET /api/professionals/list] Validating response schema...');
    const responseValidation = ProfessionalsListResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      console.error('❌ [GET /api/professionals/list] Response validation failed:', responseValidation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    console.log('✅ [GET /api/professionals/list] Response validation successful');

    const response = NextResponse.json(
      paginationResponse(
        professionals,
        total,
        page ?? 1,
        limit ?? 10,
        'Professionals retrieved successfully'
      )
    );

    const duration = Date.now() - startTime;
    console.log(`✅ [GET /api/professionals/list] Request completed successfully in ${duration}ms`);

    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [GET /api/professionals/list] Error after ${duration}ms:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professionals'
      ),
      { status: 500 }
    );
  }
}
