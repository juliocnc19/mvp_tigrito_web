import { createClient } from '@supabase/supabase-js'

// Configuración para el servidor (Server Components) - solo base de datos
export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public'
    }
  })
}

// Cliente con service role para operaciones administrativas (opcional)
export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    db: {
      schema: 'public'
    }
  })
}

// Función helper para obtener el cliente del servidor
export const getSupabaseServerClient = () => createSupabaseServerClient()

// Función helper para obtener el cliente admin
export const getSupabaseAdminClient = () => createSupabaseAdminClient()
