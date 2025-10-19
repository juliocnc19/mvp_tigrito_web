'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Image,
  Star,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Upload,
  AlertCircle
} from 'lucide-react';
import { useProfessionalPortfolio, useCreateProfessionalPortfolio, useDeleteProfessionalPortfolio, useUploadPortfolioFiles } from '@/hooks/services/useProfessionals';
import { useAuth } from '@/hooks/useAuth';

export function ProfessionalPortfolio() {
  const { user } = useAuth();
  const { data: portfolio, isLoading, error } = useProfessionalPortfolio(user?.id || '');
  const deletePortfolioMutation = useDeleteProfessionalPortfolio();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'Plomería', 'Electricidad', 'Limpieza', 'Albañilería', 'Pintura'];

  const filteredPortfolio = portfolio?.filter((item: any) =>
    selectedCategory === 'all' || item.category === selectedCategory
  ) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDeletePortfolio = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este trabajo del portafolio?')) {
      try {
        await deletePortfolioMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting portfolio item:', error);
        alert('Error al eliminar el trabajo del portafolio');
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full rounded-lg mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-24 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error al cargar el portafolio. Por favor, intenta de nuevo más tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Mi Portafolio</h2>
            <p className="text-gray-600">Muestra tu mejor trabajo a los clientes</p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => alert('Funcionalidad de agregar trabajo próximamente')}
          >
            <Plus className="h-4 w-4" />
            Agregar Trabajo
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Todas' : category}
            </Button>
          ))}
        </div>

        {/* Portfolio List */}
        <div className="space-y-4">
          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📸</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay trabajos en tu portafolio
              </h3>
              <p className="text-gray-500 mb-4">
                Agrega trabajos completados para mostrar tu experiencia
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Trabajo
              </Button>
            </div>
          ) : (
            filteredPortfolio.map((item: any) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Image className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleDeletePortfolio(item.id)}
                            disabled={deletePortfolioMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.completionDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {item.clientRating}/5
                        </span>
                      </div>

                      {item.clientReview && (
                        <div className="text-sm text-gray-600 italic">
                          "{item.clientReview}"
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Mi Portafolio</h2>
          <p className="text-gray-600">Muestra tu mejor trabajo a los clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Funcionalidad de subir imágenes próximamente')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir Imágenes
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => alert('Funcionalidad de agregar trabajo próximamente')}
          >
            <Plus className="h-4 w-4" />
            Agregar Trabajo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Todas' : category}
          </Button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolio.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay trabajos en tu portafolio
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega trabajos completados para mostrar tu experiencia
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Trabajo
            </Button>
          </div>
        ) : (
          filteredPortfolio.map((item: any) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  {item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Image className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.clientRating}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Completado: {formatDate(item.completionDate)}
                  </div>

                  {item.clientReview && (
                    <div className="text-sm text-gray-600 italic line-clamp-2">
                      "{item.clientReview}"
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
