import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'

export interface UseQueryOptions<T> {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
  cacheTime?: number
}

export interface UseQueryResult<T> {
  data: T[] | null
  error: PostgrestError | null
  loading: boolean
  refetch: () => void
  isStale: boolean
}

interface GenericStringError {
  [key: string]: string
}

export function useQuery<T = any>(
  queryFn: () => Promise<{ data: T[] | null; error: PostgrestError | null }>,
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {
  const {
    enabled = true,
    refetchOnWindowFocus = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options

  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)
  const [loading, setLoading] = useState(false)
  const [isStale, setIsStale] = useState(false)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const executeQuery = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const result = await queryFn()
      
      if (result.error) {
        setError(result.error)
      } else {
        setData(result.data)
        setLastFetch(Date.now())
        setIsStale(false)
      }
    } catch (err) {
      setError(err as PostgrestError)
    } finally {
      setLoading(false)
    }
  }, [queryFn, enabled])

  const refetch = useCallback(() => {
    executeQuery()
  }, [executeQuery])

  useEffect(() => {
    if (enabled) {
      executeQuery()
    }
  }, [executeQuery, enabled])

  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => {
      const now = Date.now()
      if (now - lastFetch > staleTime) {
        setIsStale(true)
        executeQuery()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refetchOnWindowFocus, lastFetch, staleTime, executeQuery])

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      const now = Date.now()
      if (now - lastFetch > staleTime) {
        setIsStale(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [enabled, lastFetch, staleTime])

  return {
    data,
    error,
    loading,
    refetch,
    isStale,
  }
}

// Hook específico para Supabase
export function useSupabaseQuery<T = any>(
  table: string,
  select = '*',
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {

  const queryFn = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select(select)
    return { data: data as T[] | null, error }
  }, [table, select])

  return useQuery<T>(queryFn, options)
}

// Hook para queries con filtros
export function useSupabaseQueryWithFilters<T = any>(
  table: string,
  filters: Record<string, any> = {},
  select = '*',
  options: UseQueryOptions<T> = {}
): UseQueryResult<T> {

  const queryFn = useCallback(async () => {
    let query = supabase.from(table).select(select)

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    const { data, error } = await query
    return { data: data as T[] | null, error }
  }, [table, select, filters])

  return useQuery<T>(queryFn, options)
}
