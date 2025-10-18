import { NextRequest, NextResponse } from 'next/server';
import { RefreshTokenRequestSchema, RefreshTokenResponseSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { refreshToken } from '@/lib/auth/jwt';
import { validateRefreshToken } from '@/lib/auth/validation';

/**
 * Refresh access token
 * @description Get a new access token using a refresh token
 * @body RefreshTokenRequestSchema
 * @response 200:RefreshTokenResponseSchema:Token refreshed successfully
 * @add 401:Invalid or expired token
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, RefreshTokenRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { token } = validation.data;

    // Additional validation
    const tokenValidation = validateRefreshToken(token);
    if (!tokenValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid token format',
          tokenValidation.error
        ),
        { status: 422 }
      );
    }

    // Refresh token
    const refreshResult = refreshToken(token);
    if (!refreshResult.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          refreshResult.error
        ),
        { status: 401 }
      );
    }

    // Prepare response data
    const responseData = {
      token: refreshResult.accessToken,
    };

    // Validate response
    const responseValidation = RefreshTokenResponseSchema.safeParse(responseData);
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
      createSuccessResponse(responseValidation.data, 'Token refreshed successfully')
    );

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Token refresh failed'
      ),
      { status: 500 }
    );
  }
}
