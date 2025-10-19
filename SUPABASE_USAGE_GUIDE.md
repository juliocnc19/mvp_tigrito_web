# Guía de Uso de Supabase - Cliente (Solo Base de Datos)

Esta guía te muestra cómo usar Supabase como cliente de base de datos en el lado del cliente de tu aplicación Next.js.

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Generar Tipos de TypeScript

Para obtener los tipos reales de tu base de datos, ejecuta:

```bash
cd /home/julio/workspace/mvp_tigrito_web && npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

## Uso Básico

### Conexión Directa a la Base de Datos

```tsx
import { supabase } from '@/lib/supabase/client'

function DatabaseComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tu_tabla')
      .select('*')
    
    if (error) {
      console.error('Error:', error.message)
    } else {
      setData(data)
    }
    setLoading(false)
  }

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Datos'}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

### Consultas a la Base de Datos

```tsx
import { useSupabaseQuery } from '@/hooks/supabase'

function ProfilesList() {
  const { data: profiles, loading, error, refetch } = useSupabaseQuery(
    'profiles',
    'id, email, created_at'
  )

  if (loading) return <div>Cargando perfiles...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h2>Perfiles</h2>
      {profiles?.map(profile => (
        <div key={profile.id}>
          <p>{profile.email}</p>
        </div>
      ))}
      <button onClick={refetch}>Recargar</button>
    </div>
  )
}
```

### Consultas con Filtros

```tsx
import { useSupabaseQueryWithFilters } from '@/hooks/supabase'

function FilteredProfiles() {
  const { data: profiles, loading } = useSupabaseQueryWithFilters(
    'profiles',
    { status: 'active' }, // Filtros
    'id, email, status'
  )

  return (
    <div>
      {profiles?.map(profile => (
        <div key={profile.id}>{profile.email}</div>
      ))}
    </div>
  )
}
```

### Mutaciones (Insert, Update, Delete)

```tsx
import { useInsert, useUpdate, useDelete } from '@/hooks/supabase'

function ProfileManager() {
  const { mutate: insertProfile, loading: insertLoading } = useInsert('profiles', {
    onSuccess: (data) => console.log('Perfil creado:', data)
  })

  const { mutate: updateProfile, loading: updateLoading } = useUpdate('profiles', {
    onSuccess: (data) => console.log('Perfil actualizado:', data)
  })

  const { mutate: deleteProfile, loading: deleteLoading } = useDelete('profiles', {
    onSuccess: () => console.log('Perfil eliminado')
  })

  const handleCreate = () => {
    insertProfile({
      email: 'new@example.com',
      name: 'Nuevo Usuario'
    })
  }

  const handleUpdate = (id: string) => {
    updateProfile({
      id,
      name: 'Nombre Actualizado'
    })
  }

  const handleDelete = (id: string) => {
    deleteProfile({ id })
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={insertLoading}>
        Crear Perfil
      </button>
      {/* Botones de actualizar y eliminar */}
    </div>
  )
}
```

### Almacenamiento de Archivos

```tsx
import { useProfileImageUpload } from '@/hooks/supabase'

function ImageUploader() {
  const { uploadFile, getPublicUrl, loading } = useProfileImageUpload({
    onSuccess: (url) => console.log('Imagen subida:', url)
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const { url } = await uploadFile(file, `profile-${Date.now()}.jpg`)
    if (url) {
      console.log('URL pública:', url)
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} disabled={loading} />
      {loading && <p>Subiendo imagen...</p>}
    </div>
  )
}
```

## Hooks Disponibles

### useQuery / useSupabaseQuery
- `data`: Datos obtenidos
- `loading`: Estado de carga
- `error`: Error de consulta
- `refetch()`: Recargar datos

### useMutation / useInsert / useUpdate / useDelete
- `data`: Datos de la mutación
- `loading`: Estado de carga
- `error`: Error de mutación
- `mutate(variables)`: Ejecutar mutación
- `reset()`: Limpiar estado

### useStorage
- `uploadFile(file, path)`: Subir archivo
- `deleteFile(path)`: Eliminar archivo
- `getPublicUrl(path)`: Obtener URL pública
- `loading`: Estado de carga
- `error`: Error de almacenamiento

## Mejores Prácticas

1. **Manejo de Errores**: Siempre verifica el campo `error` en las respuestas
2. **Estados de Carga**: Usa el campo `loading` para mostrar indicadores de carga
3. **Refetch**: Usa `refetch()` después de mutaciones para mantener los datos actualizados
4. **Tipos**: Usa los tipos generados de TypeScript para mayor seguridad
5. **Optimización**: Usa `useCallback` para funciones que se pasan como dependencias

## Ejemplo Completo

Revisa el archivo `src/components/examples/SupabaseExample.tsx` para ver un ejemplo completo de implementación.
