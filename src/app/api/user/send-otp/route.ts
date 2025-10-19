import { NextRequest, NextResponse } from 'next/server';
import { OTPSendRequestSchema } from '@/lib/schemas/otp';
import { validateRequest } from '@/lib/utils/validation';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { generateOTP } from '@/lib/services/otp';

/**
 * Send OTP to phone number
 * @description Generate and send OTP code to user's phone number
 * @body OTPSendRequestSchema
 * @response 200:OTPSendResponseSchema:OTP sent successfully
 * @add 400:Invalid phone number
 * @add 429:Too many requests
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  console.log('📱 [API send-otp] Starting OTP send request');

  try {
    // Validate request body
    console.log('📱 [API send-otp] Validating request body...');
    const validation = await validateRequest(request, OTPSendRequestSchema);
    if (!validation.success) {
      console.error('📱 [API send-otp] Request validation failed:', validation.error);
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { phoneNumber } = validation.data;
    console.log('📱 [API send-otp] Phone number:', phoneNumber ? 'Present' : 'Empty');

    // Generate OTP via Twilio
    console.log('📱 [API send-otp] Calling Twilio OTP generation...');
    const otpResult = await generateOTP(phoneNumber);
    console.log('📱 [API send-otp] OTP generation result:', otpResult);

    if (!otpResult.success) {
      console.error('📱 [API send-otp] OTP generation failed:', otpResult.message);
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          otpResult.message
        ),
        { status: 500 }
      );
    }

    // Prepare response data
    console.log('📱 [API send-otp] Preparing response data...');
    const responseData = {
      message: otpResult.message,
      expiresIn: otpResult.expiresIn,
    };

    console.log('📱 [API send-otp] Returning success response');
    return NextResponse.json(
      createSuccessResponse(responseData, 'OTP sent successfully')
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    let errorMessage = 'Failed to send OTP';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        errorMessage
      ),
      { status: 500 }
    );
  }
}
