import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { deleteProfessionalPortfolio, getProfessionalPortfolioById } from '@/lib/db/queries/professional';

/**
 * Delete professional portfolio item
 * @description Delete a portfolio item for the authenticated professional
 * @response 200:SuccessResponse:Portfolio item deleted successfully
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
          'Portfolio item ID is required'
        ),
        { status: 400 }
      );
    }

    // Check if portfolio item exists
    const existingItem = await getProfessionalPortfolioById(id);
    if (!existingItem) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Portfolio item not found'
        ),
        { status: 404 }
      );
    }

    // Delete portfolio item
    await deleteProfessionalPortfolio(id);

    return NextResponse.json(
      createSuccessResponse(null, 'Portfolio item deleted successfully')
    );

  } catch (error) {
    console.error('Delete portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete portfolio item'
      ),
      { status: 500 }
    );
  }
}