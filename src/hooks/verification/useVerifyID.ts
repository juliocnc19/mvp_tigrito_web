import { useMutation } from '@tanstack/react-query';
import { IDVerificationRequestSchema, IDVerificationResponseSchema } from '@/lib/schemas/verification';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type IDVerificationRequest = z.infer<typeof IDVerificationRequestSchema>;
type IDVerificationResponse = z.infer<typeof IDVerificationResponseSchema>;

interface VerifyIDVariables {
  cedula: string;
  cedulaImage: string;
  faceScanData: string;
}

export function useVerifyID() {
  return useMutation<IDVerificationResponse, Error, VerifyIDVariables>({
    mutationFn: async (variables: VerifyIDVariables) => {
      const response = await fetch('/api/user/verify-id', {
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
