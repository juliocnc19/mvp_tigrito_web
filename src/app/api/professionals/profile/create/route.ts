import { NextRequest, NextResponse } from 'next/server';
import { CreateProfessionalProfileRequestSchema, ProfessionalProfileResponseSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createProfessionalProfile, getProfessionalByUserId } from '@/lib/db/queries/professional';

/**
 * Create professional profile
 * @description Create a professional profile for the authenticated user
 * @body CreateProfessionalProfileRequestSchema
 * @response ProfessionalProfileResponseSchema
 * @add 403:Only clients and professionals can create a professional profile
 * @add 409:Professional profile already exists
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, CreateProfessionalProfileRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { userId, role, bio, yearsOfExperience, certifications, specialties, hourlyRate, bankAccount, taxId } = validation.data;

    // Check if user is CLIENT or PROFESSIONAL
    if (role && role !== 'CLIENT' && role !== 'PROFESSIONAL') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.FORBIDDEN,
          'Only clients and professionals can create a professional profile'
        ),
        { status: 403 }
      );
    }

    // Check if professional profile already exists
    const existingProfile = await getProfessionalByUserId(userId);
    if (existingProfile) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'Professional profile already exists'
        ),
        { status: 409 }
      );
    }

    // Create professional profile
    const professional = await createProfessionalProfile({
      userId,
      bio,
      yearsOfExperience,
      certifications,
      specialties,
      hourlyRate,
      bankAccount,
      taxId,
    });

    // Get the created professional with all relations
    const createdProfessional = await getProfessionalByUserId(userId);

    // Prepare response data
    const responseData = {
      professional: createdProfessional,
    };

    // Validate response
    const responseValidation = ProfessionalProfileResponseSchema.safeParse(responseData);
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
      createSuccessResponse(responseValidation.data, 'Professional profile created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create professional profile error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create professional profile'
      ),
      { status: 500 }
    );
  }
}
