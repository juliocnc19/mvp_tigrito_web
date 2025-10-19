import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface UseStorageOptions {
  bucket: string
  path?: string
}

export interface UseStorageResult {
  uploadFile: (file: File, fileName?: string) => Promise<{ data: any; error: any }>
  downloadFile: (path: string) => Promise<{ data: Blob | null; error: any }>
  deleteFile: (path: string) => Promise<{ data: any; error: any }>
  getPublicUrl: (path: string) => string
  loading: boolean
  error: string | null
}

export function useStorage(options: UseStorageOptions): UseStorageResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File, fileName?: string) => {
    setLoading(true)
    setError(null)

    try {
      const filePath = fileName || `${options.path || ''}/${file.name}`
      
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file)

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      return { data: null, error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }, [supabase, options.bucket, options.path])

  const downloadFile = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .download(path)

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed'
      setError(errorMessage)
      return { data: null, error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }, [supabase, options.bucket])

  const deleteFile = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .remove([path])

      if (error) {
        setError(error.message)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed'
      setError(errorMessage)
      return { data: null, error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }, [supabase, options.bucket])

  const getPublicUrl = useCallback((path: string) => {
    const { data } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(path)

    return data.publicUrl
  }, [supabase, options.bucket])

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    getPublicUrl,
    loading,
    error,
  }
}
