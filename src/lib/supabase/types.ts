import { Database } from './database.types'

// Re-export Database for use in other files
export type { Database }

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Auth types (usando la tabla users que existe en el esquema)
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// Para las tablas que no existen en el esquema actual, usar tipos genéricos
export type Profile = {
  id: string
  user_id: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type Service = {
  id: string
  title: string
  description?: string
  price: number
  created_at: string
  updated_at: string
}

export type Professional = {
  id: string
  user_id: string
  profession?: string
  experience_years?: number
  created_at: string
  updated_at: string
}

// Insert types
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type ServiceInsert = Omit<Service, 'id' | 'created_at' | 'updated_at'>
export type ProfessionalInsert = Omit<Professional, 'id' | 'created_at' | 'updated_at'>

// Update types
export type ProfileUpdate = Partial<ProfileInsert>
export type ServiceUpdate = Partial<ServiceInsert>
export type ProfessionalUpdate = Partial<ProfessionalInsert>

// Response types
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  message?: string
}

// Pagination types
export type PaginationParams = {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
