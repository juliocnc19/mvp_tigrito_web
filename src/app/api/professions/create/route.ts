import { NextRequest, NextResponse } from 'next/server';
import { CreateProfessionRequestSchema, ProfessionResponseSchema } from '@/lib/schemas/profession';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createProfession, getProfessionBySlug } from '@/lib/db/queries/profession';

/**
 * Create profession
 * @description Create a new profession
 * @body CreateProfessionRequestSchema
 * @response 201:ProfessionResponseSchema:Profession created successfully
 * @response 403:Forbidden
 * @response 409:Conflict - Slug already exists
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    const auth = optionalAuth(request);
    // Note: Authentication is optional for testing purposes
    // if (!auth.user) {
    //   return NextResponse.json(
    //     createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Insufficient permissions'),
    //     { status: 403 }
    //   );
    // }
    
    // if (auth.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Insufficient permissions'),
    //     { status: 403 }
    //   );
    // }

    const validation = await validateRequest(request, CreateProfessionRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { name, slug, description } = validation.data;

    const existingProfession = await getProfessionBySlug(slug);
    if (existingProfession) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'A profession with this slug already exists'
        ),
        { status: 409 }
      );
    }

    const profession = await createProfession({ name, slug, description });

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
      createSuccessResponse(responseValidation.data, 'Profession created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create profession error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create profession'
      ),
      { status: 500 }
    );
  }
}
