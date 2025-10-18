import { useMutation } from '@tanstack/react-query';
import { LoginRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type LoginRequest = z.infer<typeof LoginRequestSchema>;
type AuthResponse = z.infer<typeof AuthResponseSchema>;

interface LoginVariables {
  email?: string;
  phone?: string;
  password: string;
}

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginVariables>({
    mutationFn: async (variables: LoginVariables) => {
      const response = await fetch('/api/auth/login', {
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
      console.log('🔐 [useLogin] Response data:', data);
      return data.data;
    },
    onSuccess: (data) => {
      // Store auth data in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
    },
  });
}
