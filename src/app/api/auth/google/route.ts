import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { getUserByEmail, createUser } from '@/lib/db/queries/user';
import { hashPassword } from '@/lib/auth/password';

/**
 * Google OAuth Authentication
 * @description Authenticate user with Google OAuth token
 * @body GoogleAuthRequestSchema
 * @response 200:AuthResponseSchema:Authentication successful
 * @response 201:AuthResponseSchema:User created and authenticated
 * @add 400:Invalid token
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, GoogleAuthRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { token } = validation.data as { token: string; idToken?: string };

    // TODO: Verify Google token with Google's API
    // For now, we'll extract basic info from the token
    // In production, use: google.auth.OAuth2Client to verify
    let googleUserData: any;

    try {
      // Decode the token (basic JWT decode - replace with proper verification)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Basic parsing (in production, use proper Google token verification)
      const decoded = JSON.parse(
        Buffer.from(parts[1], 'base64').toString()
      );

      googleUserData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
      };
    } catch (tokenError) {
      console.error('Token decode error:', tokenError);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid or expired Google token'
        ),
        { status: 401 }
      );
    }

    // Validate required fields
    if (!googleUserData.email || !googleUserData.sub) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid Google token data'
        ),
        { status: 400 }
      );
    }

    // Try to find existing user
    let user = await getUserByEmail(googleUserData.email);
    let isNewUser = false;

    // If user doesn't exist, create one
    if (!user) {
      isNewUser = true;
      // Generate a random password for Google auth users
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashedPassword = await hashPassword(randomPassword);

      user = await createUser({
        email: googleUserData.email,
        name: googleUserData.name || 'Google User',
        password: hashedPassword,
        role: 'CLIENT',
        isVerified: true, // Google-verified emails are considered verified
        isIDVerified: false,
      });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.FORBIDDEN,
          'Account is suspended'
        ),
        { status: 403 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
      email: user.email ?? undefined,
      phone: user.phone ?? undefined,
    });

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
      deletedAt: user.deletedAt?.toISOString() ?? null,
      locationLat: user.locationLat ?? null,
      locationLng: user.locationLng ?? null,
      locationAddress: user.locationAddress ?? null,
    };

    const responseData = {
      user: userData,
      token: accessToken,
      refreshToken,
    };

    // Validate response
    const responseValidation = AuthResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    const message = isNewUser 
      ? 'User created and authenticated with Google'
      : 'Authentication successful with Google';
    const statusCode = isNewUser ? 201 : 200;

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, message),
      { status: statusCode }
    );

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Google authentication failed'
      ),
      { status: 500 }
    );
  }
}
