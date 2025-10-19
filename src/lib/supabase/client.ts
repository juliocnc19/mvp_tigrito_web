import { createClient } from '@supabase/supabase-js'

// Configuración para el cliente del lado del navegador (solo base de datos)
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    // Configuración mínima para solo base de datos
    db: {
      schema: 'public'
    }
  })
}

// Cliente singleton para uso en componentes del cliente
export const supabase = createSupabaseClient()

// Función helper para obtener el cliente en componentes del servidor
export const getSupabaseClient = () => createSupabaseClient()
