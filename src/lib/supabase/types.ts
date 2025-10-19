import { Database } from './database.types'

// Re-exportar los tipos de la base de datos
export type { Database }

// Tipos de utilidad para trabajar con Supabase
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]

// Tipos para las tablas más comunes
export type User = Tables<'users'>
export type Profile = Tables<'profiles'>
export type Service = Tables<'services'>
export type Professional = Tables<'professionals'>

// Tipos para las respuestas de Supabase
export type SupabaseResponse<T> = {
  data: T | null
  error: Error | null
}

// Tipos para los hooks de React Query
export type QueryKey = readonly unknown[]
export type QueryFunction<T = unknown> = () => Promise<T>
