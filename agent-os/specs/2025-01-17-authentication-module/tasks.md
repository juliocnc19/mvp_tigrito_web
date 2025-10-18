# Lista de Tareas - Módulo de Autenticación UnTigrito®

## Resumen de Tareas
- **Total de tareas**: 47
- **Fases**: 4 fases principales
- **Tiempo estimado**: 3-4 semanas
- **Prioridad**: Alta

## FASE 1: Preparación y Configuración (Semana 1)

### 1.1 Configuración del Proyecto
- [ ] **T1.1.1** - Instalar componentes shadcn/ui requeridos
  - **Descripción**: Instalar todos los componentes UI necesarios
  - **Tiempo**: 2 horas
  - **Dependencias**: Ninguna
  - **Comando**: `npx shadcn@latest add button input card form alert dialog progress badge separator label textarea avatar tabs`

- [ ] **T1.1.2** - Configurar variables de entorno
  - **Descripción**: Configurar variables para Google OAuth, JWT, OTP
  - **Tiempo**: 1 hora
  - **Dependencias**: Ninguna
  - **Archivos**: `.env.local`

- [ ] **T1.1.3** - Configurar NextAuth.js
  - **Descripción**: Configurar autenticación con NextAuth
  - **Tiempo**: 3 horas
  - **Dependencias**: T1.1.2
  - **Archivos**: `src/lib/auth/nextauth.ts`

### 1.2 Actualización de Esquemas
- [ ] **T1.2.1** - Actualizar esquemas de autenticación
  - **Descripción**: Actualizar `src/lib/schemas/auth.ts` con nuevos campos
  - **Tiempo**: 2 horas
  - **Dependencias**: Ninguna
  - **Archivos**: `src/lib/schemas/auth.ts`

- [ ] **T1.2.2** - Crear esquemas de verificación
  - **Descripción**: Crear esquemas para verificación de ID y OTP
  - **Tiempo**: 2 horas
  - **Dependencias**: Ninguna
  - **Archivos**: `src/lib/schemas/verification.ts`, `src/lib/schemas/otp.ts`

- [ ] **T1.2.3** - Crear tipos TypeScript
  - **Descripción**: Crear tipos para todas las interfaces
  - **Tiempo**: 1 hora
  - **Dependencias**: T1.2.1, T1.2.2
  - **Archivos**: `src/lib/types/auth.ts`, `src/lib/types/verification.ts`

## FASE 2: Backend - Endpoints y Lógica (Semana 1-2)

### 2.1 Endpoints de Autenticación
- [ ] **T2.1.1** - Actualizar endpoint de login
  - **Descripción**: Verificar y actualizar `POST /auth/login`
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.2.1
  - **Archivos**: `src/app/api/auth/login/route.ts`

- [ ] **T2.1.2** - Actualizar endpoint de registro
  - **Descripción**: Verificar y actualizar `POST /auth/register`
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.2.1
  - **Archivos**: `src/app/api/auth/register/route.ts`

- [ ] **T2.1.3** - Actualizar endpoint de recuperación
  - **Descripción**: Verificar y actualizar `POST /auth/forgot-password`
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.2.1
  - **Archivos**: `src/app/api/auth/forgot-password/route.ts`

- [ ] **T2.1.4** - Actualizar endpoint de reset
  - **Descripción**: Verificar y actualizar `POST /auth/reset-password`
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.2.1
  - **Archivos**: `src/app/api/auth/reset-password/route.ts`

### 2.2 Endpoints Nuevos
- [ ] **T2.2.1** - Implementar Google OAuth
  - **Descripción**: Crear `POST /auth/google`
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.1.3
  - **Archivos**: `src/app/api/auth/google/route.ts`

- [ ] **T2.2.2** - Implementar verificación de ID
  - **Descripción**: Crear `POST /user/verify/id`
  - **Tiempo**: 6 horas
  - **Dependencias**: T1.2.2
  - **Archivos**: `src/app/api/user/verify/id/route.ts`

- [ ] **T2.2.3** - Implementar envío de OTP
  - **Descripción**: Crear `POST /user/send-otp`
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.2.2
  - **Archivos**: `src/app/api/user/send-otp/route.ts`

- [ ] **T2.2.4** - Implementar verificación de OTP
  - **Descripción**: Crear `POST /user/verify/otp`
  - **Tiempo**: 3 horas
  - **Dependencias**: T1.2.2
  - **Archivos**: `src/app/api/user/verify/otp/route.ts`

### 2.3 Servicios de Apoyo
- [ ] **T2.3.1** - Crear servicio de OTP
  - **Descripción**: Implementar lógica de generación y validación de OTP
  - **Tiempo**: 3 horas
  - **Dependencias**: Ninguna
  - **Archivos**: `src/lib/services/otp.ts`

