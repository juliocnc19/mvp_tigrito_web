import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { authenticateRequest } from '@/lib/auth/middleware';

/**
 * User logout
 * @description Logout the authenticated user
 * @response 200:MessageResponseSchema:Logout successful
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = authenticateRequest(request);
    if (!auth.success) {
      return auth.response;
    }

    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Remove the token from the client
    // 3. Log the logout event
    // 4. Clear any server-side sessions

    // For now, we'll just return a success response
    // The client should remove the token from storage

    return NextResponse.json(
      createSuccessResponse(
        { message: 'Logged out successfully' },
        'Logout successful'
      )
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Logout failed'
      ),
      { status: 500 }
    );
  }
}
