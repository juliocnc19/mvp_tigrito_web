import { useAuthStore } from '@/lib/stores/authStore';
import { useLogin, useRegister, useGoogleLogin, useForgotPassword, useResetPassword } from '@/hooks/auth';

// Combined hook that provides both Zustand state and React Query mutations
export function useAuth() {
  const store = useAuthStore();

  // React Query mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Enhanced actions that combine Zustand + React Query
  const login = async (email: string, password: string) => {
    try {
      store.setError(null);
      store.setLoading(true);

      const result = await loginMutation.mutateAsync({ email, password });

      store.setUser(result.user);
      store.setToken(result.token);
      store.setLoading(false);

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      store.setError(message);
      store.setLoading(false);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      store.setError(null);
      store.setLoading(true);

      const result = await registerMutation.mutateAsync({ name, email, password });

      store.setUser(result.user);
      store.setToken(result.token);
      store.setLoading(false);

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      store.setError(message);
      store.setLoading(false);
      throw err;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      store.setError(null);
      store.setLoading(true);

      const result = await googleLoginMutation.mutateAsync({ token });

      store.setUser(result.user);
      store.setToken(result.token);
      store.setLoading(false);

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      store.setError(message);
      store.setLoading(false);
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      store.setError(null);
      store.setLoading(true);

      await forgotPasswordMutation.mutateAsync({ email });
      store.setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      store.setError(message);
      store.setLoading(false);
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      store.setError(null);
      store.setLoading(true);

      await resetPasswordMutation.mutateAsync({ token, newPassword });
      store.setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      store.setError(message);
      store.setLoading(false);
      throw err;
    }
  };

  // Return combined interface
  return {
    // State from Zustand
    user: store.user,
    token: store.token,
    isLoading: store.isLoading || loginMutation.isPending || registerMutation.isPending || googleLoginMutation.isPending,
    error: store.error,
    isInitialized: store.isInitialized,

    // Actions
    login,
    register,
    logout: store.logout,
    googleLogin,
    forgotPassword,
    resetPassword,

    // Individual mutation states (useful for granular loading states)
    loginState: {
      isLoading: loginMutation.isPending,
      error: loginMutation.error?.message,
      isSuccess: loginMutation.isSuccess,
    },
    registerState: {
      isLoading: registerMutation.isPending,
      error: registerMutation.error?.message,
      isSuccess: registerMutation.isSuccess,
    },
    googleLoginState: {
      isLoading: googleLoginMutation.isPending,
      error: googleLoginMutation.error?.message,
      isSuccess: googleLoginMutation.isSuccess,
    },
    forgotPasswordState: {
      isLoading: forgotPasswordMutation.isPending,
      error: forgotPasswordMutation.error?.message,
      isSuccess: forgotPasswordMutation.isSuccess,
    },
    resetPasswordState: {
      isLoading: resetPasswordMutation.isPending,
      error: resetPasswordMutation.error?.message,
      isSuccess: resetPasswordMutation.isSuccess,
    },
  };
}
