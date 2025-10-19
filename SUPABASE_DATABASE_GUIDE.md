# Guía de Supabase como Cliente de Base de Datos

Esta guía te muestra cómo usar Supabase únicamente como cliente de base de datos en tu aplicación Next.js, sin autenticación.

## Configuración

### Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # Opcional
```

### Instalación de Dependencias

```bash
cd /home/julio/workspace/mvp_tigrito_web && npm install @supabase/supabase-js
```

## Uso Básico

### Importar el Cliente

```typescript
import { supabase } from '@/lib/supabase/client'
```

### Consultas Básicas

```typescript
// Seleccionar todos los registros
const { data, error } = await supabase
  .from('usuarios')
  .select('*')

// Seleccionar campos específicos
const { data, error } = await supabase
  .from('usuarios')
  .select('id, nombre, email')

// Con filtros
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .eq('activo', true)
  .gte('created_at', '2024-01-01')
```

### Insertar Datos

```typescript
// Insertar un registro
const { data, error } = await supabase
  .from('usuarios')
  .insert([
    { nombre: 'Juan', email: 'juan@example.com' }
  ])
  .select()

// Insertar múltiples registros
const { data, error } = await supabase
  .from('usuarios')
  .insert([
    { nombre: 'Juan', email: 'juan@example.com' },
    { nombre: 'María', email: 'maria@example.com' }
  ])
  .select()
```

### Actualizar Datos

```typescript
// Actualizar por ID
const { data, error } = await supabase
  .from('usuarios')
  .update({ nombre: 'Juan Actualizado' })
  .eq('id', 1)
  .select()

// Actualizar múltiples registros
const { data, error } = await supabase
  .from('usuarios')
  .update({ activo: false })
  .eq('rol', 'inactivo')
  .select()
```

### Eliminar Datos

```typescript
// Eliminar por ID
const { data, error } = await supabase
  .from('usuarios')
  .delete()
  .eq('id', 1)

// Eliminar múltiples registros
const { data, error } = await supabase
  .from('usuarios')
  .delete()
  .eq('activo', false)
```

## Hooks Personalizados

### useSupabaseQuery

```tsx
import { useSupabaseQuery } from '@/hooks/supabase'

function UsuariosList() {
  const { data: usuarios, loading, error, refetch } = useSupabaseQuery(
    'usuarios',
    'id, nombre, email, activo'
  )

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Usuarios</h2>
      {usuarios?.map(usuario => (
        <div key={usuario.id}>
          <p>{usuario.nombre} - {usuario.email}</p>
        </div>
      ))}
      <button onClick={refetch}>Recargar</button>
    </div>
  )
}
```

### useSupabaseQueryWithFilters

```tsx
import { useSupabaseQueryWithFilters } from '@/hooks/supabase'

function UsuariosActivos() {
  const { data: usuarios, loading } = useSupabaseQueryWithFilters(
    'usuarios',
    { activo: true }, // Filtros
    'id, nombre, email'
  )

  return (
    <div>
      {usuarios?.map(usuario => (
        <div key={usuario.id}>{usuario.nombre}</div>
      ))}
    </div>
  )
}
```

### useInsert

```tsx
import { useInsert } from '@/hooks/supabase'

function CrearUsuario() {
  const { mutate: insertUsuario, loading } = useInsert('usuarios', {
    onSuccess: (data) => {
      console.log('Usuario creado:', data)
    },
    onError: (error) => {
      console.error('Error:', error.message)
    }
  })

  const handleCrear = () => {
    insertUsuario({
      nombre: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      activo: true
    })
  }

  return (
    <button onClick={handleCrear} disabled={loading}>
      {loading ? 'Creando...' : 'Crear Usuario'}
    </button>
  )
}
```

### useUpdate

```tsx
import { useUpdate } from '@/hooks/supabase'

function ActualizarUsuario({ usuarioId }: { usuarioId: string }) {
  const { mutate: updateUsuario, loading } = useUpdate('usuarios', {
    onSuccess: (data) => {
      console.log('Usuario actualizado:', data)
    }
  })

  const handleActualizar = () => {
    updateUsuario({
      id: usuarioId,
      nombre: 'Nombre Actualizado'
    })
  }

  return (
    <button onClick={handleActualizar} disabled={loading}>
      {loading ? 'Actualizando...' : 'Actualizar'}
    </button>
  )
}
```

### useDelete

```tsx
import { useDelete } from '@/hooks/supabase'

function EliminarUsuario({ usuarioId }: { usuarioId: string }) {
  const { mutate: deleteUsuario, loading } = useDelete('usuarios', {
    onSuccess: () => {
      console.log('Usuario eliminado')
    }
  })

  const handleEliminar = () => {
    deleteUsuario({ id: usuarioId })
  }

  return (
    <button onClick={handleEliminar} disabled={loading}>
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  )
}
```

## Consultas Avanzadas

### Filtros Complejos

```typescript
// Múltiples condiciones
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .eq('activo', true)
  .gte('edad', 18)
  .lte('edad', 65)
  .like('nombre', '%Juan%')

// Ordenamiento
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .order('created_at', { ascending: false })

// Límite y paginación
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .range(0, 9) // Primera página (10 registros)
  .order('id')
```

### Búsqueda de Texto

```typescript
// Búsqueda en múltiples campos
const { data, error } = await supabase
  .from('usuarios')
  .select('*')
  .or('nombre.ilike.%juan%,email.ilike.%juan%')
```

### Joins (Relaciones)

```typescript
// Unir tablas
const { data, error } = await supabase
  .from('usuarios')
  .select(`
    *,
    perfil:perfiles(*),
    pedidos:pedidos(*)
  `)
```

## Almacenamiento de Archivos

### Subir Archivos

```typescript
import { useProfileImageUpload } from '@/hooks/supabase'

function SubirImagen() {
  const { uploadFile, loading } = useProfileImageUpload()

  const handleFileUpload = async (file: File) => {
    const { url, error } = await uploadFile(file, `imagen-${Date.now()}.jpg`)
    if (url) {
      console.log('URL de la imagen:', url)
    }
  }

  return (
    <input 
      type="file" 
      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      disabled={loading}
    />
  )
}
```

## Manejo de Errores

```typescript
const { data, error } = await supabase
  .from('usuarios')
  .select('*')

if (error) {
  console.error('Error de Supabase:', error.message)
  console.error('Detalles:', error.details)
  console.error('Hint:', error.hint)
} else {
  console.log('Datos obtenidos:', data)
}
```

## Mejores Prácticas

1. **Siempre maneja errores**: Verifica el campo `error` en todas las respuestas
2. **Usa tipos TypeScript**: Genera tipos de tu base de datos para mayor seguridad
3. **Optimiza consultas**: Selecciona solo los campos que necesitas
4. **Usa filtros**: Aplica filtros en la base de datos, no en el cliente
5. **Paginación**: Para grandes conjuntos de datos, usa `range()` para paginación
6. **Caching**: Considera usar React Query o SWR para cache de datos

## Ejemplo Completo

Revisa el archivo `src/components/examples/SupabaseExample.tsx` para ver un ejemplo completo de implementación.
