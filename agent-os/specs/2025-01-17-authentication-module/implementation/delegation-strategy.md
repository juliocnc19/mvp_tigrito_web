# Estrategia de Delegación - Módulo de Autenticación

## Introducción
Este documento describe cómo la implementación del módulo de autenticación se delegaría a los subagents especializados en el sistema agent-os.

## Delegaciones por Fase

### FASE 1: Configuración (Semana 1)

#### Delegación 1: UI Designer - Configuración del Proyecto
**Tareas**:
- T1.1.1: Instalar componentes shadcn/ui
- T1.1.2: Configurar variables de entorno
- T1.1.3: Configurar NextAuth.js

**Instrucciones a UI Designer**:
```
Por favor, implementa la Fase 1.1 del módulo de autenticación:

1. Instala los componentes shadcn/ui requeridos usando:
   npx shadcn@latest add button input card form alert dialog progress badge separator label textarea avatar tabs

2. Configura las variables de entorno en .env.local para:
   - Google OAuth (NEXT_PUBLIC_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
   - JWT (JWT_SECRET, JWT_EXPIRATION)
   - OTP (OTP_EXPIRATION, OTP_LENGTH)

3. Configura NextAuth.js en src/lib/auth/nextauth.ts con:
   - Providers: Google OAuth, Credentials
   - Callbacks: jwt, session, signIn

Referencia: agent-os/specs/2025-01-17-authentication-module/spec.md

Actualiza las tareas completadas en: agent-os/specs/2025-01-17-authentication-module/tasks.md
Documenta tu trabajo en: agent-os/specs/2025-01-17-authentication-module/implementation/1_fase1-ui-designer.md
```

#### Delegación 2: API Engineer - Esquemas y Tipos
**Tareas**:
- T1.2.1: Actualizar esquemas de autenticación
- T1.2.2: Crear esquemas de verificación
- T1.2.3: Crear tipos TypeScript

**Instrucciones a API Engineer**:
```
Por favor, implementa la Fase 1.2 del módulo de autenticación:

1. Actualiza src/lib/schemas/auth.ts con:
   - RegisterRequestSchema: name, email, password, confirmPassword
   - LoginRequestSchema: email, password
   - GoogleAuthRequestSchema: token

2. Crea src/lib/schemas/verification.ts con:
   - IDVerificationRequestSchema: cedula, cedulaImage, faceScanData
   - PhoneVerificationRequestSchema: phoneNumber
   - OTPVerificationRequestSchema: phoneNumber, otpCode

3. Crea src/lib/schemas/otp.ts con:
   - OTPGenerationSchema
   - OTPValidationSchema

4. Crea tipos TypeScript en src/lib/types/ correspondientes

Referencia: agent-os/specs/2025-01-17-authentication-module/spec.md

Actualiza las tareas completadas en: agent-os/specs/2025-01-17-authentication-module/tasks.md
Documenta tu trabajo en: agent-os/specs/2025-01-17-authentication-module/implementation/2_fase1-api-engineer.md
```

### FASE 2: Backend (Semana 1-2)

#### Delegación 3: API Engineer - Endpoints de Autenticación
**Tareas**:
- T2.1.1-T2.1.4: Actualizar endpoints existentes
- T2.2.1-T2.2.4: Implementar nuevos endpoints
- T2.3.1-T2.3.3: Crear servicios de apoyo

**Instrucciones a API Engineer**:
```
Por favor, implementa la Fase 2 del módulo de autenticación:

ENDPOINTS EXISTENTES (Verificar/Actualizar):
1. POST /auth/login
   - Validar email y password con schemas
   - Retornar user y token JWT

2. POST /auth/register
   - Validar datos de registro
   - Crear usuario en BD
   - Retornar user y token JWT automáticamente

3. POST /auth/forgot-password
   - Enviar email con enlace de reset

4. POST /auth/reset-password
   - Validar token y newPassword
   - Actualizar contraseña

ENDPOINTS NUEVOS:
1. POST /auth/google
   - Validar token de Google
   - Crear/encontrar usuario
   - Retornar user y token JWT

2. POST /user/verify/id
   - Validar cédula (regex: /^\d{7,8}$/)
   - Procesar upload de imagen
   - Procesar escaneo facial
   - Guardar estado de verificación

3. POST /user/send-otp
   - Generar OTP de 5 dígitos
   - Guardar en Redis con TTL de 5 min
   - Enviar vía SMS

4. POST /user/verify/otp
   - Validar código OTP
   - Marcar teléfono como verificado
   - Limpiar OTP de Redis

SERVICIOS:
1. src/lib/services/otp.ts - Generación y validación de OTP
2. src/lib/services/google-auth.ts - Validación de tokens de Google
3. src/lib/services/file-upload.ts - Upload y procesamiento de archivos

Referencia: agent-os/specs/2025-01-17-authentication-module/spec.md

Actualiza las tareas completadas en: agent-os/specs/2025-01-17-authentication-module/tasks.md
Documenta tu trabajo en: agent-os/specs/2025-01-17-authentication-module/implementation/3_fase2-api-engineer.md
```

