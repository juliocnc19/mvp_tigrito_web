'use client'

import React from 'react'
import { useSupabaseQuery, useInsert, useUpdate } from '@/hooks/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Componente de ejemplo que muestra cómo usar los hooks de Supabase
 * Este componente demuestra:
 * - Consultas a la base de datos
 * - Mutaciones (insert/update)
 * - Almacenamiento de archivos
 */
export function SupabaseExample() {
  // Hook para consultar datos
  const { data: profiles, loading: profilesLoading, refetch } = useSupabaseQuery(
    'profiles',
    'id, email, created_at'
  )

  // Hook para insertar datos
  const { mutate: insertProfile, loading: insertLoading } = useInsert('profiles', {
    onSuccess: () => {
      refetch() // Recargar datos después de insertar
    }
  })

  // Hook para actualizar datos
  const { mutate: updateProfile, loading: updateLoading } = useUpdate('profiles', {
    onSuccess: () => {
      refetch() // Recargar datos después de actualizar
    }
  })

  const handleInsertProfile = async () => {
    await insertProfile({
      email: 'newuser@example.com',
      // Agrega otros campos según tu esquema
    })
  }

  const handleUpdateProfile = async () => {
    if (profiles && profiles.length > 0) {
      await updateProfile({
        id: profiles[0].id,
        email: 'updated@example.com',
        // Agrega otros campos según tu esquema
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de Supabase - Consultas de Base de Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profilesLoading ? (
            <p>Cargando perfiles...</p>
          ) : (
            <div>
              <p>Perfiles encontrados: {profiles?.length || 0}</p>
              <div className="space-y-2">
                {profiles?.map((profile: any) => (
                  <div key={profile.id} className="p-2 border rounded">
                    <p>ID: {profile.id}</p>
                    <p>Email: {profile.email}</p>
                    <p>Creado: {new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de Supabase - Mutaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button 
              onClick={handleInsertProfile} 
              disabled={insertLoading}
            >
              {insertLoading ? 'Insertando...' : 'Insertar Perfil'}
            </Button>
            
            <Button 
              onClick={handleUpdateProfile} 
              disabled={updateLoading || !profiles?.length}
              variant="outline"
            >
              {updateLoading ? 'Actualizando...' : 'Actualizar Primer Perfil'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
