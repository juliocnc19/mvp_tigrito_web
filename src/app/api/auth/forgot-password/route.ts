import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordRequestSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { authLogger } from '@/lib/utils';
import { generatePasswordResetTokenWithExpiry, hashPasswordResetToken } from '@/lib/auth/password';
import { validateForgotPassword } from '@/lib/auth/validation';
import { getUserByEmail } from '@/lib/db/queries/user';
import { prisma } from '@/lib/db/prisma';

/**
 * Request password reset
 * @description Request a password reset link via email
 * @body ForgotPasswordRequestSchema
 * @response 200:MessageResponseSchema:Password reset request processed
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  authLogger.info('FORGOT_PASSWORD_START', { requestId });

  try {
    // Validate request body
    authLogger.info('FORGOT_PASSWORD_VALIDATION_START', { requestId });
    const validation = await validateRequest(request, ForgotPasswordRequestSchema);
    if (!validation.success) {
      authLogger.validationFailed('FORGOT_PASSWORD_SCHEMA_VALIDATION', validation.error.issues);
      return NextResponse.json(validation.error, { status: 400 });
    }
    authLogger.info('FORGOT_PASSWORD_VALIDATION_SUCCESS', { requestId });

    const { email } = validation.data;

    // Additional validation
    authLogger.info('FORGOT_PASSWORD_BUSINESS_VALIDATION_START', { requestId, email });
    const forgotPasswordValidation = validateForgotPassword({ email });
    if (!forgotPasswordValidation.valid) {
      authLogger.validationFailed('FORGOT_PASSWORD_BUSINESS_VALIDATION', forgotPasswordValidation.errors);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid email',
          forgotPasswordValidation.errors
        ),
        { status: 422 }
      );
    }
    authLogger.info('FORGOT_PASSWORD_BUSINESS_VALIDATION_SUCCESS', { requestId, email });

    // Find user by email
    authLogger.info('FORGOT_PASSWORD_USER_LOOKUP_START', { requestId, email });
    const user = await getUserByEmail(email);

    if (!user) {
      // For security, don't reveal if email exists or not
      authLogger.warn('FORGOT_PASSWORD_USER_NOT_FOUND', 'Email not found (security response)', { email });
      authLogger.securityEvent('FORGOT_PASSWORD_UNKNOWN_EMAIL', { email }, requestId);
      return NextResponse.json(
        createSuccessResponse(
          { message: 'If the email exists, a password reset link has been sent' },
          'Password reset request processed'
        )
      );
    }

    authLogger.dbOperation('USER_LOOKUP', true, user.id, { found: true, email });
    authLogger.info('FORGOT_PASSWORD_USER_FOUND', { requestId, userId: user.id });

    // Generate password reset token
    authLogger.info('FORGOT_PASSWORD_TOKEN_GENERATION_START', { requestId }, user.id);
    const { token, expiresAt } = generatePasswordResetTokenWithExpiry();
    const hashedToken = hashPasswordResetToken(token);
    authLogger.info('FORGOT_PASSWORD_TOKEN_GENERATION_SUCCESS', { requestId }, user.id);

    // Update user with reset token
    authLogger.info('FORGOT_PASSWORD_TOKEN_UPDATE_START', { requestId }, user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });
    authLogger.dbOperation('PASSWORD_RESET_TOKEN_UPDATE', true, user.id, { hasExpiry: true });
    authLogger.info('FORGOT_PASSWORD_TOKEN_UPDATE_SUCCESS', { requestId }, user.id);

    // In a real application, you would send an email here
    // For now, we'll just log the token (in development only)
    if (process.env.NODE_ENV === 'development') {
      authLogger.info('FORGOT_PASSWORD_RESET_LINK_GENERATED', {
        resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`,
        expiresAt: expiresAt.toISOString()
      }, user.id);
    }

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, token);
    authLogger.info('FORGOT_PASSWORD_EMAIL_SEND_PLACEHOLDER', { requestId }, user.id);

    // Prepare response data
    authLogger.info('FORGOT_PASSWORD_RESPONSE_PREPARATION_START', { requestId });
    const responseData = {
      message: 'If the email exists, a password reset link has been sent',
    };

    authLogger.success('FORGOT_PASSWORD_COMPLETE', { requestId, email }, user.id);

    return NextResponse.json(
      createSuccessResponse(responseData, 'Password reset request processed')
    );

  } catch (error) {
    authLogger.error('FORGOT_PASSWORD_UNEXPECTED_ERROR', error, { requestId }, requestId);
    console.error('Forgot password error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Password reset request failed'
      ),
      { status: 500 }
    );
  }
}
