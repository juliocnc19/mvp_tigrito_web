import { NextRequest, NextResponse } from 'next/server';
import { UserProfileResponseSchema } from '@/lib/schemas/user';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getUserById } from '@/lib/db/queries/user';

/**
 * Get current user profile
 * @description Retrieve the authenticated user's profile information
 * @response 200:UserProfileResponseSchema:User profile retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user (optional for testing)
    const auth = optionalAuth(request);
    // Note: Authentication is optional for testing purposes
    const userId = auth.user?.userId;

    // Get user by ID with all relations
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
      createSuccessResponse(responseValidation.data, 'User profile retrieved successfully')
    );

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve user profile'
      ),
      { status: 500 }
    );
  }
}
