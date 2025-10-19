import { NextRequest, NextResponse } from 'next/server';
import { UpdateProfessionalProfileRequestSchema } from '@/lib/schemas/professional';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { updateProfessionalProfile, getProfessionalByUserId } from '@/lib/db/queries/professional';

/**
 * Update professional profile
 * @description Update the authenticated professional's profile
 * @body UpdateProfessionalProfileRequestSchema
 * @response 200:ProfessionalProfileResponseSchema:Professional profile updated successfully
 * @add 404:Professional profile not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, UpdateProfessionalProfileRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { userId, bio, yearsOfExperience, certifications, specialties, hourlyRate, bankAccount } = validation.data;

    // Get current professional profile
    const currentProfile = await getProfessionalByUserId(userId);
    if (!currentProfile) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional profile not found'
        ),
        { status: 404 }
      );
    }

    // Update professional profile
    await updateProfessionalProfile(currentProfile.id, {
      bio: bio !== undefined ? bio : currentProfile.bio,
      yearsOfExperience: yearsOfExperience !== undefined ? yearsOfExperience : currentProfile.yearsOfExperience,
      certifications: certifications !== undefined ? certifications : currentProfile.certifications,
      hourlyRate: hourlyRate !== undefined ? hourlyRate : currentProfile.hourlyRate,
      bankAccount: bankAccount !== undefined ? bankAccount : currentProfile.bankAccount,
    });

    // Get updated professional with all relations
    const updatedProfessional = await getProfessionalByUserId(userId);

    // Prepare response data
    const responseData = {
      professional: updatedProfessional,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional profile updated successfully')
    );

  } catch (error) {
    console.error('Update professional profile error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update professional profile'
      ),
      { status: 500 }
    );
  }
}
