'use client';

import React from 'react';
import { BalanceCard, CategoryGrid, ServiceCard, ProfessionalCard } from '@/components';

// Mock data - replace with actual API calls
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
];

export default function DashboardPage() {
  const userBalance = 15000;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Bienvenido a UnTigrito</h1>
        <p className="text-gray-600">Encuentra los mejores servicios profesionales</p>
      </div>

      {/* Balance Section */}
      <section>
        <BalanceCard balance={userBalance} />
      </section>

      {/* Promotional Banners */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-2">Ofertas Especiales</h2>
        <p>Obtén descuentos en tus primeras 5 solicitudes</p>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Explorar Categorías</h2>
        <CategoryGrid columns={4} />
      </section>

      {/* Top Professionals Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Tigres Mejor Calificados</h2>
          <a href="/services?tab=professionals" className="text-blue-600 hover:underline text-sm">
            Ver más →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </section>

      {/* Recent Services Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Servicios Disponibles</h2>
          <a href="/services" className="text-blue-600 hover:underline text-sm">
            Ver más →
          </a>
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
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-2">¿Necesitas un servicio?</h3>
        <p className="text-gray-700 mb-4">
          Publica tu solicitud y recibe ofertas de profesionales verificados en minutos.
        </p>
        <a
          href="/my-requests/create"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Publicar Solicitud
        </a>
      </section>
    </div>
  );
}
