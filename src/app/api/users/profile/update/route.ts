import { NextRequest, NextResponse } from 'next/server';
import { UpdateUserProfileRequestSchema, UserProfileResponseSchema } from '@/lib/schemas/user';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { requireAuth } from '@/lib/auth/middleware';
import { updateUserProfile, getUserById } from '@/lib/db/queries/user';

export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const auth = requireAuth(request);
    if (!auth.success) {
      return auth.response;
    }

    const { userId } = auth.user;

    // Validate request body
    const validation = await validateRequest(request, UpdateUserProfileRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { name, phone, locationLat, locationLng, locationAddress } = validation.data;

    // Update user profile
    const updatedUser = await updateUserProfile(userId, {
      name,
      phone,
      locationLat,
      locationLng,
      locationAddress,
    });

    // Get updated user with all relations
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'User not found'
        ),
        { status: 404 }
      );
    }

    // Prepare response data
    const userData = {
      id: user.id,
      email: user.email ?? null,
      phone: user.phone ?? null,
      name: user.name ?? null,
      role: user.role,
      isVerified: user.isVerified,
      isIDVerified: user.isIDVerified,
      balance: user.balance.toNumber(),
      isSuspended: user.isSuspended,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString() || null,
      locationLat: user.locationLat ?? null,
      locationLng: user.locationLng ?? null,
      locationAddress: user.locationAddress ?? null,
    };

    const responseData = {
      user: userData,
    };

    // Validate response
    const responseValidation = UserProfileResponseSchema.safeParse(responseData);
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
      createSuccessResponse(responseValidation.data, 'User profile updated successfully')
    );

  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update user profile'
      ),
      { status: 500 }
    );
  }
}
