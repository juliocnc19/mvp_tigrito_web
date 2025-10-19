import { NextRequest, NextResponse } from 'next/server';
import { CreateProfessionalProfessionLinkRequestSchema } from '@/lib/schemas/profession';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createProfessionalProfessionLink, getProfessionalProfessionLinks } from '@/lib/db/queries/profession';

/**
 * Create professional profession link
 * @description Create a new profession link for the authenticated professional
 * @body CreateProfessionalProfessionLinkRequestSchema
 * @response 200:ProfessionalProfessionLinkResponseSchema:Profession link created successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, CreateProfessionalProfessionLinkRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { userId, professionId, documents } = validation.data as any;

    // Test 3: Validate profession link creation and uniqueness
    const existingLinks = await getProfessionalProfessionLinks(userId);
    const existingLink = existingLinks.find((link: any) => link.professionId === professionId);

    if (existingLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'Professional already has this profession link'
        ),
        { status: 409 }
      );
    }

    // Create profession link
    const professionLink = await createProfessionalProfessionLink({
      professionalId: userId,
      professionId,
      documents,
    });

    if (!professionLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Failed to create profession link'
        ),
        { status: 500 }
      );
    }

    // Prepare response data
    const responseData = {
      id: professionLink.id,
      professionalId: professionLink.userId,
      professionId: professionLink.professionId,
      documents: professionLink.documents || {},
      verified: professionLink.verified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Profession link created successfully')
    );

  } catch (error) {
    console.error('Create profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create profession link'
      ),
      { status: 500 }
    );
  }
}