import { NextRequest, NextResponse } from 'next/server';
import { CreateServicePostingRequestSchema, ServicePostingResponseSchema } from '@/lib/schemas/service';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createServicePosting, getServicePostingById } from '@/lib/db/queries/service';

/**
 * Create service posting
 * @description Create a new service posting
 * @body CreateServicePostingRequestSchema
 * @response ServicePostingResponseSchema
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, CreateServicePostingRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const {
      userId,
      title,
      description,
      category,
      budget,
      deadline,
      location,
      locationLat,
      locationLng,
    } = validation.data;

    // Create service posting
    const posting = await createServicePosting({
      clientId: userId,
      title,
      description,
      category,
      budget,
      deadline: deadline ? new Date(deadline) : undefined,
      location,
      locationLat,
      locationLng,
    });

    // Get the created posting with relations
    const createdPosting = await getServicePostingById(posting.id);

    // Prepare response data
    const responseData = {
      posting: {
        id: createdPosting.id,
        clientId: createdPosting.clientId,
        title: createdPosting.title,
        description: createdPosting.description,
        category: createdPosting.category,
        budget: createdPosting.budget,
        deadline: createdPosting.deadline?.toISOString() || null,
        status: createdPosting.status,
        location: createdPosting.location,
        locationLat: createdPosting.locationLat,
        locationLng: createdPosting.locationLng,
        createdAt: createdPosting.createdAt.toISOString(),
        updatedAt: createdPosting.updatedAt.toISOString(),
        deletedAt: createdPosting.deletedAt?.toISOString() || null,
      },
    };

    // Validate response
    const responseValidation = ServicePostingResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, 'Service posting created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create service posting error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create service posting'
      ),
      { status: 500 }
    );
  }
}
