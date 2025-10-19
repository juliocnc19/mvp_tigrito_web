import { NextRequest, NextResponse } from 'next/server';
import { CreateProfessionalPortfolioRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createProfessionalPortfolio } from '@/lib/db/queries/professional';

/**
 * Add professional portfolio item
 * @description Add a new portfolio item for the authenticated professional
 * @body CreateProfessionalPortfolioRequestSchema
 * @response 200:ProfessionalPortfolioResponseSchema:Portfolio item added successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, CreateProfessionalPortfolioRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { professionalId, title, description, category, images, videos, tags } = validation.data;

    // Create portfolio item
    const portfolio = await createProfessionalPortfolio({
      professionalId,
      title,
      description,
      category,
      images,
      videos,
      tags,
    });

    if (!portfolio) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Failed to create portfolio item'
        ),
        { status: 500 }
      );
    }

    // Prepare response data (placeholder implementation)
    const responseData = {
      id: `portfolio_${Date.now()}`,
      title: title,
      description: description,
      category: category,
      images: images || [],
      videos: videos || [],
      tags: tags || [],
      professionalId: professionalId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Portfolio item added successfully')
    );

  } catch (error) {
    console.error('Add portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to add portfolio item'
      ),
      { status: 500 }
    );
  }
}
