import { supabase } from './client'
import { Database } from './types'

// Utilidades para trabajar con Supabase (solo base de datos)

/**
 * Sube un archivo al storage de Supabase
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  return { data, error }
}

/**
 * Obtiene la URL pública de un archivo
 */
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Elimina un archivo del storage
 */
export async function deleteFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path])

  return { data, error }
}

/**
 * Realiza una consulta con filtros dinámicos
 */
export async function queryWithFilters<T>(
  table: string,
  filters: Record<string, any> = {},
  select = '*'
) {
  let query = supabase.from(table).select(select)

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        query = query.in(key, value)
      } else if (typeof value === 'string' && value.includes('%')) {
        query = query.like(key, value)
      } else {
        query = query.eq(key, value)
      }
    }
  })

  return query
}

/**
 * Realiza una búsqueda de texto completo
 */
export async function searchText(
  table: string,
  column: string,
  searchTerm: string,
  select = '*'
) {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .textSearch(column, searchTerm)

  return { data, error }
}

/**
 * Obtiene datos con paginación
 */
export async function getPaginatedData<T>(
  table: string,
  page: number = 1,
  pageSize: number = 10,
  select = '*',
  filters: Record<string, any> = {}
) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from(table)
    .select(select, { count: 'exact' })
    .range(from, to)

  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query = query.eq(key, value)
    }
  })

  const { data, error, count } = await query

  return {
    data,
    error,
    count,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
    currentPage: page,
    pageSize
  }
}

/**
 * Maneja errores de Supabase de forma consistente
 */
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }

  return 'Ha ocurrido un error inesperado'
}

/**
 * Formatea fechas para Supabase
 */
export function formatDateForSupabase(date: Date): string {
  return date.toISOString()
}

/**
 * Convierte una fecha de Supabase a Date
 */
export function parseSupabaseDate(dateString: string): Date {
  return new Date(dateString)
}
