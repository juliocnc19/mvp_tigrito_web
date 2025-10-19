'use client';

import React, { useState } from 'react';
import { SearchBar, CategoryGrid, ServiceCard, ProfessionalCard } from '@/components';
import { Star } from 'lucide-react';

// Mock data
const mockServices = [
  {
    id: '1',
    title: 'Reparación de fugas urgente',
    category: 'Plomería',
    description: 'Fuga en lavadero',
    priceMin: 5000,
    priceMax: 10000,
    rating: 4.8,
    reviewCount: 24,
    distance: 0.5,
    urgent: true,
  },
  {
    id: '2',
    title: 'Revisión eléctrica general',
    category: 'Electricidad',
    description: 'Inspección completa',
    priceMin: 8000,
    priceMax: 15000,
    rating: 4.6,
    reviewCount: 18,
    distance: 1.2,
    urgent: false,
  },
  {
    id: '3',
    title: 'Limpieza profunda',
    category: 'Limpieza',
    description: 'Casa completa',
    priceMin: 3000,
    priceMax: 5000,
    rating: 4.9,
    reviewCount: 67,
    distance: 2.1,
    urgent: false,
  },
];

const mockProfessionals = [
  {
    id: '1',
    name: 'Juan Pérez',
    specialty: 'Electricista',
    rating: 4.9,
    reviewCount: 142,
    responseTime: '< 1 hora',
    distance: 0.8,
    verified: true,
  },
  {
    id: '2',
    name: 'María García',
    specialty: 'Plomera',
    rating: 4.7,
    reviewCount: 89,
    responseTime: '2 horas',
    distance: 1.5,
    verified: true,
  },
  {
    id: '3',
    name: 'Carlos López',
    specialty: 'Electricista',
    rating: 4.8,
    reviewCount: 156,
    responseTime: '1 hora',
    distance: 0.3,
    verified: true,
  },
];

export default function ServicesPage() {
  const [tab, setTab] = useState<'services' | 'professionals'>('services');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Servicios y Profesionales</h1>

      {/* Search Bar */}
      <section className="mb-6">
        <SearchBar
          placeholder="Buscar servicios o profesionales..."
          onSearch={setSearchQuery}
        />
      </section>

      {/* Category Filters */}
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por categoría</h3>
        <CategoryGrid columns={2} />
      </section>

      {/* Tabs */}
      <section className="mb-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setTab('services')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              tab === 'services'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setTab('professionals')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              tab === 'professionals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profesionales ({mockProfessionals.length})
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {tab === 'services' ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {mockServices.length} servicios disponibles
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    category={service.category}
                    description={service.description}
                    priceMin={service.priceMin}
                    priceMax={service.priceMax}
                    rating={service.rating}
                    reviewCount={service.reviewCount}
                    distance={service.distance}
                    urgent={service.urgent}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {mockProfessionals.length} profesionales disponibles
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProfessionals.map((professional) => (
                  <ProfessionalCard
                    key={professional.id}
                    id={professional.id}
                    name={professional.name}
                    specialty={professional.specialty}
                    rating={professional.rating}
                    reviewCount={professional.reviewCount}
                    responseTime={professional.responseTime}
                    distance={professional.distance}
                    verified={professional.verified}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Filtros</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Rango de Precio</label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>0 Bs</span>
                  <span>50,000 Bs</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Calificación</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="all">Todas</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.0">4.0+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Distancia</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option>Cualquiera</option>
                  <option>Hasta 1 km</option>
                  <option>Hasta 5 km</option>
                  <option>Hasta 10 km</option>
                </select>
              </div>

              <button className="w-full px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
