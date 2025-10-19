import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfessionalProfessionLinkRequestSchema } from '@/lib/schemas/profession';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { updateProfessionalProfessionLink, getProfessionalProfessionLinkById } from '@/lib/db/queries/profession';

/**
 * Update professional profession link
 * @description Update a profession link for the authenticated professional
 * @body UpdateProfessionalProfessionLinkRequestSchema
 * @response 200:ProfessionalProfessionLinkResponseSchema:Profession link updated successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Profession link ID is required'
        ),
        { status: 400 }
      );
    }

    // Check if profession link exists
    const existingLink = await getProfessionalProfessionLinkById(id);
    if (!existingLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Profession link not found'
        ),
        { status: 404 }
      );
    }

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalProfessionLinkRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { documents, verified } = validation.data as any;

    // Update profession link
    const updatedLink = await updateProfessionalProfessionLink(id, {
      documents,
      verified,
    });

    if (!updatedLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Failed to update profession link'
        ),
        { status: 500 }
      );
    }

    // Prepare response data
    const responseData = {
      id: updatedLink.id,
      professionalId: updatedLink.userId,
      professionId: updatedLink.professionId,
      documents: updatedLink.documents || {},
      verified: updatedLink.verified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Profession link updated successfully')
    );

  } catch (error) {
    console.error('Update profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update profession link'
      ),
      { status: 500 }
    );
  }
}
