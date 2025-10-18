# Plan de Implementación - Módulo de Autenticación

## Fase 1: Backend - Endpoints y Lógica

### 1.1 Actualizar Esquemas de Validación
- [ ] Actualizar `src/lib/schemas/auth.ts` para incluir nuevos campos
- [ ] Crear esquemas para verificación de identidad
- [ ] Crear esquemas para OTP

### 1.2 Implementar Endpoints Faltantes
- [ ] `POST /auth/google` - Login con Google
- [ ] `POST /user/verify/id` - Verificación Cédula  
- [ ] `POST /user/send-otp` - Enviar Código OTP
- [ ] `POST /user/verify/otp` - Verificar Código OTP

### 1.3 Actualizar Endpoints Existentes
- [ ] Verificar/actualizar `POST /auth/login`
- [ ] Verificar/actualizar `POST /auth/register`
- [ ] Verificar/actualizar `POST /auth/forgot-password`
- [ ] Verificar/actualizar `POST /auth/reset-password`

## Fase 2: Frontend - Componentes shadcn/ui

### 2.1 Instalar Componentes shadcn/ui Requeridos
- [ ] Button, Input, Card, Form
- [ ] Alert, Dialog, Progress, Badge
- [ ] Separator, Label, Textarea
- [ ] Avatar, Tabs

### 2.2 Crear Páginas de Autenticación
- [ ] `src/app/splash/page.tsx` - Pantalla de bienvenida
- [ ] `src/app/login/page.tsx` - Iniciar sesión
- [ ] `src/app/register/page.tsx` - Registro
- [ ] `src/app/forgot-password/page.tsx` - Recuperar contraseña
- [ ] `src/app/reset-password/page.tsx` - Resetear contraseña

### 2.3 Crear Páginas de Verificación
- [ ] `src/app/verification/intro/page.tsx` - Introducción a verificación
- [ ] `src/app/verification/id/page.tsx` - Verificar cédula
- [ ] `src/app/verification/phone/page.tsx` - Registrar teléfono
- [ ] `src/app/verification/otp/page.tsx` - Validar teléfono

### 2.4 Crear Componentes Reutilizables
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/RegisterForm.tsx`
- [ ] `src/components/auth/ForgotPasswordForm.tsx`
- [ ] `src/components/auth/GoogleAuthButton.tsx`
- [ ] `src/components/verification/IDVerificationForm.tsx`
- [ ] `src/components/verification/PhoneVerificationForm.tsx`
- [ ] `src/components/verification/OTPVerificationForm.tsx`

## Fase 3: Integración y Navegación

### 3.1 Configurar Navegación
- [ ] Configurar rutas protegidas
- [ ] Implementar redirecciones automáticas
- [ ] Manejar estados de autenticación

### 3.2 Integrar con Backend
- [ ] Conectar formularios con API endpoints
- [ ] Manejar respuestas y errores
- [ ] Implementar manejo de tokens

### 3.3 Funcionalidades Adicionales
- [ ] Upload de imágenes para cédula
- [ ] Integración con Google OAuth
- [ ] Envío de códigos OTP
- [ ] Validación de formularios

## Fase 4: Testing y Refinamiento

### 4.1 Testing
- [ ] Probar flujo completo de autenticación
- [ ] Probar flujo de verificación opcional
- [ ] Probar recuperación de contraseña
- [ ] Probar manejo de errores

### 4.2 Refinamiento
- [ ] Ajustar estilos y UX
- [ ] Optimizar rendimiento
- [ ] Añadir validaciones adicionales
- [ ] Documentar componentes
