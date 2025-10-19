import { NextRequest, NextResponse } from 'next/server';
import { CreateProfessionalPortfolioRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createProfessionalPortfolio } from '@/lib/db/queries/professional';

/**
 * Add professional portfolio item
 * @description Add a new portfolio item for a professional
 * @body CreateProfessionalPortfolioRequestSchema
 * @response 201:ProfessionalPortfolioResponseSchema:Portfolio item added successfully
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

    const { professionalId, title, description, images, category, completionDate, clientRating, clientReview } = validation.data;

    // Create portfolio item
    const portfolio = await createProfessionalPortfolio({
      professionalId,
      title,
      description,
      images,
      category,
      completionDate: new Date(completionDate),
      clientRating,
      clientReview,
    });

    // Prepare response data
    const responseData = {
      portfolio: {
        ...portfolio,
        createdAt: portfolio.createdAt.toISOString(),
        updatedAt: portfolio.updatedAt.toISOString(),
        completionDate: portfolio.completionDate.toISOString(),
      },
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional portfolio item added successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Add professional portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to add professional portfolio item'
      ),
      { status: 500 }
    );
  }
}