import { NextRequest, NextResponse } from 'next/server';
import { LoginRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { validateUserLogin } from '@/lib/auth/validation';
import { getUserByEmailOrPhone } from '@/lib/db/queries/user';

/**
 * User login
 * @description Authenticate user with email/phone and password
 * @body LoginRequestSchema
 * @response 200:AuthResponseSchema:Login successful
 * @add 401:Unauthorized
 * @add 403:Account suspended
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, LoginRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { email, phone, password } = validation.data;

    // Additional validation
    const loginValidation = validateUserLogin({
      email,
      phone,
      password,
    });

    if (!loginValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid login data',
          loginValidation.errors
        ),
        { status: 422 }
      );
    }

    // Find user by email or phone
    const identifier = email || phone;
    const user = await getUserByEmailOrPhone(identifier!);

    if (!user) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid credentials'
        ),
        { status: 401 }
      );
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

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password!);
    if (!isPasswordValid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid credentials'
        ),
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email || undefined,
      phone: user.phone || undefined,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
      email: user.email || undefined,
      phone: user.phone || undefined,
    });

    // Prepare response data
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      isIDVerified: user.isIDVerified,
      balance: user.balance,
      isSuspended: user.isSuspended,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      locationLat: user.locationLat,
      locationLng: user.locationLng,
      locationAddress: user.locationAddress,
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

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, 'Login successful')
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Login failed'
      ),
      { status: 500 }
    );
  }
}
