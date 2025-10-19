import { NextRequest, NextResponse } from 'next/server';
import { EmailVerificationRequestSchema } from '@/lib/schemas/auth';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { verifyEmailVerificationToken, isTokenExpired } from '@/lib/auth/password';
import { validateEmailVerification } from '@/lib/auth/validation';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(request, EmailVerificationRequestSchema);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { token } = validation.data;

    // Additional validation
    const verificationValidation = validateEmailVerification({ token });
    if (!verificationValidation.valid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid verification data',
          verificationValidation.errors
        ),
        { status: 422 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid or expired verification token'
        ),
        { status: 401 }
      );
    }

    // Check if token is expired
    if (user.emailVerificationExpires && isTokenExpired(user.emailVerificationExpires)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Verification token has expired'
        ),
        { status: 401 }
      );
    }

    // Verify the token
    const isTokenValid = verifyEmailVerificationToken(token, user.emailVerificationToken!);
    if (!isTokenValid) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.UNAUTHORIZED,
          'Invalid verification token'
        ),
        { status: 401 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    // Prepare response data
    const responseData = {
      message: 'Email verified successfully',
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Email verification successful')
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Email verification failed'
      ),
      { status: 500 }
    );
  }
}
