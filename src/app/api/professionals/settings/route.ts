import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfessionalSettingsRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalSettings, updateProfessionalSettings } from '@/lib/db/queries/professional';

/**
 * Get professional settings
 * @description Retrieve settings for the authenticated professional
 * @response 200:ProfessionalSettingsResponseSchema:Settings retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Get professionalId from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Get professional settings
    const settings = await getProfessionalSettings(professionalId);

    // Prepare response data
    const responseData = {
      settings,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional settings retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional settings error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional settings'
      ),
      { status: 500 }
    );
  }
}

/**
 * Update professional settings
 * @description Update settings for the authenticated professional
 * @body UpdateProfessionalSettingsRequestSchema
 * @response 200:ProfessionalSettingsResponseSchema:Settings updated successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest) {
  try {
    // Get professionalId from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalSettingsRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { notifications, privacy, work } = validation.data;

    // Get current settings
    const currentSettings = await getProfessionalSettings(professionalId);

    // Update professional settings with basic fields
    const savedSettings = await updateProfessionalSettings(professionalId, {
      bio: validation.data.bio,
      yearsOfExperience: validation.data.yearsOfExperience,
      certifications: validation.data.certifications,
      specialties: validation.data.specialties,
      hourlyRate: validation.data.hourlyRate,
      bankAccount: validation.data.bankAccount,
      taxId: validation.data.taxId,
    });

    // Prepare response data
    const responseData = {
      settings: savedSettings,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional settings updated successfully')
    );

  } catch (error) {
    console.error('Update professional settings error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update professional settings'
      ),
      { status: 500 }
    );
  }
}
