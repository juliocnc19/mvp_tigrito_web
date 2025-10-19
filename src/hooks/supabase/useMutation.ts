'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PostgrestError } from '@supabase/supabase-js'

export interface UseMutationOptions {
  onSuccess?: (data: any) => void
  onError?: (error: PostgrestError) => void
}

export interface UseMutationReturn<TData, TVariables> {
  data: TData | null
  loading: boolean
  error: PostgrestError | null
  mutate: (variables: TVariables) => Promise<{ data: TData | null; error: PostgrestError | null }>
  reset: () => void
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ data: TData | null; error: PostgrestError | null }>,
  options: UseMutationOptions = {}
): UseMutationReturn<TData, TVariables> {
  const { onSuccess, onError } = options

  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      
      if (result.error) {
        setError(result.error)
        onError?.(result.error)
      } else {
        setData(result.data)
        onSuccess?.(result.data)
      }

      return result
    } catch (err) {
      const error = err as PostgrestError
      setError(error)
      onError?.(error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }, [mutationFn, onSuccess, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  }
}

// Hook específico para insertar datos
export function useInsert<TData>(
  table: string,
  options: UseMutationOptions = {}
) {
  const mutationFn = useCallback(async (data: Partial<TData>) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }, [table])

  return useMutation<TData, Partial<TData>>(mutationFn, options)
}

// Hook específico para actualizar datos
export function useUpdate<TData>(
  table: string,
  options: UseMutationOptions = {}
) {
  const mutationFn = useCallback(async ({ id, ...data }: Partial<TData> & { id: string }) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    return { data: result, error }
  }, [table])

  return useMutation<TData, Partial<TData> & { id: string }>(mutationFn, options)
}

// Hook específico para eliminar datos
export function useDelete(
  table: string,
  options: UseMutationOptions = {}
) {
  const mutationFn = useCallback(async ({ id }: { id: string }) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    return { data, error }
  }, [table])

  return useMutation<null, { id: string }>(mutationFn, options)
}

// Hook para operaciones en lote
export function useBatchInsert<TData>(
  table: string,
  options: UseMutationOptions = {}
) {
  const mutationFn = useCallback(async (data: Partial<TData>[]) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()

    return { data: result, error }
  }, [table])

  return useMutation<TData[], Partial<TData>[]>(mutationFn, options)
}
