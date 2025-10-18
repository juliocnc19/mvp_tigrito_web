import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordRequestSchema, MessageResponseSchema } from '@/lib/schemas/auth';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
type MessageResponse = z.infer<typeof MessageResponseSchema>;

interface ForgotPasswordVariables {
  email: string;
}

export function useForgotPassword() {
  return useMutation<MessageResponse, Error, ForgotPasswordVariables>({
    mutationFn: async (variables: ForgotPasswordVariables) => {
      const response = await fetch('/api/auth/forgot-password', {
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
