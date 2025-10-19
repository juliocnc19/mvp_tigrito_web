# Sistema de Colores - UnTigrito

## Variables CSS Globales

Este documento describe el sistema de colores centralizado implementado en el proyecto UnTigrito. Todas las variables están definidas en `src/app/globals.css` y son compatibles con el sistema de temas claro/oscuro.

### Sidebar
- `--color-sidebar-bg`: Fondo del sidebar (gray-900 en claro, gray-800 en oscuro)
- `--color-sidebar-hover`: Hover en elementos del sidebar (gray-700)
- `--color-sidebar-text`: Texto principal del sidebar (white)
- `--color-sidebar-text-secondary`: Texto secundario del sidebar (gray-300)
- `--color-sidebar-border`: Bordes del sidebar (gray-700)

### Brand (Marca)
- `--color-brand-primary`: Color primario de la marca (blue-600)
- `--color-brand-primary-hover`: Hover del color primario (blue-700)

### Success (Éxito/Verde)
- `--color-success`: Color de éxito (green-600)
- `--color-success-light`: Fondo claro de éxito (green-50)
- `--color-success-text`: Texto de éxito (green-800)

### Danger (Peligro/Rojo)
- `--color-danger`: Color de peligro (red-500)
- `--color-danger-hover`: Hover de peligro (red-900)
- `--color-danger-light`: Fondo claro de peligro (red-50)
- `--color-danger-text`: Texto de peligro (red-400)

### Neutral (Grises)
- `--color-neutral-bg`: Fondo blanco/base (white en claro, gray-900 en oscuro)
- `--color-neutral-surface`: Superficies (gray-50 en claro, gray-800 en oscuro)
- `--color-neutral-border`: Bordes (gray-200 en claro, gray-700 en oscuro)
- `--color-neutral-text`: Texto principal (gray-900 en claro, white en oscuro)
- `--color-neutral-text-secondary`: Texto secundario (gray-600)
- `--color-neutral-text-tertiary`: Texto terciario (gray-500)

### Utilidades
- `--color-warning-badge`: Badges de advertencia (yellow-500)
- `--color-skeleton`: Color de skeleton loaders (gray-200)
- `--color-skeleton-gradient-from`: Inicio del gradiente de skeleton (gray-200)
- `--color-skeleton-gradient-to`: Fin del gradiente de skeleton (gray-300)

## Variables shadcn/ui (Mantener sin cambios)

El proyecto mantiene intacto el sistema de variables de shadcn/ui para compatibilidad:

- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`, `destructive-foreground`
- `border`, `input`, `ring`

## Uso en Tailwind CSS

### Sintaxis para Variables Custom
```css
/* Usar variables custom con sintaxis de Tailwind */
bg-[var(--color-brand-primary)]
text-[var(--color-neutral-text)]
border-[var(--color-neutral-border)]
```

### Sintaxis para Variables shadcn/ui
```css
/* Usar variables shadcn/ui directamente */
bg-card
text-foreground
border-border
bg-destructive
text-muted-foreground
```

## Ejemplos de Uso

### Componente de Navegación
```tsx
<nav className="bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)]">
  <button className="hover:bg-[var(--color-sidebar-hover)]">
    <span className="text-[var(--color-sidebar-text-secondary)]">Menú</span>
  </button>
</nav>
```

### Componente de Card
```tsx
<div className="bg-card border border-border">
  <h3 className="text-[var(--color-neutral-text)]">Título</h3>
  <p className="text-[var(--color-neutral-text-secondary)]">Descripción</p>
  <button className="bg-[var(--color-brand-primary)] text-white">
    Acción
  </button>
</div>
```

### Estados de Éxito/Error
```tsx
<div className="bg-[var(--color-success-light)] border border-[var(--color-success)]">
  <p className="text-[var(--color-success-text)]">Operación exitosa</p>
</div>

<div className="bg-[var(--color-danger-light)] border border-destructive">
  <p className="text-destructive">Error en la operación</p>
</div>
```

## Modo Oscuro

Todas las variables personalizadas tienen versiones para modo oscuro definidas en la clase `.dark`:

```css
.dark {
  --color-sidebar-bg: oklch(0.205 0 0);
  --color-neutral-bg: oklch(0.145 0 0);
  --color-neutral-text: oklch(0.985 0 0);
  /* ... más variables */
}
```

## Beneficios del Sistema

1. **Consistencia**: Todos los componentes usan las mismas variables de color
2. **Mantenibilidad**: Cambios de color centralizados en un solo archivo
3. **Temas**: Soporte automático para modo claro/oscuro
4. **Escalabilidad**: Fácil agregar nuevos colores al sistema
5. **Compatibilidad**: Mantiene integración con shadcn/ui

## Migración Completada

Los siguientes componentes han sido migrados al nuevo sistema:

### Navegación
- ✅ SidebarNavigation.tsx
- ✅ TopNavigation.tsx

### Cards
- ✅ BalanceCard.tsx
- ✅ ServiceCard.tsx
- ✅ CategoryGrid.tsx

### Profesionales
- ✅ ProfessionalTopBar.tsx
- ✅ ProfessionalStats.tsx
- ✅ ProfessionalProfileHeader.tsx
- ✅ ProfessionalServiceCard.tsx
- ✅ ProfessionalPortfolio.tsx
- ✅ ProfessionalProfessions.tsx
- ✅ ProfessionalSettings.tsx
- ✅ CreateServiceModal.tsx
- ✅ TigresCalendar.tsx
- ✅ TigresJobCard.tsx
- ✅ TigresTabNavigation.tsx
- ✅ ProfessionalPostingCard.tsx
- ✅ ProfessionalNavigation.tsx
- ✅ ModeSwitch.tsx

### Administración
- ✅ AdminSidebar.tsx
- ✅ ChatbotPlaygroundWithHistory.tsx
- ✅ TicketManagement.tsx
- ✅ TicketDetail.tsx
- ✅ ChatbotPlayground.tsx
- ✅ DataTable.tsx
- ✅ EntityActions.tsx
- ✅ CreateUserModal.tsx

### Otros
- ✅ ProfessionalCard.tsx
- ✅ RequestCard.tsx
- ✅ SearchBar.tsx
- ✅ Auth components (LoginForm, RegisterForm)
- ✅ Verification components (OTP, Phone, ID)

## Notas Técnicas

- **Formato OKLCH**: Todas las variables usan el formato OKLCH para mejor consistencia de color
- **Compatibilidad**: Funciona con navegadores modernos que soportan CSS custom properties
- **Performance**: Las variables CSS son más eficientes que clases de Tailwind repetitivas
- **Debugging**: Fácil identificar colores usando las herramientas de desarrollador del navegador
