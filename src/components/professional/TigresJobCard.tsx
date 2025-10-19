'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Calendar,
  Play,
  CheckCircle,
  X,
  MessageCircle,
  Star,
  AlertCircle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  location: string;
  price: number;
  scheduledDate: string;
  status: string;
  description: string;
  category: string;
  urgent: boolean;
  createdAt: string;
  startedAt?: string;
  estimatedCompletion?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
}

interface TigresJobCardProps {
  job: Job;
  onAccept: () => void;
  onReject: () => void;
  onStart: () => void;
  onComplete: () => void;
  onContact: () => void;
}

export function TigresJobCard({ 
  job, 
  onAccept, 
  onReject, 
  onStart, 
  onComplete, 
  onContact 
}: TigresJobCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-VE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING_SOLICITUD':
        return {
          label: 'Solicitud Pendiente',
          color: 'bg-blue-100 text-blue-800',
          icon: AlertCircle
        };
      case 'SCHEDULED':
        return {
          label: 'Agendado',
          color: 'bg-purple-100 text-purple-800',
          icon: Calendar
        };
      case 'IN_PROGRESS':
        return {
          label: 'En Progreso',
          color: 'bg-orange-100 text-orange-800',
          icon: Play
        };
      case 'COMPLETED':
        return {
          label: 'Completado',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      default:
        return {
          label: 'Desconocido',
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusInfo(job.status);
  const StatusIcon = statusInfo.icon;

  const getActionButtons = () => {
    switch (job.status) {
      case 'PENDING_SOLICITUD':
        return (
          <div className="flex gap-2">
            <Button
              onClick={onReject}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Rechazar
            </Button>
            <Button
              onClick={onAccept}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Aceptar
            </Button>
          </div>
        );
      case 'SCHEDULED':
        return (
          <div className="flex gap-2">
            <Button
              onClick={onContact}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contactar
            </Button>
            <Button
              onClick={onStart}
              size="sm"
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          </div>
        );
      case 'IN_PROGRESS':
        return (
          <div className="flex gap-2">
            <Button
              onClick={onContact}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contactar
            </Button>
            <Button
              onClick={onComplete}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Completar
            </Button>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="text-center text-sm text-gray-600">
            {job.rating && (
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{job.rating}/5</span>
              </div>
            )}
            {job.review && (
              <p className="text-xs italic">"{job.review}"</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {job.title}
              </h3>
              {job.urgent && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Urgente
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {job.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDate(job.scheduledDate)}
              </span>
            </div>
          </div>
          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Client Info and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm">{job.clientName}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="h-3 w-3" />
                  {job.clientPhone}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">
                {formatPrice(job.price)}
              </div>
              <div className="text-xs text-gray-500">Pago acordado</div>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline">{job.category}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Ocultar' : 'Ver'} detalles
            </Button>
          </div>

          {/* Additional Details */}
          {showDetails && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div>
                <span className="font-medium">Fecha de creación:</span> {formatDate(job.createdAt)}
              </div>
              {job.startedAt && (
                <div>
                  <span className="font-medium">Iniciado:</span> {formatDate(job.startedAt)}
                </div>
              )}
              {job.estimatedCompletion && (
                <div>
                  <span className="font-medium">Estimado de finalización:</span> {formatDate(job.estimatedCompletion)}
                </div>
              )}
              {job.completedAt && (
                <div>
                  <span className="font-medium">Completado:</span> {formatDate(job.completedAt)}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {getActionButtons()}
        </div>
      </CardContent>
    </Card>
  );
}
