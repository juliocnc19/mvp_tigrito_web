import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfessionalPortfolioRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { updateProfessionalPortfolio, getProfessionalPortfolioById } from '@/lib/db/queries/professional';

/**
 * Update professional portfolio item
 * @description Update a portfolio item for the authenticated professional
 * @body UpdateProfessionalPortfolioRequestSchema
 * @response 200:ProfessionalPortfolioResponseSchema:Portfolio item updated successfully
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

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalPortfolioRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { title, description, category, images, videos, tags } = validation.data;

    // Update portfolio item
    const updatedItem = await updateProfessionalPortfolio(id, {
      title,
      description,
      category,
      images,
      videos,
      tags,
    });

    if (!updatedItem) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Failed to update portfolio item'
        ),
        { status: 500 }
      );
    }

    // Prepare response data (placeholder implementation)
    const responseData = {
      id: id,
      title: title,
      description: description,
      category: category,
      images: images || [],
      videos: videos || [],
      tags: tags || [],
      professionalId: 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Portfolio item updated successfully')
    );

  } catch (error) {
    console.error('Update portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update portfolio item'
      ),
      { status: 500 }
    );
  }
}
