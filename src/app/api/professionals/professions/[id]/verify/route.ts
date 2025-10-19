import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { adminAuth } from '@/lib/auth/middleware';
import { verifyProfessionalProfessionLink, getProfessionalProfessionLinkById } from '@/lib/db/queries/profession';

/**
 * Verify professional profession link (Admin only)
 * @description Verify a profession link for a professional (admin action)
 * @response 200:ProfessionalProfessionLinkResponseSchema:Profession link verified successfully
 * @add 403:Admin access required
 * @add 404:Profession link not found
 * @responseSet admin
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check admin authentication
    const auth = adminAuth(request);
    if (!auth) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.FORBIDDEN,
          'Admin access required'
        ),
        { status: 403 }
      );
    }

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

    // Verify profession link
    const verifiedLink = await verifyProfessionalProfessionLink(id);

    // Prepare response data
    const responseData = {
      professionLink: verifiedLink,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profession link verified successfully')
    );

  } catch (error) {
    console.error('Verify professional profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to verify professional profession link'
      ),
      { status: 500 }
    );
  }
}
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { adminAuth } from '@/lib/auth/middleware';
import { verifyProfessionalProfessionLink, getProfessionalProfessionLinkById } from '@/lib/db/queries/profession';

/**
 * Verify professional profession link (Admin only)
 * @description Verify a profession link for a professional (admin action)
 * @response 200:ProfessionalProfessionLinkResponseSchema:Profession link verified successfully
 * @add 403:Admin access required
 * @add 404:Profession link not found
 * @responseSet admin
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check admin authentication
    const auth = adminAuth(request);
    if (!auth) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.FORBIDDEN,
          'Admin access required'
        ),
        { status: 403 }
      );
    }

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

    // Verify profession link
    const verifiedLink = await verifyProfessionalProfessionLink(id);

    // Prepare response data
    const responseData = {
      professionLink: verifiedLink,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profession link verified successfully')
    );

  } catch (error) {
    console.error('Verify professional profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to verify professional profession link'
      ),
      { status: 500 }
    );
  }
}


