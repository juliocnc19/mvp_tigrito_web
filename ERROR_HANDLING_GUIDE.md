# Guía de Manejo de Errores - Backend a UI

## Resumen
Se ha implementado un sistema estándar para mostrar errores del backend en la UI, asegurando que los mensajes de error de validación y otros errores se muestren de manera clara y consistente en todos los formularios.

## Componentes Principales

### 1. Utilidad `processApiError`
**Ubicación:** `src/lib/utils.ts`

Procesa errores estructurados del backend y los convierte en mensajes legibles para el usuario.

```typescript
export function processApiError(error: any): string {
  // Maneja errores con estructura: { error: { details: [...] } }
  // Maneja errores con estructura: { error: { message: "..." } }
  // Maneja errores genéricos
}
```

### 2. Componente `AlertDescriptionList`
**Ubicación:** `src/components/ui/alert.tsx`

Muestra errores múltiples de manera formateada:
- Errores únicos: Se muestran normalmente
- Múltiples errores: Se muestran como lista con viñetas

```tsx
<AlertDescriptionList error="Error único" />
<AlertDescriptionList error="Error 1\nError 2\nError 3" />
```

### 3. Hooks Actualizados
Todos los hooks de autenticación y verificación ahora procesan errores correctamente:

- `useLogin` - Login de usuario
- `useRegister` - Registro de usuario
- `useGoogleLogin` - Login con Google
- `useForgotPassword` - Recuperación de contraseña
- `useResetPassword` - Reset de contraseña
- `useSendOTP` - Envío de código OTP
- `useVerifyOTP` - Verificación de OTP
- `useVerifyID` - Verificación de ID

### 4. Formularios Actualizados
Los formularios ahora usan el hook `useAuth` y muestran errores correctamente:

- `LoginForm` - Formulario de login
- `RegisterForm` - Formulario de registro
- `PhoneVerificationForm` - Verificación de teléfono

## Estructura de Errores del Backend

### Errores de Validación
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid registration data",
    "details": [
      "Password must contain at least one lowercase letter",
      "Password must be at least 8 characters long"
    ]
  }
}
```

### Errores Genéricos
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email already exists"
  }
}
```

## Cómo Funciona

1. **Backend devuelve error estructurado** → API routes devuelven errores con formato consistente
2. **Hook procesa el error** → `processApiError()` convierte el error en mensaje legible
3. **UI muestra el error** → `AlertDescriptionList` formatea y muestra los errores
4. **Usuario ve mensaje claro** → Errores se muestran de manera amigable

## Ejemplo de Uso

```tsx
// En un componente de formulario
const { register, registerState } = useAuth();

return (
  <form onSubmit={handleSubmit}>
    {registerState.error && (
      <Alert variant="destructive">
        <AlertDescriptionList error={registerState.error} />
      </Alert>
    )}
    {/* ... campos del formulario ... */}
  </form>
);
```

## Beneficios

- ✅ **Consistencia**: Todos los formularios manejan errores igual
- ✅ **Claridad**: Errores específicos se muestran claramente
- ✅ **Escalabilidad**: Fácil agregar nuevos formularios con el mismo patrón
- ✅ **Mantenibilidad**: Un solo lugar para procesar errores del backend

## Prueba del Sistema

Para probar que funciona correctamente:

1. Intenta registrarte con una contraseña que no cumpla los requisitos (ej: "123456")
2. Verifica que se muestren los errores específicos de validación
3. Intenta registrarte con un email ya existente
4. Verifica que se muestre el error de conflicto

Los errores ahora se mostrarán de manera clara y estructurada en la UI en lugar de solo aparecer en los logs del desarrollador.
