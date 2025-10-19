import { NextRequest, NextResponse } from 'next/server';
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
    // Get userId from query parameters
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'userId query parameter is required'
        ),
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      createSuccessResponse(responseData, 'User profile retrieved successfully')
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
