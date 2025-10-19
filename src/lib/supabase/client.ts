import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Configuración para el cliente del lado del navegador (solo base de datos)
export const createSupabaseClientInstance = (): ReturnType<typeof createSupabaseClient> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Cliente singleton para uso en componentes del cliente
export const supabase = createSupabaseClientInstance()

// Función helper para obtener el cliente en componentes del servidor
export const getSupabaseClient = () => createSupabaseClientInstance()

// Exportar createClient para compatibilidad
export const createClient = createSupabaseClientInstance
