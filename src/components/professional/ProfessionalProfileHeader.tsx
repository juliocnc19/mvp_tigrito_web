'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  CheckCircle,
  DollarSign,
  Calendar
} from 'lucide-react';

interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isIDVerified: boolean;
  balance: number;
  joinedAt: string;
  lastActive: string;
}

interface ProfessionalProfileHeaderProps {
  profile: ProfessionalProfile;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function ProfessionalProfileHeader({ 
  profile, 
  isEditing, 
  onEditToggle 
}: ProfessionalProfileHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Image and Basic Info */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-4">
          <div className="relative">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.name}
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{profile.rating}</span>
                <span className="text-gray-500">({profile.reviewCount} reseñas)</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
              {profile.isVerified && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verificado
                </Badge>
              )}
              {profile.isIDVerified && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  ID Verificado
                </Badge>
              )}
            </div>

            <p className="text-gray-600 text-sm max-w-md">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Contact Info and Stats */}
        <div className="flex-1 space-y-4">
          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Teléfono</div>
                <div className="text-sm text-gray-600">{profile.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Email</div>
                <div className="text-sm text-gray-600">{profile.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Saldo Actual</div>
                <div className="text-sm text-gray-600 font-semibold">
                  {formatPrice(profile.balance)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Miembro desde</div>
                <div className="text-sm text-gray-600">
                  {formatDate(profile.joinedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-xs text-gray-500">Trabajos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">91%</div>
              <div className="text-xs text-gray-500">Tasa de Finalización</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2h</div>
              <div className="text-xs text-gray-500">Tiempo de Respuesta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">45</div>
              <div className="text-xs text-gray-500">Clientes Recurrentes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              onClick={onEditToggle}
              variant={isEditing ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ver en Mapa
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ver Reseñas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
