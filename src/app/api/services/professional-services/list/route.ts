import { NextRequest, NextResponse } from 'next/server';
import { GetProfessionalServicesQuerySchema } from '@/lib/schemas/professional-service';
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
  const startTime = Date.now();
  console.log('🚀 [GET /api/services/professional-services/list] Starting request');
  
  try {
    // Optional authentication
    console.log('🔐 [GET /api/services/professional-services/list] Checking authentication...');
    const auth = optionalAuth(request);
    console.log('🔐 [GET /api/services/professional-services/list] Auth result:', auth ? 'authenticated' : 'anonymous');

    // Validate query parameters
    console.log('📝 [GET /api/services/professional-services/list] Validating query parameters...');
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    console.log('📝 [GET /api/services/professional-services/list] Query params:', queryParams);
    
    const validation = GetProfessionalServicesQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      console.error('❌ [GET /api/services/professional-services/list] Validation failed:', validation.error.issues);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    console.log('✅ [GET /api/services/professional-services/list] Validation successful');

    const { page, limit, professionalId, categoryId, search, isActive, minPrice, maxPrice } = validation.data;

    console.log('🔍 [GET /api/services/professional-services/list] Query filters:', {
      page,
      limit,
      professionalId,
      categoryId,
      search,
      isActive,
      minPrice,
      maxPrice,
    });

    // Get professional services with filters and pagination
    console.log('🗄️ [GET /api/services/professional-services/list] Calling getProfessionalServices...');
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

    console.log('✅ [GET /api/services/professional-services/list] Database query successful:', {
      servicesCount: services.length,
      total,
    });
    // Prepare response data
    console.log('🔄 [GET /api/services/professional-services/list] Preparing response data...');
    const servicesData = services.map(service => {
      try {
        console.log('🔄 [GET /api/services/professional-services/list] Mapping service:', service.id, {
          price: service.price,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        });
        
        return {
          id: service.id,
          professionalId: service.professionalId,
          title: service.title,
          slug: service.slug,
          description: service.description,
          price: Number(service.price || 0),
          categoryId: service.categoryId,
          serviceLocations: service.serviceLocations,
          isActive: service.isActive,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
          professionalProfileId: service.professionalProfileId,
          professional: service.professional,
          category: service.category,
          ProfessionalProfile: service.ProfessionalProfile,
          media: service.media,
        };
      } catch (mapError) {
        console.error('❌ [GET /api/services/professional-services/list] Error mapping service:', service.id, mapError);
        throw mapError;
      }
    });

    console.log('✅ [GET /api/services/professional-services/list] Response data prepared successfully');

    const response = NextResponse.json(
      paginationResponse(
        servicesData,
        total,
        page ?? 1,
        limit ?? 10,
        'Professional services retrieved successfully'
      )
    );

    const duration = Date.now() - startTime;
    console.log(`✅ [GET /api/services/professional-services/list] Request completed successfully in ${duration}ms`);

    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [GET /api/services/professional-services/list] Error after ${duration}ms:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional services'
      ),
      { status: 500 }
    );
  }
}

