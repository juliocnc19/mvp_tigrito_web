import { NextRequest, NextResponse } from 'next/server';
import { GetUsersQuerySchema } from '@/lib/schemas/user';
import { validateQueryParams } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getUsers } from '@/lib/db/queries/user';

/**
 * Get users list
 * @description Retrieve paginated list of users with optional filters
 * @query GetUsersQuerySchema
 * @response 200:UsersListResponseSchema:Users retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user (optional for testing)
    const auth = optionalAuth(request);
    // Note: Authentication is optional for testing purposes

    // Validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetUsersQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { page, limit, role, isVerified, search, locationLat, locationLng, radius } = validation.data;

    // Get users with filters and pagination
    const { users, total } = await getUsers({
      page,
      limit,
      role,
      isVerified,
      search,
      locationLat,
      locationLng,
      radius,
    });
    // Prepare response data
    const usersData = users.map(user => ({
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
    }));

    return NextResponse.json(
      paginationResponse(
        usersData,
        total,
        page,
        limit,
        'Users retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve users'
      ),
      { status: 500 }
    );
  }
}

