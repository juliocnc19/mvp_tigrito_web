import { NextRequest, NextResponse } from 'next/server';
import { ResetPasswordRequestSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { verifyPasswordResetToken, isTokenExpired, hashPassword } from '@/lib/auth/password';
import { validatePasswordReset } from '@/lib/auth/validation';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, ResetPasswordRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { token, newPassword } = validation.data;

    // Additional validation
    const resetValidation = validatePasswordReset({ token, newPassword });
    if (!resetValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid reset data',
          resetValidation.errors
        ),
        { status: 422 }
      );
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid or expired reset token'
        ),
        { status: 401 }
      );
    }

    // Check if token is expired
    if (user.passwordResetExpires && isTokenExpired(user.passwordResetExpires)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Reset token has expired'
        ),
        { status: 401 }
      );
    }

    // Verify the token
    const isTokenValid = verifyPasswordResetToken(token, user.passwordResetToken!);
    if (!isTokenValid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid reset token'
        ),
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Prepare response data
    const responseData = {
      message: 'Password reset successfully',
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Password reset successful')
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Password reset failed'
      ),
      { status: 500 }
    );
  }
}
