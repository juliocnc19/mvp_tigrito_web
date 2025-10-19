'use client';

import React, { useState } from 'react';
import { ProfessionalPostingCard } from '@/components/professional/ProfessionalPostingCard';
// import { ProfessionalFilters } from '@/components/professional/ProfessionalFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, Clock, DollarSign } from 'lucide-react';

// Mock data - replace with actual API calls
const mockPostings = [
  {
    id: '1',
    title: 'Reparación de fuga en lavadero',
    description: 'Fuga constante en la tubería del lavadero, necesita reparación urgente',
    category: 'Plomería',
    location: 'Caracas, Distrito Capital',
    distance: 2.5,
    priceMin: 5000,
    priceMax: 10000,
    requiredFrom: '2024-01-15T09:00:00Z',
    requiredTo: '2024-01-15T18:00:00Z',
    urgent: true,
    clientName: 'María González',
    clientRating: 4.8,
    offersCount: 3,
    createdAt: '2024-01-14T10:30:00Z',
    media: ['/images/plumbing1.jpg', '/images/plumbing2.jpg']
  },
  {
    id: '2',
    title: 'Instalación de ventilador de techo',
    description: 'Necesito instalar un ventilador de techo en la sala principal',
    category: 'Electricidad',
    location: 'Valencia, Carabobo',
    distance: 5.2,
    priceMin: 15000,
    priceMax: 25000,
    requiredFrom: '2024-01-16T08:00:00Z',
    requiredTo: '2024-01-16T16:00:00Z',
    urgent: false,
    clientName: 'Carlos Rodríguez',
    clientRating: 4.6,
    offersCount: 1,
    createdAt: '2024-01-14T08:15:00Z',
    media: ['/images/electrical1.jpg']
  },
  {
    id: '3',
    title: 'Limpieza profunda de oficina',
    description: 'Limpieza completa de oficina de 200m², incluyendo ventanas y alfombras',
    category: 'Limpieza',
    location: 'Maracay, Aragua',
    distance: 8.1,
    priceMin: 8000,
    priceMax: 12000,
    requiredFrom: '2024-01-17T07:00:00Z',
    requiredTo: '2024-01-17T15:00:00Z',
    urgent: false,
    clientName: 'Ana Martínez',
    clientRating: 4.9,
    offersCount: 5,
    createdAt: '2024-01-13T16:45:00Z',
    media: []
  }
];

export default function ProfessionalPostingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const filteredPostings = mockPostings.filter(posting => {
    const matchesSearch = posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         posting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || posting.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publicaciones Disponibles</h1>
          <p className="text-gray-600">Encuentra trabajos en tu área y comienza a ganar</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredPostings.length} publicaciones encontradas
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todas las categorías</option>
            <option value="Plomería">Plomería</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Albañilería">Albañilería</option>
            <option value="Reparaciones">Reparaciones</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="distance">Más cercanos</option>
            <option value="price">Mayor precio</option>
            <option value="urgent">Más urgentes</option>
            <option value="recent">Más recientes</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Radio de búsqueda: 10 km</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Última actualización: hace 5 min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>Precio promedio: $12,500</span>
          </div>
        </div>
      </div>

      {/* Postings List */}
      <div className="space-y-4">
        {filteredPostings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron publicaciones</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          filteredPostings.map((posting) => (
            <ProfessionalPostingCard
              key={posting.id}
              posting={posting}
              onOffer={() => console.log('Ofertar en:', posting.id)}
              onViewDetails={() => console.log('Ver detalles:', posting.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
