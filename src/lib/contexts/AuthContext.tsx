'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useRegister, useGoogleLogin, useForgotPassword, useResetPassword } from '@/hooks/auth';
import type { User, AuthContextType } from '@/lib/types/auth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Internal component that uses React Query hooks
function AuthProviderInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // React Query hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved auth data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await loginMutation.mutateAsync({ email, password });
      setUser(result.user);
      setToken(result.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const result = await registerMutation.mutateAsync({ name, email, password });
      setUser(result.user);
      setToken(result.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      setError(null);
      const result = await googleLoginMutation.mutateAsync({ token: googleToken });
      setUser(result.user);
      setToken(result.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      await forgotPasswordMutation.mutateAsync({ email });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setError(null);
      await resetPasswordMutation.mutateAsync({ token, newPassword });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || googleLoginMutation.isPending,
    error,
    login,
    register,
    logout,
    googleLogin,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
