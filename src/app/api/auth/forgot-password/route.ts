import { NextRequest, NextResponse } from 'next/server';
import { ForgotPasswordRequestSchema, MessageResponseSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
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
  try {
    // Validate request body
    const validation = await validateRequest(request, ForgotPasswordRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { email } = validation.data;

    // Additional validation
    const forgotPasswordValidation = validateForgotPassword({ email });
    if (!forgotPasswordValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid email',
          forgotPasswordValidation.errors
        ),
        { status: 422 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      // For security, don't reveal if email exists or not
      // Return success even if user doesn't exist
      return NextResponse.json(
        createSuccessResponse(
          { message: 'If the email exists, a password reset link has been sent' },
          'Password reset request processed'
        )
      );
    }

    // Generate password reset token
    const { token, expiresAt } = generatePasswordResetTokenWithExpiry();
    const hashedToken = hashPasswordResetToken(token);

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
      },
    });

    // In a real application, you would send an email here
    // For now, we'll just log the token (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset token:', token);
      console.log('Password reset link:', `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`);
    }

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, token);

    // Prepare response data
    const responseData = {
      message: 'If the email exists, a password reset link has been sent',
    };

    // Validate response
    const responseValidation = MessageResponseSchema.safeParse(responseData);
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
      createSuccessResponse(responseValidation.data, 'Password reset request processed')
    );

  } catch (error) {
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
