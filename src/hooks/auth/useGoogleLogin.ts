import { useMutation } from '@tanstack/react-query';
import { GoogleAuthRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type GoogleAuthRequest = z.infer<typeof GoogleAuthRequestSchema>;
type AuthResponse = z.infer<typeof AuthResponseSchema>;

interface GoogleLoginVariables {
  token: string;
  idToken?: string;
}

export function useGoogleLogin() {
  return useMutation<AuthResponse, Error, GoogleLoginVariables>({
    mutationFn: async (variables: GoogleLoginVariables) => {
      const response = await fetch('/api/auth/google', {
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
    onSuccess: (data) => {
      // Store auth data in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
    },
  });
}
