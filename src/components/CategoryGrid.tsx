'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: React.ReactNode;
  count?: number;
}

interface CategoryGridProps {
  categories?: Category[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Plomería', slug: 'plomeria', count: 124 },
  { id: '2', name: 'Electricidad', slug: 'electricidad', count: 87 },
  { id: '3', name: 'Albañilería', slug: 'albanileria', count: 56 },
  { id: '4', name: 'Limpieza', slug: 'limpieza', count: 203 },
  { id: '5', name: 'Reparaciones', slug: 'reparaciones', count: 142 },
  { id: '6', name: 'Mudanzas', slug: 'mudanzas', count: 78 },
];

export function CategoryGrid({
  categories = defaultCategories,
  isLoading = false,
  columns = 4,
}: CategoryGridProps) {
  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid ${colsClass[columns]} gap-4 md:grid-cols-3 sm:grid-cols-2`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg p-6 h-28 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${colsClass[columns]} gap-4 md:grid-cols-3 sm:grid-cols-2`}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/services?category=${category.slug}`}
          className="group"
        >
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center justify-center p-6 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            <div className="text-2xl">🔧</div>
            <span className="font-semibold">{category.name}</span>
            {category.count && (
              <span className="text-xs opacity-70">({category.count})</span>
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
}
