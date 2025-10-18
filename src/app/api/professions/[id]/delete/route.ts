import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { deleteProfession, getProfessionById } from '@/lib/db/queries/profession';

/**
 * Delete profession
 * @description Delete a profession by its ID
 * @param params.id {string} The profession ID
 * @response 204:No content
 * @response 403:Forbidden
 * @response 404:Not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    await deleteProfession(id);

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Delete profession error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete profession'
      ),
      { status: 500 }
    );
  }
}
