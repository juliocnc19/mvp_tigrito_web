# Guía de Uso de Zustand en UnTigrito

Esta guía explica cómo usar Zustand correctamente en el proyecto UnTigrito para la gestión de estado global.

## 📦 Arquitectura de Estado

### Zustand + React Query

El proyecto utiliza una arquitectura híbrida:

- **Zustand**: Para estado global persistente (usuario autenticado, configuración)
- **React Query**: Para estado de servidor (datos de API, cache inteligente)

### Estructura de Stores

```
src/lib/stores/
├── authStore.ts        # Estado de autenticación
├── uiStore.ts         # Estado de UI (futuro)
└── ...
```

## 🔐 Auth Store (Estado de Autenticación)

### Configuración del Store

```typescript
// src/lib/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Acciones
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
      // Implementación del store...
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
```

### Características del Auth Store

#### ✅ Persistencia Automática
- **localStorage**: Usuario y token se guardan automáticamente
- **Hidratación**: Estado se restaura al recargar la página
- **Partialize**: Solo se persiste lo necesario

#### ✅ Inicialización Segura
```typescript
// Se ejecuta automáticamente al montar la app
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useAuthStore.getState().initialize();
  }, 0);
}
```

## 🎣 Hook Combinado useAuth

### Interfaz Completa

```typescript
const {
  // Estado de Zustand
  user,
  token,
  isLoading,
  error,
  isInitialized,

  // Acciones combinadas
  login,
  register,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword,

  // Estados granulares de React Query
  loginState: {
    isLoading: boolean,
    error: string | null,
    isSuccess: boolean,
  },
  registerState: { /* ... */ },
  // ...
} = useAuth();
```

### Uso en Componentes

#### ✅ Login Component
```typescript
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { login, loginState } = useAuth();

  const handleSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      // Redirección automática en el hook
    } catch (error) {
      // Error manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input disabled={loginState.isLoading} />
      <button disabled={loginState.isLoading}>
        {loginState.isLoading ? 'Cargando...' : 'Login'}
      </button>
      {loginState.error && <div>{loginState.error}</div>}
    </form>
  );
}
```

#### ✅ Componente Protegido
```typescript
import { useAuth } from '@/hooks/useAuth';

export function ProtectedComponent() {
  const { user, isInitialized, logout } = useAuth();

  // Mostrar loading mientras se inicializa
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Redirigir si no hay usuario
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Bienvenido {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🏗️ Creación de Nuevos Stores

### Patrón Recomendado

```typescript
// src/lib/stores/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Estado
  theme: 'light' | 'dark';
  sidebarOpen: boolean;

  // Acciones
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
```

### Cuándo Usar Persistencia

- **✅ Persistir**: Usuario autenticado, preferencias de usuario, configuración de tema
- **❌ No persistir**: Estados de carga, errores, datos temporales

## 🔄 Integración con React Query

### Patrón Recomendado

```typescript
// Hook combinado que integra Zustand + React Query
export function useCombinedHook() {
  const zustandState = useZustandStore();
  const reactQueryState = useReactQueryHook();

  // Lógica combinada...

  return {
    // Estado combinado
    data: reactQueryState.data,
    isLoading: zustandState.isLoading || reactQueryState.isLoading,
    error: zustandState.error || reactQueryState.error,

    // Acciones combinadas
    action: async (params) => {
      // Actualizar Zustand
      zustandState.setLoading(true);

      try {
        // Ejecutar React Query mutation
        const result = await reactQueryState.mutateAsync(params);

        // Actualizar Zustand con resultado
        zustandState.setData(result);
        zustandState.setLoading(false);

        return result;
      } catch (error) {
        zustandState.setError(error.message);
        zustandState.setLoading(false);
        throw error;
      }
    },
  };
}
```

## 📋 Mejores Prácticas

### ✅ Hacer

```typescript
// ✅ Separar acciones del estado
interface StoreState {
  // Estado
  count: number;

  // Acciones
  increment: () => void;
  decrement: () => void;
}

// ✅ Usar tipos TypeScript
export const useStore = create<StoreState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// ✅ Usar selectores para rendimiento
const useCount = () => useStore((state) => state.count);
const useActions = () => useStore((state) => ({
  increment: state.increment,
  decrement: state.decrement,
}));
```

### ❌ Evitar

```typescript
// ❌ No acceder al store fuera de componentes
const store = useStore.getState(); // ❌ Solo en componentes

// ❌ No modificar estado directamente
set({ count: 5 }); // ❌ Usa acciones

// ❌ No crear stores dentro de componentes
const useBadStore = () => create({...}); // ❌ Crea fuera
```

## 🧪 Testing con Zustand

### Testing Stores

```typescript
// __tests__/authStore.test.ts
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '@/lib/stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout(); // Reset state
  });

  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({ id: '1', name: 'Test' });
    });

    expect(result.current.user?.name).toBe('Test');
  });
});
```

## 🚀 Migración desde Context

### Antes (React Context)
```typescript
// ❌ Context + useReducer
const [state, dispatch] = useReducer(authReducer, initialState);
```

### Después (Zustand)
```typescript
// ✅ Zustand
const { user, login, logout } = useAuthStore();
```

## 📚 Recursos Adicionales

- [Documentación Oficial de Zustand](https://zustand-demo.pmnd.rs/)
- [Zustand con TypeScript](https://docs.pmnd.rs/zustand/guides/typescript)
- [Middleware de Persistencia](https://docs.pmnd.rs/zustand/middleware/persist)

## 🎯 Resumen

- **Zustand**: Para estado global persistente y complejo
- **React Query**: Para datos del servidor y cache inteligente
- **Hooks Combinados**: Integración perfecta entre ambos
- **TypeScript**: Tipado completo para mejor DX
- **Testing**: Fácil de testear con herramientas estándar

Esta arquitectura proporciona una gestión de estado robusta, performante y fácil de mantener. 🎉
