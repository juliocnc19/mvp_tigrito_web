'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  description?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  reviewCount?: number;
  distance?: number;
  image?: string;
  urgent?: boolean;
}

export function ServiceCard({
  id,
  title,
  category,
  description,
  priceMin,
  priceMax,
  rating = 4.5,
  reviewCount = 0,
  distance,
  urgent,
}: ServiceCardProps) {
  return (
    <Link href={`/services/${id}`}>
      <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        {/* Image Placeholder */}
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-40 w-full flex items-center justify-center">
          <span className="text-gray-400 text-3xl">📦</span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Urgent Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-base line-clamp-2 flex-1">{title}</h3>
            {urgent && (
              <Badge variant="destructive" className="whitespace-nowrap text-xs">
                Urgente
              </Badge>
            )}
          </div>

          {/* Category */}
          <p className="text-sm text-gray-600 mb-2">{category}</p>

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{description}</p>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 mb-3 text-xs">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">{rating.toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-gray-600">({reviewCount} reseñas)</span>
            )}
          </div>

          {/* Price and Distance */}
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              {priceMin && priceMax ? (
                <p className="text-sm font-semibold">
                  {priceMin.toLocaleString('es-VE')} - {priceMax.toLocaleString('es-VE')} Bs
                </p>
              ) : priceMin ? (
                <p className="text-sm font-semibold">
                  Desde {priceMin.toLocaleString('es-VE')} Bs
                </p>
              ) : null}
            </div>
            {distance && (
              <p className="text-xs text-gray-600">
                {distance < 1 ? '< 1 km' : `${distance.toFixed(1)} km`}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
