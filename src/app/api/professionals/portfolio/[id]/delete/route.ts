import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { deleteProfessionalPortfolio, getProfessionalPortfolioById } from '@/lib/db/queries/professional';

/**
 * Delete professional portfolio item
 * @description Delete a portfolio item for a professional
 * @response 200:Success response:Portfolio item deleted successfully
 * @add 404:Portfolio item not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if portfolio item exists
    const existingItem = await getProfessionalPortfolioById(id);
    if (!existingItem) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional portfolio item not found'
        ),
        { status: 404 }
      );
    }

    // Delete portfolio item
    await deleteProfessionalPortfolio(id);

    return NextResponse.json(
      createSuccessResponse({}, 'Professional portfolio item deleted successfully')
    );

  } catch (error) {
    console.error('Delete professional portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete professional portfolio item'
      ),
      { status: 500 }
    );
  }
}
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { deleteProfessionalPortfolio, getProfessionalPortfolioById } from '@/lib/db/queries/professional';

/**
 * Delete professional portfolio item
 * @description Delete a portfolio item for a professional
 * @response 200:Success response:Portfolio item deleted successfully
 * @add 404:Portfolio item not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if portfolio item exists
    const existingItem = await getProfessionalPortfolioById(id);
    if (!existingItem) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional portfolio item not found'
        ),
        { status: 404 }
      );
    }

    // Delete portfolio item
    await deleteProfessionalPortfolio(id);

    return NextResponse.json(
      createSuccessResponse({}, 'Professional portfolio item deleted successfully')
    );

  } catch (error) {
    console.error('Delete professional portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete professional portfolio item'
      ),
      { status: 500 }
    );
  }
}


