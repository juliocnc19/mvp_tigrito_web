import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { hashPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { validateUserRegistration } from '@/lib/auth/validation';
import { createUser, emailExists, phoneExists } from '@/lib/db/queries/user';

/**
 * User registration
 * @description Register a new user account
 * @body RegisterRequestSchema
 * @response 201:AuthResponseSchema:User registered successfully
 * @add 409:User already exists
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, RegisterRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { email, phone, password, name, role } = validation.data;

    // Additional validation
    const registrationValidation = validateUserRegistration({
      email,
      phone,
      password,
      name,
      role,
    });

    if (!registrationValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid registration data',
          registrationValidation.errors
        ),
        { status: 422 }
      );
    }

    // Check if email already exists
    if (email && await emailExists(email)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'Email already exists'
        ),
        { status: 409 }
      );
    }

    // Check if phone already exists
    if (phone && await phoneExists(phone)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'Phone number already exists'
        ),
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser({
      email,
      phone,
      password: hashedPassword,
      name,
      role,
      isVerified: false,
      isIDVerified: false,
    });

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
      createSuccessResponse(responseValidation.data, 'User registered successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Registration failed'
      ),
      { status: 500 }
    );
  }
}
