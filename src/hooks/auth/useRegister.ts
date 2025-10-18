import { useMutation } from '@tanstack/react-query';
import { RegisterRequestSchema, AuthResponseSchema } from '@/lib/schemas/auth';
import { processApiError } from '@/lib/utils';
import type { z } from 'zod';

type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
type AuthResponse = z.infer<typeof AuthResponseSchema>;

interface RegisterVariables {
  name: string;
  email: string;
  password: string;
  role?: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
}

export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterVariables>({
    mutationFn: async (variables: RegisterVariables) => {
      const response = await fetch('/api/auth/register', {
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
      console.log('🔐 [useRegister] Storing token:', data.token ? 'Present' : 'Not found');
      console.log('🔐 [useRegister] Storing user:', data.user ? 'Present' : 'Not found');

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));

      console.log('🔐 [useRegister] localStorage after save:', {
        authToken: localStorage.getItem('authToken') ? 'Present' : 'Not found',
        authUser: localStorage.getItem('authUser') ? 'Present' : 'Not found'
      });
    },
  });
}