- [ ] **T2.3.2** - Crear servicio de Google Auth
  - **Descripción**: Implementar validación de tokens de Google
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.1.3
  - **Archivos**: `src/lib/services/google-auth.ts`

- [ ] **T2.3.3** - Crear servicio de upload
  - **Descripción**: Implementar upload y procesamiento de archivos
  - **Tiempo**: 4 horas
  - **Dependencias**: Ninguna
  - **Archivos**: `src/lib/services/file-upload.ts`

## FASE 3: Frontend - Componentes y Páginas (Semana 2-3)

### 3.1 Componentes de Autenticación
- [ ] **T3.1.1** - Crear LoginForm
  - **Descripción**: Componente de formulario de login
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/components/auth/LoginForm.tsx`

- [ ] **T3.1.2** - Crear RegisterForm
  - **Descripción**: Componente de formulario de registro
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/components/auth/RegisterForm.tsx`

- [ ] **T3.1.3** - Crear ForgotPasswordForm
  - **Descripción**: Componente de recuperación de contraseña
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/components/auth/ForgotPasswordForm.tsx`

- [ ] **T3.1.4** - Crear GoogleAuthButton
  - **Descripción**: Botón de autenticación con Google
  - **Tiempo**: 3 horas
  - **Dependencias**: T1.1.1, T2.3.2
  - **Archivos**: `src/components/auth/GoogleAuthButton.tsx`

### 3.2 Componentes de Verificación
- [ ] **T3.2.1** - Crear IDVerificationForm
  - **Descripción**: Formulario de verificación de cédula
  - **Tiempo**: 6 horas
  - **Dependencias**: T1.1.1, T2.3.3
  - **Archivos**: `src/components/verification/IDVerificationForm.tsx`

- [ ] **T3.2.2** - Crear PhoneVerificationForm
  - **Descripción**: Formulario de registro de teléfono
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/components/verification/PhoneVerificationForm.tsx`

- [ ] **T3.2.3** - Crear OTPVerificationForm
  - **Descripción**: Formulario de verificación de OTP
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/components/verification/OTPVerificationForm.tsx`

### 3.3 Páginas de Autenticación
- [ ] **T3.3.1** - Crear página Splash
  - **Descripción**: Página de bienvenida
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/app/splash/page.tsx`

- [ ] **T3.3.2** - Crear página Login
  - **Descripción**: Página de inicio de sesión
  - **Tiempo**: 3 horas
  - **Dependencias**: T3.1.1, T3.1.4
  - **Archivos**: `src/app/login/page.tsx`

- [ ] **T3.3.3** - Crear página Register
  - **Descripción**: Página de registro
  - **Tiempo**: 3 horas
  - **Dependencias**: T3.1.2, T3.1.4
  - **Archivos**: `src/app/register/page.tsx`

- [ ] **T3.3.4** - Crear página ForgotPassword
  - **Descripción**: Página de recuperación de contraseña
  - **Tiempo**: 2 horas
  - **Dependencias**: T3.1.3
  - **Archivos**: `src/app/forgot-password/page.tsx`

