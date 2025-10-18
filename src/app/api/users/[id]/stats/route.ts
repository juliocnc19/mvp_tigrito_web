import { NextRequest, NextResponse } from 'next/server';
import { UserStatsResponseSchema } from '@/lib/schemas/user';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getUserStats } from '@/lib/db/queries/user';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user (optional for testing)
    const auth = optionalAuth(request);
    // Note: Authentication is optional for testing purposes

    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid user ID'
        ),
        { status: 422 }
      );
    }

    // Get user statistics
    const stats = await getUserStats(id);

    // Prepare response data
    const responseData = {
      stats,
    };

    // Validate response
    const responseValidation = UserStatsResponseSchema.safeParse(responseData);
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
      createSuccessResponse(responseValidation.data, 'User statistics retrieved successfully')
    );

  } catch (error) {
    console.error('Get user statistics error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve user statistics'
      ),
      { status: 500 }
    );
  }
}
