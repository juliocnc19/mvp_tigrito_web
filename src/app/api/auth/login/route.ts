import { NextRequest, NextResponse } from 'next/server';
import { LoginRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { authLogger } from '@/lib/utils';
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
  const requestId = crypto.randomUUID().substring(0, 8);
  authLogger.info('LOGIN_START', { requestId });

  try {
    // Log incoming request details
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    authLogger.info('LOGIN_REQUEST_DETAILS', {
      requestId,
      clientIP,
      userAgent,
      method: request.method,
      url: request.url,
      timestamp: new Date().toISOString()
    });

    // Validate request body
    authLogger.info('LOGIN_VALIDATION_START', { requestId });
    const validation = await validateRequest(request, LoginRequestSchema);
    if (!validation.success) {
      authLogger.validationFailed('LOGIN_SCHEMA_VALIDATION', validation.error.issues);
      authLogger.warn('LOGIN_REQUEST_REJECTED', 'Schema validation failed', {
        requestId,
        errors: validation.error.issues.length,
        clientIP
      });
      return NextResponse.json(validation.error, { status: 400 });
    }
    authLogger.info('LOGIN_VALIDATION_SUCCESS', { requestId });

    const { email, phone, password } = validation.data;
    const identifier = email || phone;

    // Log sanitized request parameters (password hidden)
    authLogger.info('LOGIN_REQUEST_PARAMS', {
      requestId,
      email: email ? `${email.substring(0, 3)}***@${email.split('@')[1]}` : null,
      phone: phone ? `${phone.substring(0, 4)}****${phone.substring(phone.length - 2)}` : null,
      hasPassword: !!password && password.length > 0,
      passwordLength: password?.length || 0,
      identifier: identifier ? `${identifier.substring(0, 3)}***${identifier.substring(identifier.length - 2)}` : null
    });

    authLogger.loginAttempt(identifier!);

    // Additional validation
    authLogger.info('LOGIN_BUSINESS_VALIDATION_START', { requestId, identifier });
    const loginValidation = validateUserLogin({
      email,
      phone,
      password,
    });

    if (!loginValidation.valid) {
      authLogger.validationFailed('LOGIN_BUSINESS_VALIDATION', loginValidation.errors);
      authLogger.warn('LOGIN_REQUEST_REJECTED', 'Business validation failed', {
        requestId,
        errors: loginValidation.errors.length,
        identifier
      });
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid login data',
          loginValidation.errors
        ),
        { status: 422 }
      );
    }
    authLogger.info('LOGIN_BUSINESS_VALIDATION_SUCCESS', { requestId, identifier });

    // Find user by email or phone
    authLogger.info('LOGIN_USER_LOOKUP_START', {
      requestId,
      identifier,
      lookupType: email ? 'email' : 'phone'
    });

    const startTime = Date.now();
    const user = await getUserByEmailOrPhone(identifier!);
    const lookupTime = Date.now() - startTime;

    if (!user) {
      authLogger.loginFailed(identifier!, 'USER_NOT_FOUND');
      authLogger.securityEvent('LOGIN_USER_NOT_FOUND', {
        identifier,
        lookupTime,
        clientIP
      }, requestId);
      authLogger.warn('LOGIN_AUTH_FAILED', 'User not found', {
        requestId,
        identifier,
        lookupTime,
        clientIP
      });
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid credentials'
        ),
        { status: 401 }
      );
    }

    // Log complete user information (sanitized)
    authLogger.info('LOGIN_USER_FOUND', {
      requestId,
      userId: user.id,
      email: user.email ? `${user.email.split('@')[0]}@${user.email.split('@')[1]}` : null,
      phone: user.phone ? `${user.phone.substring(0, 4)}****${user.phone.substring(user.phone.length - 2)}` : null,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      isIDVerified: user.isIDVerified,
      balance: user.balance ? '***.XX' : '0.00',
      isSuspended: user.isSuspended,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      hasLocation: !!((user.locationLat ?? null) && (user.locationLng ?? null)),
      lookupTime,
      profileCompleteness: {
        hasName: !!user.name,
        hasEmail: !!user.email,
        hasPhone: !!user.phone,
        isVerified: user.isVerified,
        isIDVerified: user.isIDVerified
      }
    });

    authLogger.dbOperation('USER_LOOKUP', true, user.id, {
      found: true,
      role: user.role,
      lookupTime,
      profileComplete: !!(user.name && (user.email || user.phone))
    });

    // Check if user is suspended
    if (user.isSuspended) {
      authLogger.loginFailed(identifier!, 'ACCOUNT_SUSPENDED');
      authLogger.securityEvent('LOGIN_SUSPENDED_ACCOUNT', {
        userId: user.id,
        suspensionReason: 'Account flagged as suspended',
        clientIP
      }, user.id);
      authLogger.warn('LOGIN_AUTH_FAILED', 'Account suspended', {
        requestId,
        userId: user.id,
        identifier,
        clientIP
      });
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.FORBIDDEN,
          'Account is suspended'
        ),
        { status: 403 }
      );
    }

    // Verify password
    authLogger.info('LOGIN_PASSWORD_VERIFICATION_START', {
      requestId,
      userId: user.id,
      passwordHashPresent: !!user.password,
      passwordLength: user.password?.length || 0
    }, user.id);

    const passwordStartTime = Date.now();
    const isPasswordValid = await verifyPassword(password, user.password!);
    const passwordVerificationTime = Date.now() - passwordStartTime;

    if (!isPasswordValid) {
      authLogger.loginFailed(identifier!, 'INVALID_PASSWORD');
      authLogger.securityEvent('LOGIN_INVALID_PASSWORD', {
        userId: user.id,
        verificationTime: passwordVerificationTime,
        clientIP,
        userAgent
      }, user.id);
      authLogger.warn('LOGIN_AUTH_FAILED', 'Invalid password', {
        requestId,
        userId: user.id,
        identifier,
        verificationTime: passwordVerificationTime,
        clientIP,
        userAgent
      });
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid credentials'
        ),
        { status: 401 }
      );
    }

    authLogger.info('LOGIN_PASSWORD_VERIFICATION_SUCCESS', {
      requestId,
      userId: user.id,
      verificationTime: passwordVerificationTime
    }, user.id);

    // Log successful authentication flow
    authLogger.info('LOGIN_AUTH_SUCCESS', {
      requestId,
      userId: user.id,
      identifier,
      role: user.role,
      totalTime: Date.now() - startTime,
      clientIP,
      userAgent,
      authSteps: {
        validation: 'PASSED',
        userLookup: 'PASSED',
        suspensionCheck: 'PASSED',
        passwordVerification: 'PASSED'
      }
    }, user.id);

    // Generate tokens
    const tokenGenerationStart = Date.now();
    authLogger.info('LOGIN_TOKEN_GENERATION_START', {
      requestId,
      userId: user.id,
      role: user.role,
      hasEmail: !!user.email,
      hasPhone: !!user.phone
    }, user.id);

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

    const tokenGenerationTime = Date.now() - tokenGenerationStart;

    // Log token details (without showing actual tokens)
    authLogger.info('LOGIN_TOKENS_GENERATED', {
      requestId,
      userId: user.id,
      accessTokenLength: accessToken.length,
      refreshTokenLength: refreshToken.length,
      tokenGenerationTime,
      accessTokenPrefix: accessToken.substring(0, 20) + '...',
      refreshTokenPrefix: refreshToken.substring(0, 20) + '...',
      role: user.role
    }, user.id);

    authLogger.tokenGenerated(user.id, 'access');
    authLogger.tokenGenerated(user.id, 'refresh');
    authLogger.info('LOGIN_TOKEN_GENERATION_SUCCESS', {
      requestId,
      userId: user.id,
      generationTime: tokenGenerationTime
    }, user.id);

    // Prepare response data
    const responsePrepStart = Date.now();
    authLogger.info('LOGIN_RESPONSE_PREPARATION_START', { requestId }, user.id);

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
    authLogger.info('LOGIN_RESPONSE_VALIDATION_START', {
      requestId,
      userId: user.id,
      responseSize: JSON.stringify(responseData).length
    }, user.id);

    const responseValidation = AuthResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      authLogger.validationFailed('LOGIN_RESPONSE_VALIDATION', responseValidation.error.issues, user.id);
      authLogger.error('LOGIN_RESPONSE_VALIDATION_FAILED', new Error('Response schema validation failed'), {
        requestId,
        userId: user.id,
        validationErrors: responseValidation.error.issues
      }, user.id);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    const responsePrepTime = Date.now() - responsePrepStart;
    authLogger.info('LOGIN_RESPONSE_VALIDATION_SUCCESS', {
      requestId,
      userId: user.id,
      preparationTime: responsePrepTime
    }, user.id);

    // Final success log with complete flow information
    const totalProcessingTime = Date.now() - startTime;
    authLogger.info('LOGIN_COMPLETE_FLOW_SUMMARY', {
      requestId,
      userId: user.id,
      identifier,
      role: user.role,
      clientIP,
      userAgent,
      performance: {
        totalTime: totalProcessingTime,
        userLookupTime: lookupTime,
        passwordVerificationTime: passwordVerificationTime,
        tokenGenerationTime: tokenGenerationTime,
        responsePreparationTime: responsePrepTime
      },
      security: {
        userVerified: user.isVerified,
        userIDVerified: user.isIDVerified,
        accountActive: !user.isSuspended
      },
      profile: {
        hasName: !!user.name,
        hasEmail: !!user.email,
        hasPhone: !!user.phone,
        hasLocation: !!((user.locationLat ?? null) && (user.locationLng ?? null)),
        role: user.role,
        balance: user.balance
      },
      tokens: {
        accessTokenGenerated: true,
        refreshTokenGenerated: true,
        accessTokenLength: accessToken.length,
        refreshTokenLength: refreshToken.length
      }
    }, user.id);

    authLogger.loginSuccess(user.id, user.role);
    authLogger.success('LOGIN_COMPLETE', {
      requestId,
      role: user.role,
      totalTime: totalProcessingTime,
      clientIP
    }, user.id);

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, 'Login successful')
    );

  } catch (error) {
    authLogger.error('LOGIN_UNEXPECTED_ERROR', error, { requestId }, requestId);
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
