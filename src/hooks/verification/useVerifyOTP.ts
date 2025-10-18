import { useMutation } from '@tanstack/react-query';
import { OTPVerifyRequestSchema, OTPVerifyResponseSchema } from '@/lib/schemas/otp';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type OTPVerifyRequest = z.infer<typeof OTPVerifyRequestSchema>;
type OTPVerifyResponse = z.infer<typeof OTPVerifyResponseSchema>;

interface VerifyOTPVariables {
  phoneNumber: string;
  otpCode: string;
}

export function useVerifyOTP() {
  return useMutation<OTPVerifyResponse, Error, VerifyOTPVariables>({
    mutationFn: async (variables: VerifyOTPVariables) => {
      console.log('🔐 [useVerifyOTP] Starting verification mutation');

      try {
        // Get auth token from localStorage
        const token = localStorage.getItem('authToken');
        console.log('🔐 [useVerifyOTP] Token from localStorage:', token ? 'Present' : 'Not found');
        console.log('🔐 [useVerifyOTP] localStorage keys:', Object.keys(localStorage));

        if (!token) {
          console.error('🔐 [useVerifyOTP] No authentication token found');
          throw new Error('No authentication token found. Please log in again.');
        }

        // Validate token format
        if (typeof token !== 'string' || token.trim().length === 0) {
          console.error('🔐 [useVerifyOTP] Invalid token format:', typeof token);
          throw new Error('Invalid authentication token format. Please log in again.');
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        console.log('🔐 [useVerifyOTP] Request headers configured');
        console.log('🔐 [useVerifyOTP] Request body:', {
          phoneNumber: variables.phoneNumber,
          otpCode: variables.otpCode ? 'Present' : 'Empty'
        });

        console.log('🔐 [useVerifyOTP] Making API request...');
        const response = await fetch('/api/user/verify-otp', {
          method: 'POST',
          headers,
          body: JSON.stringify(variables),
        });

        console.log('🔐 [useVerifyOTP] Response status:', response.status);
        console.log('🔐 [useVerifyOTP] Response ok:', response.ok);

        if (!response.ok) {
          console.log('🔐 [useVerifyOTP] Response not ok, processing error...');

          let errorData;
          try {
            errorData = await response.json();
            console.log('🔐 [useVerifyOTP] Error response data:', errorData);
          } catch (parseError) {
            console.error('🔐 [useVerifyOTP] Failed to parse error response:', parseError);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // Process the structured API error to get a user-friendly message
          const processedError = processApiError(errorData);
          console.log('🔐 [useVerifyOTP] Processed error:', processedError);

          throw new Error(processedError);
        }

        console.log('🔐 [useVerifyOTP] Response ok, parsing data...');
        const data = await response.json();
        console.log('🔐 [useVerifyOTP] Response data:', data);

        if (!data || !data.data) {
          console.error('🔐 [useVerifyOTP] Invalid response structure:', data);
          throw new Error('Invalid response from server');
        }

        console.log('🔐 [useVerifyOTP] Verification successful');
        return data.data;

      } catch (error: any) {
        console.error('🔐 [useVerifyOTP] Mutation error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });

        // Re-throw with a clean message
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('An unexpected error occurred during verification');
        }
      }
    },
  });
}
