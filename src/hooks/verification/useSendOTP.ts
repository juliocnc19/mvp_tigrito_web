import { useMutation } from '@tanstack/react-query';
import { OTPSendRequestSchema, OTPSendResponseSchema } from '@/lib/schemas/otp';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type OTPSendRequest = z.infer<typeof OTPSendRequestSchema>;
type OTPSendResponse = z.infer<typeof OTPSendResponseSchema>;

interface SendOTPVariables {
  phoneNumber: string;
}

export function useSendOTP() {
  return useMutation<OTPSendResponse, Error, SendOTPVariables>({
    mutationFn: async (variables: SendOTPVariables) => {
      const response = await fetch('/api/user/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Process the structured API error to get a user-friendly message
        const processedError = processApiError(errorData);
        throw new Error(processedError);
      }

      const data = await response.json();
      return data.data;
    },
  });
}
