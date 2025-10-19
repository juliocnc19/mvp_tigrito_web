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
 * @add 404:Profession link not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalProfessionLinkRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { documents, verified } = validation.data;

    // Check if profession link exists
    const existingLink = await getProfessionalProfessionLinkById(id);
    if (!existingLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional profession link not found'
        ),
        { status: 404 }
      );
    }

    // Update profession link
    const updatedLink = await updateProfessionalProfessionLink(id, {
      documents,
      verified,
    });

    // Prepare response data
    const responseData = {
      professionLink: updatedLink,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profession link updated successfully')
    );

  } catch (error) {
    console.error('Update professional profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update professional profession link'
      ),
      { status: 500 }
    );
  }
}
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
 * @add 404:Profession link not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalProfessionLinkRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { documents, verified } = validation.data;

    // Check if profession link exists
    const existingLink = await getProfessionalProfessionLinkById(id);
    if (!existingLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional profession link not found'
        ),
        { status: 404 }
      );
    }

    // Update profession link
    const updatedLink = await updateProfessionalProfessionLink(id, {
      documents,
      verified,
    });

    // Prepare response data
    const responseData = {
      professionLink: updatedLink,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profession link updated successfully')
    );

  } catch (error) {
    console.error('Update professional profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update professional profession link'
      ),
      { status: 500 }
    );
  }
}


