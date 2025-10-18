'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ProfessionalCardProps {
  id: string;
  name: string;
  specialty: string;
  rating?: number;
  reviewCount?: number;
  responseTime?: string;
  distance?: number;
  image?: string;
  verified?: boolean;
}

export function ProfessionalCard({
  id,
  name,
  specialty,
  rating = 4.8,
  reviewCount = 0,
  responseTime,
  distance,
  verified,
}: ProfessionalCardProps) {
  return (
    <Link href={`/professionals/${id}`}>
      <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        {/* Avatar */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-40 w-full flex items-center justify-center relative">
          <span className="text-white text-4xl">👤</span>
          {verified && (
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              ✓
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name and Verified Badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base line-clamp-1 flex-1">{name}</h3>
            {verified && (
              <Badge variant="default" className="whitespace-nowrap text-xs">
                Verificado
              </Badge>
            )}
          </div>

          {/* Specialty */}
          <p className="text-sm text-gray-600 mb-3">{specialty}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3 text-sm">
            <span className="text-yellow-500 font-bold">{rating.toFixed(1)}</span>
            <span className="text-yellow-500">⭐</span>
            {reviewCount > 0 && (
              <span className="text-gray-600">({reviewCount})</span>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-2 border-t pt-3 text-xs text-gray-600">
            {responseTime && (
              <p className="flex justify-between">
                <span>Tiempo de respuesta:</span>
                <span className="font-semibold">{responseTime}</span>
              </p>
            )}
            {distance && (
              <p className="flex justify-between">
                <span>Distancia:</span>
                <span className="font-semibold">
                  {distance < 1 ? '< 1 km' : `${distance.toFixed(1)} km`}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