- [ ] **T3.3.5** - Crear página ResetPassword
  - **Descripción**: Página de reset de contraseña
  - **Tiempo**: 3 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/app/reset-password/page.tsx`

### 3.4 Páginas de Verificación
- [ ] **T3.4.1** - Crear página Intro Verificación
  - **Descripción**: Página de introducción a verificación
  - **Tiempo**: 2 horas
  - **Dependencias**: T1.1.1
  - **Archivos**: `src/app/verification/intro/page.tsx`

- [ ] **T3.4.2** - Crear página Verificar Cédula
  - **Descripción**: Página de verificación de cédula
  - **Tiempo**: 3 horas
  - **Dependencias**: T3.2.1
  - **Archivos**: `src/app/verification/id/page.tsx`

- [ ] **T3.4.3** - Crear página Registrar Teléfono
  - **Descripción**: Página de registro de teléfono
  - **Tiempo**: 2 horas
  - **Dependencias**: T3.2.2
  - **Archivos**: `src/app/verification/phone/page.tsx`

- [ ] **T3.4.4** - Crear página Validar Teléfono
  - **Descripción**: Página de validación de OTP
  - **Tiempo**: 3 horas
  - **Dependencias**: T3.2.3
  - **Archivos**: `src/app/verification/otp/page.tsx`

## FASE 4: Integración y Testing (Semana 3-4)

### 4.1 Integración de Componentes
- [ ] **T4.1.1** - Integrar formularios con APIs
  - **Descripción**: Conectar todos los formularios con endpoints
  - **Tiempo**: 6 horas
  - **Dependencias**: T2.1.1-T2.2.4, T3.1.1-T3.2.3
  - **Archivos**: Todos los componentes

- [ ] **T4.1.2** - Implementar navegación
  - **Descripción**: Configurar rutas y redirecciones
  - **Tiempo**: 4 horas
  - **Dependencias**: T3.3.1-T3.4.4
  - **Archivos**: `src/app/layout.tsx`, `src/middleware.ts`

- [ ] **T4.1.3** - Implementar manejo de estado
  - **Descripción**: Configurar estado global de autenticación
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.1.3
  - **Archivos**: `src/lib/contexts/AuthContext.tsx`

### 4.2 Validación y Manejo de Errores
- [ ] **T4.2.1** - Implementar validación de formularios
  - **Descripción**: Validación en tiempo real con Zod
  - **Tiempo**: 4 horas
  - **Dependencias**: T1.2.1, T1.2.2
  - **Archivos**: Todos los formularios

- [ ] **T4.2.2** - Implementar manejo de errores
  - **Descripción**: Manejo consistente de errores de API
  - **Tiempo**: 3 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: `src/lib/utils/error-handler.ts`

- [ ] **T4.2.3** - Implementar loading states
  - **Descripción**: Estados de carga en todos los formularios
  - **Tiempo**: 2 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: Todos los componentes

### 4.3 Testing
- [ ] **T4.3.1** - Testing unitario de componentes
  - **Descripción**: Tests para todos los componentes React
  - **Tiempo**: 8 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: `src/components/**/*.test.tsx`

- [ ] **T4.3.2** - Testing de integración
  - **Descripción**: Tests de flujos completos
  - **Tiempo**: 6 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: `src/tests/integration/`

- [ ] **T4.3.3** - Testing E2E
  - **Descripción**: Tests end-to-end con Playwright
  - **Tiempo**: 8 horas
  - **Dependencias**: T4.1.2
  - **Archivos**: `tests/e2e/`

### 4.4 Optimización y Refinamiento
- [ ] **T4.4.1** - Optimizar rendimiento
  - **Descripción**: Lazy loading, memoización, optimización de imágenes
  - **Tiempo**: 4 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: Todos los componentes

- [ ] **T4.4.2** - Mejorar accesibilidad
  - **Descripción**: ARIA labels, navegación por teclado, contraste
  - **Tiempo**: 3 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: Todos los componentes

- [ ] **T4.4.3** - Ajustar estilos y UX
  - **Descripción**: Refinamiento visual y experiencia de usuario
  - **Tiempo**: 4 horas
  - **Dependencias**: T4.1.1
  - **Archivos**: Todos los componentes

## Criterios de Aceptación

### Funcionalidad
- [ ] Usuario puede registrarse con email/password
- [ ] Usuario puede iniciar sesión con credenciales
- [ ] Usuario puede recuperar contraseña
- [ ] Usuario puede verificar identidad (opcional)
- [ ] Usuario puede autenticarse con Google
- [ ] Usuario puede verificar teléfono con OTP

### Rendimiento
- [ ] Carga inicial < 2 segundos
- [ ] Transiciones suaves entre vistas
- [ ] Upload de archivos < 10 segundos
- [ ] Respuesta de API < 500ms

### Seguridad
- [ ] Contraseñas encriptadas
- [ ] Tokens JWT seguros
- [ ] Validación de inputs
- [ ] Rate limiting implementado

### Usabilidad
- [ ] Formularios intuitivos
- [ ] Mensajes de error claros
- [ ] Navegación fluida
- [ ] Diseño responsive

## Notas de Implementación

### Orden de Desarrollo Recomendado
1. **Semana 1**: Fase 1 (Configuración) + Fase 2 (Backend)
2. **Semana 2**: Fase 3 (Frontend - Componentes)
3. **Semana 3**: Fase 3 (Frontend - Páginas) + Fase 4 (Integración)
4. **Semana 4**: Fase 4 (Testing + Optimización)

### Dependencias Críticas
- T1.1.1 debe completarse antes de cualquier componente UI
- T1.2.1-T1.2.2 deben completarse antes de los endpoints
- T2.1.1-T2.2.4 deben completarse antes de la integración
- T3.1.1-T3.2.3 deben completarse antes de las páginas

### Riesgos y Mitigaciones
- **Riesgo**: Integración con Google OAuth compleja
  - **Mitigación**: Implementar early, usar documentación oficial
- **Riesgo**: Upload de archivos puede ser lento
  - **Mitigación**: Implementar compresión, progress indicators
- **Riesgo**: Validación de cédula venezolana compleja
  - **Mitigación**: Usar regex simple, validación básica inicial
