'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { StorageError } from '@supabase/supabase-js'

export interface UseStorageOptions {
  onSuccess?: (url: string) => void
  onError?: (error: StorageError) => void
}

export interface UseStorageReturn {
  uploadFile: (file: File, path: string) => Promise<{ url: string | null; error: StorageError | null }>
  deleteFile: (path: string) => Promise<{ error: StorageError | null }>
  getPublicUrl: (path: string) => string
  loading: boolean
  error: StorageError | null
}

export function useStorage(
  bucket: string,
  options: UseStorageOptions = {}
): UseStorageReturn {
  const { onSuccess, onError } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<StorageError | null>(null)

  const uploadFile = useCallback(async (file: File, path: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)

      if (error) {
        setError(error)
        onError?.(error)
        return { url: null, error }
      }

      const url = getPublicUrl(data.path)
      onSuccess?.(url)
      return { url, error: null }
    } catch (err) {
      const error = err as StorageError
      setError(error)
      onError?.(error)
      return { url: null, error }
    } finally {
      setLoading(false)
    }
  }, [bucket, onSuccess, onError])

  const deleteFile = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        setError(error)
        onError?.(error)
      }

      return { error }
    } catch (err) {
      const error = err as StorageError
      setError(error)
      onError?.(error)
      return { error }
    } finally {
      setLoading(false)
    }
  }, [bucket, onError])

  const getPublicUrl = useCallback((path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }, [bucket])

  return {
    uploadFile,
    deleteFile,
    getPublicUrl,
    loading,
    error,
  }
}

// Hook específico para subir imágenes de perfil
export function useProfileImageUpload(options: UseStorageOptions = {}) {
  return useStorage('avatars', options)
}

// Hook específico para subir documentos
export function useDocumentUpload(options: UseStorageOptions = {}) {
  return useStorage('documents', options)
}

// Hook específico para subir imágenes de servicios
export function useServiceImageUpload(options: UseStorageOptions = {}) {
  return useStorage('service-images', options)
}
