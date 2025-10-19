'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'

export interface UseQueryOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
}

export interface UseQueryReturn<T> {
  data: T | null
  loading: boolean
  error: PostgrestError | null
  refetch: () => Promise<void>
}

export function useQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options: UseQueryOptions = {}
): UseQueryReturn<T> {
  const {
    enabled = true,
    refetchOnWindowFocus = true,
    staleTime = 0,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

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
      }
    } catch (err) {
      setError(err as PostgrestError)
    } finally {
      setLoading(false)
    }
  }, [queryFn, enabled])

  useEffect(() => {
    executeQuery()
  }, [executeQuery])

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return

    const handleFocus = () => {
      if (staleTime === 0) {
        executeQuery()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [executeQuery, refetchOnWindowFocus, staleTime])

  return {
    data,
    loading,
    error,
    refetch: executeQuery,
  }
}

// Hook específico para consultas de Supabase
export function useSupabaseQuery<T>(
  table: string,
  select = '*',
  options: UseQueryOptions = {}
) {
  const queryFn = useCallback(async () => {
    const { data, error } = await supabase
      .from(table)
      .select(select)
    
    return { data, error }
  }, [table, select])

  return useQuery<T[]>(queryFn, options)
}

// Hook para consultas con filtros
export function useSupabaseQueryWithFilters<T>(
  table: string,
  filters: Record<string, any> = {},
  select = '*',
  options: UseQueryOptions = {}
) {
  const queryFn = useCallback(async () => {
    let query = supabase.from(table).select(select)

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })

    const { data, error } = await query
    
    return { data, error }
  }, [table, select, filters])

  return useQuery<T[]>(queryFn, options)
}
