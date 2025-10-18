'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RequestCardProps {
  id: string;
  title: string;
  category: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  offerCount?: number;
  createdAt?: Date;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewOffers?: (id: string) => void;
}

const statusConfig = {
  open: { label: 'Abierta', color: 'bg-blue-100 text-blue-800' },
  'in-progress': { label: 'En Curso', color: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completada', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
};

export function RequestCard({
  id,
  title,
  category,
  location,
  priceMin,
  priceMax,
  status,
  offerCount = 0,
  createdAt,
  onEdit,
  onDelete,
  onViewOffers,
}: RequestCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <Link href={`/my-requests/${id}`} className="hover:underline">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
          </Link>
          <p className="text-sm text-gray-600 mb-2">{category}</p>
          {location && <p className="text-xs text-gray-500">📍 {location}</p>}
        </div>
        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y mb-4 text-sm">
        <div>
          <p className="text-gray-600">Presupuesto</p>
          {priceMin && priceMax ? (
            <p className="font-semibold">
              {priceMin.toLocaleString('es-VE')} - {priceMax.toLocaleString('es-VE')} Bs
            </p>
          ) : (
            <p className="text-gray-500">No especificado</p>
          )}
        </div>
        <div>
          <p className="text-gray-600">Publicado</p>
          <p className="font-semibold">
            {createdAt
              ? new Date(createdAt).toLocaleDateString('es-VE', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Hoy'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          {status === 'open' && offerCount > 0 && (
            <p className="font-semibold text-blue-600">
              {offerCount} {offerCount === 1 ? 'oferta' : 'ofertas'}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {status === 'open' && offerCount > 0 && onViewOffers && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onViewOffers(id)}
            >
              Ver ofertas
            </Button>
          )}
          {status === 'open' && onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(id)}
            >
              Editar
            </Button>
          )}
          {status === 'open' && onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
