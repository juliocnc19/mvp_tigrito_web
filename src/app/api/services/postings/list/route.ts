import { NextRequest, NextResponse } from 'next/server';
import { GetServicePostingsQuerySchema, ServicePostingsListResponseSchema } from '@/lib/schemas/service';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getServicePostings } from '@/lib/db/queries/service';

/**
 * Get service postings
 * @description Retrieve a paginated list of service postings with optional filters
 * @query GetServicePostingsQuerySchema
 * @response ServicePostingsListResponseSchema
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 [GET /api/services/postings/list] Starting request');
  
  try {
    // Optional authentication (public endpoint)
    console.log('🔐 [GET /api/services/postings/list] Checking authentication...');
    const auth = optionalAuth(request);
    console.log('🔐 [GET /api/services/postings/list] Auth result:', auth ? 'authenticated' : 'anonymous');

    // Validate query parameters
    console.log('📝 [GET /api/services/postings/list] Validating query parameters...');
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    console.log('📝 [GET /api/services/postings/list] Query params:', queryParams);
    
    const validation = GetServicePostingsQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      console.error('❌ [GET /api/services/postings/list] Validation failed:', validation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    console.log('✅ [GET /api/services/postings/list] Validation successful');

    const {
      page,
      limit,
      status,
      category,
      minBudget,
      maxBudget,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    } = validation.data;

    console.log('🔍 [GET /api/services/postings/list] Query filters:', {
      page,
      limit,
      status,
      category,
      minBudget,
      maxBudget,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    });

    // Get service postings with filters and pagination
    console.log('🗄️ [GET /api/services/postings/list] Calling getServicePostings...');
    const { postings, total } = await getServicePostings({
      page,
      limit,
      status,
      category,
      minBudget,
      maxBudget,
      search,
      locationLat,
      locationLng,
      radius,
      sortBy,
      sortDirection,
    });

    console.log('✅ [GET /api/services/postings/list] Database query successful:', {
      postingsCount: postings.length,
      total,
    });

    // Prepare response data
    console.log('🔄 [GET /api/services/postings/list] Preparing response data...');
    const postingsData = postings.map(posting => {
      try {
        console.log('🔄 [GET /api/services/postings/list] Mapping posting:', posting.id, {
          category: posting.category,
          budget: posting.budget,
          status: posting.status,
          address: posting.address,
        });
        
        return {
          id: posting.id,
          clientId: posting.clientId,
          title: posting.title,
          description: posting.description,
          category: posting.category?.name || posting.categoryId || 'Unknown',
          budget: Number(posting.budget || 0),
          deadline: posting.requiredTo?.toISOString() || null,
          status: posting.status === 'OPEN' ? 'OPEN' : 
                  posting.status === 'CLOSED' ? 'COMPLETED' : 
                  posting.status === 'EXPIRED' ? 'CANCELLED' : 'OPEN',
          location: posting.address || null,
          locationLat: posting.locationLat || null,
          locationLng: posting.locationLng || null,
          createdAt: posting.createdAt.toISOString(),
          updatedAt: posting.updatedAt.toISOString(),
          deletedAt: posting.deletedAt?.toISOString() || null,
        };
      } catch (mapError) {
        console.error('❌ [GET /api/services/postings/list] Error mapping posting:', posting.id, mapError);
        throw mapError;
      }
    });

    console.log('✅ [GET /api/services/postings/list] Response data prepared successfully');

    const responseData = {
      postings: postingsData,
      total,
    };

    // Validate response
    console.log('🔍 [GET /api/services/postings/list] Validating response schema...');
    const responseValidation = ServicePostingsListResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      console.error('❌ [GET /api/services/postings/list] Response validation failed:', responseValidation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    console.log('✅ [GET /api/services/postings/list] Response validation successful');

    const response = NextResponse.json(
      paginationResponse(
        postingsData,
        total,
        page ?? 1,
        limit ?? 10,
        'Service postings retrieved successfully'
      )
    );

    const duration = Date.now() - startTime;
    console.log(`✅ [GET /api/services/postings/list] Request completed successfully in ${duration}ms`);

    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [GET /api/services/postings/list] Error after ${duration}ms:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve service postings'
      ),
      { status: 500 }
    );
  }
}