### FASE 3: Frontend (Semana 2-3)

#### Delegación 4: UI Designer - Componentes y Páginas
**Tareas**:
- T3.1.1-T3.1.4: Componentes de autenticación
- T3.2.1-T3.2.3: Componentes de verificación
- T3.3.1-T3.3.5: Páginas de autenticación
- T3.4.1-T3.4.4: Páginas de verificación

**Instrucciones a UI Designer**:
```
Por favor, implementa la Fase 3 del módulo de autenticación:

COMPONENTES DE FORMULARIOS:
1. src/components/auth/LoginForm.tsx
   - Email input, Password input
   - Validación en tiempo real
   - Botón de submit
   - Error handling

2. src/components/auth/RegisterForm.tsx
   - Name, Email, Password, Confirm Password inputs
   - Validación en tiempo real
   - Password match validation
   - Botón de submit

3. src/components/auth/ForgotPasswordForm.tsx
   - Email input
   - Botón de envío
   - Mensaje de confirmación

4. src/components/auth/GoogleAuthButton.tsx
   - Botón con logo de Google
   - Integración con Google OAuth

5. src/components/verification/IDVerificationForm.tsx
   - Cedula number input
   - File upload para imagen
   - Facial scan area
   - Progress steps

6. src/components/verification/PhoneVerificationForm.tsx
   - Phone number input (formato: 04120386216)
   - Botón de continuar

7. src/components/verification/OTPVerificationForm.tsx
   - 5 OTP input fields
   - Auto-focus behavior
   - Resend code button

PÁGINAS:
1. src/app/splash/page.tsx - Logo + auto-redirect
2. src/app/login/page.tsx - LoginForm + links
3. src/app/register/page.tsx - RegisterForm + links
4. src/app/forgot-password/page.tsx - ForgotPasswordForm
5. src/app/reset-password/page.tsx - Reset form
6. src/app/verification/intro/page.tsx - Intro info + buttons
7. src/app/verification/id/page.tsx - IDVerificationForm
8. src/app/verification/phone/page.tsx - PhoneVerificationForm
9. src/app/verification/otp/page.tsx - OTPVerificationForm

REQUISITOS TÉCNICOS:
- Usar shadcn/ui components solamente
- Validación con Zod schemas
- Manejo de errors
- Loading states
- Responsive design
- Accesibilidad WCAG AA

Referencia: agent-os/specs/2025-01-17-authentication-module/spec.md

Actualiza las tareas completadas en: agent-os/specs/2025-01-17-authentication-module/tasks.md
Documenta tu trabajo en: agent-os/specs/2025-01-17-authentication-module/implementation/4_fase3-ui-designer.md
```

### FASE 4: Integración, Testing y Refinamiento (Semana 3-4)

#### Delegación 5: UI Designer - Integración
**Tareas**:
- T4.1.1-T4.1.3: Integración de componentes
- T4.2.1-T4.2.3: Validación y manejo de errores

