import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfessionalPortfolioRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { updateProfessionalPortfolio, getProfessionalPortfolioById } from '@/lib/db/queries/professional';

/**
 * Update professional portfolio item
 * @description Update a portfolio item for a professional
 * @body UpdateProfessionalPortfolioRequestSchema
 * @response 200:ProfessionalPortfolioResponseSchema:Portfolio item updated successfully
 * @add 404:Portfolio item not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalPortfolioRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { title, description, images, category, completionDate, clientRating, clientReview } = validation.data;

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

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (completionDate !== undefined) updateData.completionDate = new Date(completionDate);
    if (clientRating !== undefined) updateData.clientRating = clientRating;
    if (clientReview !== undefined) updateData.clientReview = clientReview;

    // Update portfolio item
    const updatedItem = await updateProfessionalPortfolio(id, updateData);

    // Prepare response data
    const responseData = {
      portfolio: {
        ...updatedItem,
        createdAt: updatedItem.createdAt.toISOString(),
        updatedAt: updatedItem.updatedAt.toISOString(),
        completionDate: updatedItem.completionDate.toISOString(),
      },
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional portfolio item updated successfully')
    );

  } catch (error) {
    console.error('Update professional portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update professional portfolio item'
      ),
      { status: 500 }
    );
  }
}
import { UpdateProfessionalPortfolioRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { updateProfessionalPortfolio, getProfessionalPortfolioById } from '@/lib/db/queries/professional';

/**
 * Update professional portfolio item
 * @description Update a portfolio item for a professional
 * @body UpdateProfessionalPortfolioRequestSchema
 * @response 200:ProfessionalPortfolioResponseSchema:Portfolio item updated successfully
 * @add 404:Portfolio item not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalPortfolioRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { title, description, images, category, completionDate, clientRating, clientReview } = validation.data;

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

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (completionDate !== undefined) updateData.completionDate = new Date(completionDate);
    if (clientRating !== undefined) updateData.clientRating = clientRating;
    if (clientReview !== undefined) updateData.clientReview = clientReview;

    // Update portfolio item
    const updatedItem = await updateProfessionalPortfolio(id, updateData);

    // Prepare response data
    const responseData = {
      portfolio: {
        ...updatedItem,
        createdAt: updatedItem.createdAt.toISOString(),
        updatedAt: updatedItem.updatedAt.toISOString(),
        completionDate: updatedItem.completionDate.toISOString(),
      },
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional portfolio item updated successfully')
    );

  } catch (error) {
    console.error('Update professional portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update professional portfolio item'
      ),
      { status: 500 }
    );
  }
}


