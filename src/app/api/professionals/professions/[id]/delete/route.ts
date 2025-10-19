import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { deleteProfessionalProfessionLink, getProfessionalProfessionLinkById } from '@/lib/db/queries/profession';

/**
 * Delete professional profession link
 * @description Delete a profession link for the authenticated professional
 * @response 200:SuccessResponse:Profession link deleted successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Delete profession link
    await deleteProfessionalProfessionLink(id);

    return NextResponse.json(
      createSuccessResponse(null, 'Profession link deleted successfully')
    );

  } catch (error) {
    console.error('Delete profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete profession link'
      ),
      { status: 500 }
    );
  }
}