**Instrucciones a UI Designer**:
```
Por favor, implementa la Fase 4.1-4.2 del módulo de autenticación:

1. Integra formularios con APIs:
   - Conecta LoginForm con POST /auth/login
   - Conecta RegisterForm con POST /auth/register
   - Conecta IDVerificationForm con POST /user/verify/id
   - Etc.

2. Implementa navegación:
   - Splash → Login (2 segundos)
   - Login → Home (login exitoso)
   - Login → Register
   - Login → Forgot Password
   - Register → Verification Intro (auto-redirect)
   - Verification → Home (si omite o completa)

3. Implementa state management:
   - AuthContext para estado global
   - Persist tokens en localStorage
   - Manejo de sesiones

4. Validación de formularios:
   - Validación en tiempo real
   - Mensajes de error descriptivos
   - Disabled states en botones

5. Loading states:
   - Spinners en botones
   - Skeleton loaders
   - Disabled inputs durante submit

Referencia: agent-os/specs/2025-01-17-authentication-module/spec.md

Actualiza las tareas completadas en: agent-os/specs/2025-01-17-authentication-module/tasks.md
Documenta tu trabajo en: agent-os/specs/2025-01-17-authentication-module/implementation/5_fase4-ui-designer-integracion.md
```

#### Delegación 6: Testing Engineer - Testing Completo
**Tareas**:
- T4.3.1-T4.3.3: Testing unitario, integración, E2E

**Instrucciones a Testing Engineer**:
```
Por favor, implementa la Fase 4.3 del módulo de autenticación:

TESTING UNITARIO:
- Tests para cada componente (LoginForm, RegisterForm, etc.)
- Mocking de APIs
- Validación de rendering
- Manejo de eventos
- Target: 80%+ coverage

TESTING DE INTEGRACIÓN:
- Flujo de login completo
- Flujo de registro + verificación
- Recuperación de contraseña
- Google OAuth flow
- OTP verification flow

TESTING E2E:
- Usar Playwright
- Tests para cada ruta principal
- User journey complete
- Error scenarios

Referencia: agent-os/specs/2025-01-17-authentication-module/spec.md

Actualiza las tareas completadas en: agent-os/specs/2025-01-17-authentication-module/tasks.md
Documenta tu trabajo en: agent-os/specs/2025-01-17-authentication-module/implementation/6_fase4-testing-engineer.md
```

## Reportes de Implementación

Cada subagent debe crear un reporte de implementación:

```
agent-os/specs/2025-01-17-authentication-module/implementation/
├── 1_fase1-ui-designer.md (UI Designer - Configuración)
├── 2_fase1-api-engineer.md (API Engineer - Esquemas)
├── 3_fase2-api-engineer.md (API Engineer - Endpoints)
├── 4_fase3-ui-designer.md (UI Designer - Componentes)
├── 5_fase4-ui-designer-integracion.md (UI Designer - Integración)
└── 6_fase4-testing-engineer.md (Testing Engineer - Tests)
```

## Sincronización y Dependencias

```
┌─────────────────────────────────────────────────────────────┐
│ SEMANA 1                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ UI Designer (T1.1.1-T1.1.3)  ─────────────┐               │
│ API Engineer (T1.2.1-T1.2.3) ──┐          │               │
│ API Engineer (T2.1.1-T2.1.4) ──┼──────────┤               │
│                                │          │               │
│                                └─ Esperar ┘               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SEMANA 2                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ API Engineer (T2.2.1-T2.3.3) ──┐                          │
│ UI Designer (T3.1.1-T3.3.5)  ──┼─ Paralelo                │
│                                │                           │
│                                └─ Endpoints completados   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SEMANA 3                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ UI Designer (T3.4.1-T4.2.3)  ──┐                          │
│                                │                           │
│                                └─ Todo completado antes   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SEMANA 4                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Testing Engineer (T4.3.1-T4.3.3) ──┐                      │
│ UI Designer (T4.4.1-T4.4.3)       ──┼─ Paralelo          │
│                                      │                    │
│                                      └─ Testing y ajustes │
└─────────────────────────────────────────────────────────────┘
```

## Monitoreo del Progreso

### Checklist para Cada Delegación
- [ ] Instrucciones entendidas
- [ ] Dependencias cumplidas
- [ ] Tareas iniciadas
- [ ] Tests ejecutados localmente
- [ ] Código commiteado
- [ ] Reporte de implementación creado
- [ ] Tasks.md actualizado

### Puntos de Sincronización
1. **EOD Semana 1**: Configuración completa, esquemas creados
2. **EOD Semana 2**: Backend completo, componentes creados
3. **EOD Semana 3**: Integración completa, testing iniciado
4. **EOD Semana 4**: Todo completado, testing aprobado
