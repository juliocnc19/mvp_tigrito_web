import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/lib/types/auth';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: true,
      error: null,
      isInitialized: false,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => {
        console.log('🔐 [authStore] setToken called with:', token ? 'Present' : 'Not found');
        set({ token });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      logout: () => {
        set({
          user: null,
          token: null,
          error: null
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        // Redirect to login page after logout
        window.location.href = '/login';
      },

      // Initialize auth state from localStorage
      initialize: () => {
        console.log('🔐 [authStore] Starting initialization...');
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('authUser');

        console.log('🔐 [authStore] Saved token:', savedToken ? 'Present' : 'Not found');
        console.log('🔐 [authStore] Saved user:', savedUser ? 'Present' : 'Not found');

        if (savedToken && savedUser) {
          try {
            const user = JSON.parse(savedUser);
            console.log('🔐 [authStore] Parsed user:', user);
            set({
              user,
              token: savedToken,
              isLoading: false,
              isInitialized: true
            });
            console.log('🔐 [authStore] Auth state initialized with user');
          } catch (err) {
            console.error('Failed to parse saved auth data:', err);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            set({
              user: null,
              token: null,
              isLoading: false,
              isInitialized: true
            });
            console.log('🔐 [authStore] Auth state initialized without user (parse error)');
          }
        } else {
          set({
            isLoading: false,
            isInitialized: true
          });
          console.log('🔐 [authStore] Auth state initialized without user (no saved data)');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user and token, not loading states or errors
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

// Initialize auth state on app start
if (typeof window !== 'undefined') {
  // Run initialization on client side only
  setTimeout(() => {
    const store = useAuthStore.getState();
    console.log('🔐 [authStore] Initializing auth state...');
    store.initialize();
  }, 0);
}
