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
 * @response 201:ProfessionalProfessionLinkResponseSchema:Profession link created successfully
 * @add 409:Profession link already exists
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

    const { userId, professionId, documents } = validation.data;

    // Test 3: Validate profession link creation and uniqueness
    const existingLinks = await getProfessionalProfessionLinks(userId);
    const existingLink = existingLinks.find(link => link.professionId === professionId);

    if (existingLink) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'Profession link already exists for this professional'
        ),
        { status: 409 }
      );
    }

    // Create profession link
    const professionLink = await createProfessionalProfessionLink({
      userId,
      professionId,
      documents,
    });

    // Prepare response data
    const responseData = {
      professionLink,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profession link created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create professional profession link error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create professional profession link'
      ),
      { status: 500 }
    );
  }
}
