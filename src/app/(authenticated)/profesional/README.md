# Módulo Profesional - El Tigrito

Este módulo implementa el **Modo Profesional** de la aplicación El Tigrito, permitiendo a los trabajadores gestionar sus servicios, ofertas y trabajos.

## Estructura del Módulo

```
/profesional/
├── layout.tsx              # Layout principal del módulo profesional
├── page.tsx                # Página principal - Publicaciones
├── tigres/
│   └── page.tsx           # Gestión de trabajos (Tigres)
├── servicios/
│   └── page.tsx           # Servicios proactivos
└── perfil/
    └── page.tsx           # Perfil profesional
```

## Características Principales

### 1. **Publicaciones** (`/profesional`)
- Vista de publicaciones disponibles de clientes
- Sistema de ofertas y cotizaciones
- Filtros por categoría, ubicación y precio
- Búsqueda avanzada

### 2. **Tigres** (`/profesional/tigres`)
- Gestión de trabajos en diferentes estados:
  - **Solicitudes**: Trabajos pendientes de aceptación
  - **Pendientes**: Trabajos aceptados, pendientes de agendar
  - **Agendados**: Trabajos programados
  - **En Progreso**: Trabajos en ejecución
  - **Completados**: Trabajos finalizados
- Vista de calendario para gestión de horarios
- Estadísticas de rendimiento

### 3. **Servicios** (`/profesional/servicios`)
- Creación y gestión de servicios proactivos
- Precios fijos y descripciones detalladas
- Galería de imágenes y portafolio
- Ubicaciones de servicio
- Estadísticas de reservas y ganancias

### 4. **Perfil Profesional** (`/profesional/perfil`)
- **Resumen**: Estadísticas de rendimiento y ganancias
- **Portafolio**: Galería de trabajos completados
- **Profesiones**: Especialidades y certificaciones
- **Configuración**: Preferencias y configuración personal

## Componentes Principales

### Navigation
- `ProfessionalTopBar`: Barra superior con balance y notificaciones
- `ProfessionalNavigation`: Navegación por pestañas
- `ModeSwitch`: Switch para cambiar entre modo Cliente/Profesional

### Publicaciones
- `ProfessionalPostingCard`: Tarjeta de publicación con opciones de oferta

### Tigres (Trabajos)
- `TigresTabNavigation`: Navegación por estados de trabajo
- `TigresJobCard`: Tarjeta de trabajo individual
- `TigresCalendar`: Vista de calendario para trabajos

### Servicios Proactivos
- `ProfessionalServiceCard`: Tarjeta de servicio (vista grid/lista)
- `CreateServiceModal`: Modal para crear nuevos servicios

### Perfil
- `ProfessionalProfileHeader`: Header del perfil con información básica
- `ProfessionalStats`: Estadísticas y métricas de rendimiento
- `ProfessionalPortfolio`: Gestión del portafolio de trabajos
- `ProfessionalProfessions`: Gestión de especialidades
- `ProfessionalSettings`: Configuración y preferencias

## Estados de Trabajo

1. **PENDING_SOLICITUD**: Solicitud pendiente de aceptación
2. **SCHEDULED**: Trabajo agendado
3. **IN_PROGRESS**: Trabajo en progreso
4. **COMPLETED**: Trabajo completado
5. **CANCELED**: Trabajo cancelado

## Funcionalidades Clave

### Sistema de Ofertas
- Los profesionales pueden ofertar en publicaciones de clientes
- Formulario de oferta con validación de precio mínimo
- Notificaciones en tiempo real

### Servicios Proactivos
- Los profesionales pueden crear servicios con precio fijo
- Los clientes pueden contratar directamente sin publicar
- Gestión completa de servicios (crear, editar, eliminar, activar/desactivar)

### Gestión de Trabajos
- Vista unificada de todos los trabajos
- Filtros por estado y fecha
- Vista de calendario para planificación
- Acciones específicas por estado

### Perfil Profesional
- Información personal y de contacto
- Portafolio con trabajos completados
- Especialidades y certificaciones
- Estadísticas de rendimiento y ganancias

## Integración con el Sistema

El módulo profesional se integra con:
- **Sistema de autenticación**: Verificación de identidad
- **Sistema de pagos**: Gestión de ganancias y comisiones
- **Sistema de notificaciones**: Alertas de trabajos y mensajes
- **Sistema de geolocalización**: Ubicaciones de servicio
- **Sistema de multimedia**: Imágenes y documentos

## Navegación

El módulo incluye navegación contextual que cambia según el modo:
- **Modo Cliente**: Navegación hacia contratación de servicios
- **Modo Profesional**: Navegación hacia gestión de trabajos

## Responsive Design

Todos los componentes están diseñados para ser completamente responsivos:
- **Mobile**: Navegación por pestañas, cards apiladas
- **Tablet**: Grid adaptativo, navegación híbrida
- **Desktop**: Vista completa con sidebar y navegación expandida
