'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useProfessions } from '@/hooks';
import { Wrench } from 'lucide-react';

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

export function CategoryGrid({
  categories,
  isLoading: externalLoading = false,
  columns = 4,
}: CategoryGridProps) {
  const { data: professionsData, isLoading: professionsLoading } = useProfessions({ limit: 20 });
  
  // Use external loading state or professions loading state
  const isLoading = externalLoading || professionsLoading;
  
  // Use provided categories or map from professions data
  const displayCategories = categories || professionsData?.data?.map(profession => ({
    id: profession.id,
    name: profession.name,
    slug: profession.slug,
    count: 0, // We don't have count data from professions endpoint
  })) || [];
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
      {displayCategories.map((category) => (
        <Link
          key={category.id}
          href={`/services?category=${category.slug}`}
          className="group"
        >
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center justify-center p-6 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            <Wrench className="w-8 h-8 text-gray-600" />
            <span className="font-semibold">{category.name}</span>
            
          </Button>
        </Link>
      ))}
    </div>
  );
}
