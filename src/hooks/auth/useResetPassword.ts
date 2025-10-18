import { useMutation } from '@tanstack/react-query';
import { ResetPasswordRequestSchema, MessageResponseSchema } from '@/lib/schemas/auth';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
type MessageResponse = z.infer<typeof MessageResponseSchema>;

interface ResetPasswordVariables {
  token: string;
  newPassword: string;
}

export function useResetPassword() {
  return useMutation<MessageResponse, Error, ResetPasswordVariables>({
    mutationFn: async (variables: ResetPasswordVariables) => {
      const response = await fetch('/api/auth/reset-password', {
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
