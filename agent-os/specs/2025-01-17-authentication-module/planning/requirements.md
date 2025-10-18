# Requisitos del Módulo de Autenticación - UnTigrito®

## Descripción General
Implementación completa del flujo de autenticación de la aplicación UnTigrito®, incluyendo login, registro, recuperación de contraseña y verificación de identidad opcional.

## Flujo de Navegación Principal

### Flujo Principal
```
Splash → Login
```

### Desde Login (3 Decisiones)
- **Opción A**: Iniciar Sesión (Éxito) → Home
- **Opción B**: Registrarse → Registro
- **Opción C**: Recuperar Contraseña → Vista de Recuperar Contraseña

### Subflujo de Registro
```
Registro → Autenticado automáticamente → Introducción a la Verificación
```

### Flujo de Verificación (Opcional)
```
Introducción a la Verificación → [Omitir] → Home
Introducción a la Verificación → [Continuar] → Registrar cédula
Registrar cédula → [Verificar y continuar] → Registrar teléfono
Registrar teléfono → [Continuar] → Validar teléfono
Validar teléfono → [Verificar Código] → Home
```

### Subflujo de Recuperación de Contraseña
```
Vista de Recuperar Contraseña → Recupera Contraseña → Login
```

## Vistas (UI) Requeridas

### 1. Splash
- **Propósito**: Pantalla de bienvenida o carga inicial
- **Contenido**: Logo de UnTigrito® y nombre de la aplicación
- **Navegación**: Automáticamente dirige al Login tras un breve periodo

### 2. Login (Iniciar Sesión)
- **Propósito**: Permite a un usuario existente acceder a su cuenta
- **Campos**: 
  - Correo (Ejemplo: luisjose@gmail.com)
  - Contraseña (Ejemplo: 1234567)
- **Acciones/Enlaces**:
  - Botón "Iniciar Sesión"
  - Enlace "¿Olvidaste tu contraseña?" (Dirige a Recuperar Contraseña)
  - Botón "Iniciar sesión con Google" (Opción de autenticación social)
  - Enlace "¿No tienes una cuenta? Regístrate" (Dirige a Registro)

### 3. Registro (Crear Cuenta)
- **Propósito**: Permite a un nuevo usuario crear una cuenta
- **Campos**:
  - Nombre y apellido (Ejemplo: Luis jose)
  - Correo (Ejemplo: luisjose@gmail.com)
  - Contraseña (Ejemplo: 1234567)
  - Confirmación de contraseña
- **Acciones/Enlaces**:
  - Botón "Registrarse"
  - Botón "Iniciar sesión con Google" (Opción de autenticación social)
  - Enlace "¿Ya tienes una cuenta? Iniciar Sesión" (Dirige a Login)

### 4. Introducción a la Verificación
- **Propósito**: Informa al usuario sobre los beneficios y requisitos de la verificación de identidad
- **Requisitos Destacados**: Cédula de identidad y Número de teléfono
- **Acciones/Enlaces**:
  - Botón "Continuar" (Dirige a Registrar cédula)
  - Enlace "Omitir" (Permite saltar el proceso, dirigiendo al Home)

### 5. Registrar cédula (Verificación de Identidad)
- **Propósito**: Proceso de verificación de identidad del usuario
- **Pasos**:
  - Número de Cédula (Campo de texto, Ejemplo: 27483383)
  - Paso 1: Sube la imagen de tu cédula (Ház click para subir una imagen)
  - Paso 2: Escanea tu rostro (Área para el escaneo facial)
- **Acciones**: Botón "Verificar y continuar" (Dirige a Registrar teléfono)

### 6. Registrar teléfono (Ingresa tu teléfono)
- **Propósito**: Recopilar el número de teléfono para verificación
- **Campos**: Ingresa tu teléfono (Ejemplo: 04120386216)
- **Acciones**: Botón "Continuar" (Dirige a Validar teléfono)

### 7. Validar teléfono (Verifica tu teléfono)
- **Propósito**: Verificar la propiedad del número de teléfono mediante un código
- **Contenido**: 
  - Muestra el número a verificar (+58 412 0386216)
  - 5 campos para ingresar el código de verificación (OTP)
- **Acciones/Enlaces**:
  - Botón "Verificar Código"
  - Enlace "Reenviar código"

## Backend - Endpoints Requeridos

### Endpoints Existentes (Verificar/Actualizar)
- `POST /auth/login` - Inicio de Sesión
- `POST /auth/register` - Registro de Usuario
- `POST /auth/forgot-password` - Recuperar Contraseña
- `POST /auth/reset-password` - Resetear Contraseña
- `POST /auth/refresh` - Renovar Token
- `POST /auth/logout` - Cerrar Sesión

### Endpoints Nuevos Requeridos
- `POST /auth/google` - Login con Google
- `POST /user/verify/id` - Verificación Cédula
- `POST /user/send-otp` - Enviar Código OTP
- `POST /user/verify/otp` - Verificar Código OTP

## Esquemas de Datos

### Login Request
```json
{
  "email": "luisjose@gmail.com",
  "password": "1234567"
}
```

### Register Request
```json
{
  "name": "Luis jose",
  "email": "luisjose@gmail.com",
  "password": "1234567",
  "confirmPassword": "1234567"
}
```

### Google Auth Request
```json
{
  "token": "google_oauth_token"
}
```

### ID Verification Request
```json
{
  "cedula": "27483383",
  "cedulaImage": "file_upload",
  "faceScanData": "base64_encoded_data"
}
```

### OTP Request
```json
{
  "phoneNumber": "04120386216"
}
```

### OTP Verification Request
```json
{
  "phoneNumber": "04120386216",
  "otpCode": "12345"
}
```

## Notas Técnicas

### Registro y Autenticación
- Al registrarse, el usuario queda autenticado automáticamente
- El backend debe retornar un token de sesión tras un registro exitoso
- Después del registro exitoso, dirigir a la vista de verificación

### Verificación Opcional
- Los procesos de verificación son opcionales (se puede omitir)
- La aplicación debe guardar el estado de verificación completada
- Si el usuario omite la verificación, navegar directamente al Home

### Recuperación de Contraseña
- Después de recuperar contraseña, dirigir al Login
- El usuario debe loguearse con la nueva contraseña

## Componentes shadcn/ui Requeridos
- Button
- Input
- Card, CardContent, CardHeader, CardTitle
- Form, FormControl, FormField, FormItem, FormLabel, FormMessage
- Alert, AlertDescription
- Dialog, DialogContent, DialogHeader, DialogTitle
- Progress
- Badge
- Separator
- Label
- Textarea
- Avatar, AvatarFallback, AvatarImage
- Tabs, TabsContent, TabsList, TabsTrigger
