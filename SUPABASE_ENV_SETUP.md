# Configuración de Variables de Entorno para Supabase (Solo Base de Datos)

## Variables Requeridas

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Supabase Configuration (Solo Base de Datos)
# Obtén estos valores de tu dashboard de Supabase: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

# URL pública de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

# Clave anónima (anon key) - segura para usar en el cliente
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clave de servicio (service role key) - opcional, solo para operaciones administrativas
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Cómo Obtener las Variables

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia los valores:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (opcional)

## Seguridad

- ✅ `NEXT_PUBLIC_*` variables son seguras para usar en el cliente
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` es opcional y solo para operaciones administrativas
- 🔒 Mantén tu archivo `.env.local` fuera del control de versiones

## Verificación

Para verificar que las variables están configuradas correctamente, puedes usar:

```typescript
// En cualquier componente del cliente
import { supabase } from '@/lib/supabase/client'

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Client:', supabase)

// Probar una consulta simple
const { data, error } = await supabase.from('tu_tabla').select('*').limit(1)
console.log('Test query:', { data, error })
```
