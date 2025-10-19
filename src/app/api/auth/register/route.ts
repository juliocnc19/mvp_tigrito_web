import { NextRequest, NextResponse } from 'next/server';
import { RegisterRequestSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { authLogger } from '@/lib/utils';
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
  const requestId = crypto.randomUUID().substring(0, 8);
  authLogger.info('REGISTER_START', { requestId });

  try {
    // Validate request body
    authLogger.info('REGISTER_VALIDATION_START', { requestId });
    const validation = await validateRequest(request, RegisterRequestSchema);
    if (!validation.success) {
      authLogger.validationFailed('REGISTER_SCHEMA_VALIDATION', validation.error.issues);
      return NextResponse.json(validation.error, { status: 400 });
    }
    authLogger.info('REGISTER_VALIDATION_SUCCESS', { requestId });

    const { email, password, name, role } = validation.data;

    authLogger.registerAttempt(email);

    // Additional validation
    authLogger.info('REGISTER_BUSINESS_VALIDATION_START', { requestId, email });
    const registrationValidation = validateUserRegistration({
      email,
      password,
      name,
      role,
    });

    if (!registrationValidation.valid) {
      authLogger.validationFailed('REGISTER_BUSINESS_VALIDATION', registrationValidation.errors);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid registration data',
          registrationValidation.errors
        ),
        { status: 422 }
      );
    }
    authLogger.info('REGISTER_BUSINESS_VALIDATION_SUCCESS', { requestId, email });

    // Check if email already exists
    if (email) {
      authLogger.info('REGISTER_EMAIL_CHECK_START', { requestId, email });
      const emailTaken = await emailExists(email);
      if (emailTaken) {
        authLogger.registerFailed(email, 'EMAIL_ALREADY_EXISTS');
        authLogger.securityEvent('REGISTER_DUPLICATE_EMAIL', { email }, requestId);
        return NextResponse.json(
          createErrorResponse(
            COMMON_ERROR_CODES.CONFLICT,
            'Email already exists'
          ),
          { status: 409 }
        );
      }
      authLogger.info('REGISTER_EMAIL_CHECK_SUCCESS', { requestId, email, available: true });
    }

    // Hash password
    authLogger.info('REGISTER_PASSWORD_HASH_START', { requestId });
    const hashedPassword = await hashPassword(password);
    authLogger.info('REGISTER_PASSWORD_HASH_SUCCESS', { requestId });

    // Create user
    authLogger.info('REGISTER_USER_CREATION_START', { requestId, email, role });
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      role,
      isVerified: false,
      isIDVerified: false,
    });

    authLogger.dbOperation('USER_CREATION', true, user.id, { email, role });
    authLogger.info('REGISTER_USER_CREATION_SUCCESS', { requestId, userId: user.id, role });

    // Generate tokens
    authLogger.info('REGISTER_TOKEN_GENERATION_START', { requestId }, user.id);
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email || undefined,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      role: user.role,
      email: user.email || undefined,
    });

    authLogger.tokenGenerated(user.id, 'access');
    authLogger.tokenGenerated(user.id, 'refresh');
    authLogger.info('REGISTER_TOKEN_GENERATION_SUCCESS', { requestId }, user.id);

    // Prepare response data
    authLogger.info('REGISTER_RESPONSE_PREPARATION_START', { requestId }, user.id);
    const userData = {
      id: user.id,
      email: user.email ?? null,
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

    authLogger.registerSuccess(user.id, user.role);
    authLogger.success('REGISTER_COMPLETE', { requestId, role: user.role }, user.id);

    return NextResponse.json(
      createSuccessResponse(responseData, 'User registered successfully'),
      { status: 201 }
    );

  } catch (error) {
    authLogger.error('REGISTER_UNEXPECTED_ERROR', error, { requestId }, requestId);
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
