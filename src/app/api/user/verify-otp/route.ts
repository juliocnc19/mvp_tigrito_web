import { NextRequest, NextResponse } from 'next/server';
import { OTPVerifyRequestSchema } from '@/lib/schemas/otp';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { verifyOTP, removeOTP } from '@/lib/services/otp';
import { optionalAuth } from '@/lib/auth/middleware';
import { prisma } from '@/lib/db/prisma';

/**
 * Verify OTP code
 * @description Verify OTP code sent to phone number
 * @body OTPVerifyRequestSchema
 * @response 200:OTPVerifyResponseSchema:OTP verified successfully
 * @add 400:Invalid OTP code
 * @add 410:OTP expired
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  console.log('📱 [API verify-otp] Starting OTP verification request');

  try {
    // Validate request body
    console.log('📱 [API verify-otp] Validating request body...');
    const validation = await validateRequest(request, OTPVerifyRequestSchema);
    if (!validation.success) {
      console.error('📱 [API verify-otp] Request validation failed:', validation.error);
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { userId, phoneNumber, otpCode } = validation.data;
    console.log('📱 [API verify-otp] Request data:', {
      phoneNumber: phoneNumber ? 'Present' : 'Empty',
      otpCode: otpCode ? 'Present' : 'Empty',
      userId: userId || 'No user'
    });

    // Verify OTP with Twilio
    console.log('📱 [API verify-otp] Calling Twilio verification...');
    console.log('📱 [API verify-otp] Phone number:', phoneNumber, 'OTP code:', otpCode ? 'Present' : 'Empty');

    let verificationResult;
    try {
      verificationResult = await verifyOTP(phoneNumber, otpCode);
      console.log('📱 [API verify-otp] Twilio verification result:', verificationResult);
    } catch (verificationError) {
      console.error('📱 [API verify-otp] Twilio verification threw error:', verificationError);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'OTP verification service error'
        ),
        { status: 500 }
      );
    }

    // If OTP is invalid, return error
    if (!verificationResult.verified) {
      console.log('📱 [API verify-otp] OTP verification failed:', verificationResult.message);
      // Determine status code based on error
      const statusCode = verificationResult.message.includes('expired') ? 410 : 400;
      console.log('📱 [API verify-otp] Returning error response with status:', statusCode);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          verificationResult.message,
          { remainingAttempts: verificationResult.remainingAttempts }
        ),
        { status: statusCode }
      );
    }

    // Update user with phone verification
    console.log('📱 [API verify-otp] OTP verified successfully, updating user...');
    try {
      await prisma.user.update({
        where: { id: userId || '' },
        data: {
          phone: phoneNumber,
          isVerified: true,
        },
      });
      console.log('📱 [API verify-otp] User updated successfully');
    } catch (dbError) {
      console.error('📱 [API verify-otp] Database update failed:', dbError);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Failed to update user verification status'
        ),
        { status: 500 }
      );
    }

    // Remove OTP after successful verification
    console.log('📱 [API verify-otp] Removing OTP from store...');
    removeOTP(phoneNumber);

    // Prepare response data
    console.log('📱 [API verify-otp] Preparing response data...');
    const responseData = {
      message: verificationResult.message,
      verified: true,
    };

    console.log('📱 [API verify-otp] Returning success response');
    return NextResponse.json(
      createSuccessResponse(responseData, 'Phone number verified successfully')
    );

  } catch (error) {
    console.error('📱 [API verify-otp] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'Unknown stack',
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to verify OTP'
      ),
      { status: 500 }
    );
  }
}
