'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';

interface ServiceLocation {
  lat: number;
  lng: number;
  address: string;
}

interface ProfessionalService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  serviceLocations: ServiceLocation[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  media: string[];
  bookingsCount: number;
  rating: number;
  earnings: number;
}

interface ProfessionalServiceCardProps {
  service: ProfessionalService;
  viewMode: 'grid' | 'list';
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onViewStats: () => void;
}

export function ProfessionalServiceCard({ 
  service, 
  viewMode,
  onEdit, 
  onToggleActive, 
  onDelete, 
  onViewStats 
}: ProfessionalServiceCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              {/* Service Image */}
              <div className="w-16 h-16 bg-[var(--color-skeleton)] rounded-lg flex items-center justify-center">
                {service.media.length > 0 ? (
                  <img 
                    src={service.media[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-muted-foreground text-2xl">🔧</div>
                )}
              </div>

              {/* Service Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-[var(--color-neutral-text)]">
                    {service.title}
                  </h3>
                  <Badge variant={service.isActive ? 'default' : 'secondary'}>
                    {service.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--color-neutral-text-secondary)] line-clamp-1 mb-2">
                  {service.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {service.serviceLocations.length} ubicación(es)
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(service.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {service.bookingsCount} reservas
                  </span>
                </div>
              </div>

              {/* Price and Stats */}
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600 mb-1">
                  {formatPrice(service.price)}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating}</span>
                </div>
                <div className="text-xs text-gray-500">
                  ${service.earnings.toLocaleString()} ganado
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewStats}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleActive}
              >
                {service.isActive ? (
                  <PowerOff className="h-4 w-4" />
                ) : (
                  <Power className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Additional Details */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="text-sm">
                <span className="font-medium">Categoría:</span> {service.category}
              </div>
              <div className="text-sm">
                <span className="font-medium">Ubicaciones de servicio:</span>
                <ul className="mt-1 space-y-1">
                  {service.serviceLocations.map((location, index) => (
                    <li key={index} className="text-gray-600">
                      • {location.address}
                    </li>
                  ))}
                </ul>
              </div>
              {service.media.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Imágenes:</span> {service.media.length} foto(s)
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {service.title}
              </h3>
              <Badge variant={service.isActive ? 'default' : 'secondary'}>
                {service.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {service.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {service.serviceLocations.length} ubicación(es)
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {service.bookingsCount} reservas
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Service Image */}
          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            {service.media.length > 0 ? (
              <img 
                src={service.media[0]} 
                alt={service.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-4xl">🔧</div>
            )}
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-green-600">
              {formatPrice(service.price)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{service.rating}</span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline">{service.category}</Badge>
            <span className="text-xs text-gray-500">
              Creado: {formatDate(service.createdAt)}
            </span>
          </div>

          {/* Earnings */}
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-800">
              ${service.earnings.toLocaleString()} ganado
            </div>
            <div className="text-xs text-green-600">
              {service.bookingsCount} reservas completadas
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewStats}
              className="flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              Stats
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={service.isActive ? "destructive" : "default"}
              size="sm"
              onClick={onToggleActive}
              className="flex items-center gap-1"
            >
              {service.isActive ? (
                <>
                  <PowerOff className="h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <Power className="h-4 w-4" />
                  Activar
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
