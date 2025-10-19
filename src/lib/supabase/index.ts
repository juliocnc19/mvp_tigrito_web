// Clientes de Supabase
export { supabase, createClient, getSupabaseClient } from './client'
export { 
  createSupabaseServerClient, 
  createSupabaseAdminClient, 
  getSupabaseServerClient, 
  getSupabaseAdminClient 
} from './server'

// Tipos
export * from './types'

// Utilidades
export * from './utils'

// Re-exportar hooks para conveniencia
export * from '../../hooks/supabase'
