import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfessionRequestSchema, ProfessionResponseSchema } from '@/lib/schemas/profession';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { requireAuth, requireRole } from '@/lib/auth/middleware';
import { updateProfession, getProfessionById, getProfessionBySlug } from '@/lib/db/queries/profession';

/**
 * Update profession
 * @description Update an existing profession
 * @param params.id {string} The profession ID
 * @body UpdateProfessionRequestSchema
 * @response 200:ProfessionResponseSchema:Profession updated successfully
 * @response 403:Forbidden
 * @response 404:Not found
 * @response 409:Conflict - Slug already exists
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(request);
    if (!auth.success) {
      return auth.response;
    }

    if (auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Insufficient permissions'),
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingProfession = await getProfessionById(id);
    if (!existingProfession) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Profession not found'
        ),
        { status: 404 }
      );
    }

    const validation = await validateRequest(request, UpdateProfessionRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { name, slug, description } = validation.data;

    if (slug) {
      const professionWithSlug = await getProfessionBySlug(slug);
      if (professionWithSlug && professionWithSlug.id !== id) {
        return NextResponse.json(
          createErrorResponse(
            COMMON_ERROR_CODES.CONFLICT,
            'A profession with this slug already exists'
          ),
          { status: 409 }
        );
      }
    }

    const profession = await updateProfession(id, { name, slug, description });

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
      createSuccessResponse(responseValidation.data, 'Profession updated successfully')
    );

  } catch (error) {
    console.error('Update profession error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update profession'
      ),
      { status: 500 }
    );
  }
}
