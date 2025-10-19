'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Package, Star } from 'lucide-react';

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
      <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
        {/* Image Placeholder */}
        <div className="bg-gradient-to-br from-[var(--color-skeleton-gradient-from)] to-[var(--color-skeleton-gradient-to)] h-40 w-full flex items-center justify-center">
          <Package className="w-12 h-12 text-muted-foreground" />
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
          <p className="text-sm text-[var(--color-neutral-text-secondary)] mb-2">{category}</p>

          {/* Description */}
          {description && (
            <p className="text-xs text-[var(--color-neutral-text-tertiary)] line-clamp-2 mb-3">{description}</p>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 mb-3 text-xs">
            <Star className="w-4 h-4 fill-[var(--color-warning-badge)] text-[var(--color-warning-badge)]" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-[var(--color-neutral-text-secondary)]">({reviewCount} reseñas)</span>
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
              <p className="text-xs text-[var(--color-neutral-text-secondary)]">
                {distance < 1 ? '< 1 km' : `${distance.toFixed(1)} km`}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
