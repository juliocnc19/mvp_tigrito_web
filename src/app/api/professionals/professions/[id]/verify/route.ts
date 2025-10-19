import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { verifyProfessionalProfessionLink, getProfessionalProfessionLinkById } from '@/lib/db/queries/profession';

/**
 * Verify professional profession link
 * @description Verify a profession link for the authenticated professional
 * @response 200:ProfessionalProfessionLinkResponseSchema:Profession link verified successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verify profession link
    const verifiedLink = await verifyProfessionalProfessionLink(id);

    if (!verifiedLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Failed to verify profession link'
        ),
        { status: 500 }
      );
    }

    // Prepare response data
    const responseData = {
      id: verifiedLink.id,
      professionalId: verifiedLink.userId,
      professionId: verifiedLink.professionId,
      documents: verifiedLink.documents || {},
      verified: verifiedLink.verified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Profession link verified successfully')
    );

  } catch (error) {
    console.error('Verify profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to verify profession link'
      ),
      { status: 500 }
    );
  }
}
