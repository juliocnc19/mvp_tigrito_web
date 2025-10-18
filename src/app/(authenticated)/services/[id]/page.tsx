'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServiceDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const [negotiate, setNegotiate] = useState(false);
  const [priceMin, setPriceMin] = useState('5000');
  const [priceMax, setPriceMax] = useState('10000');
  const [note, setNote] = useState('');

  // Mock data - replace with API call
  const service = {
    id: params.id,
    title: 'Reparación de filtración urgente en lavadero',
    category: 'Plomería',
    description:
      'Tengo una filtración urgente en el lavadero que necesita reparación lo antes posible. Requiero que el profesional pueda emitir factura y preferiblemente que tenga seguro.',
    priceMin: 5000,
    priceMax: 10000,
    estimatedPrice: '7,500 Bs',
    rating: 4.8,
    reviewCount: 24,
    distance: 0.5,
    location: 'Valencia, Carabobo',
    urgent: true,
    tags: ['Plomería', 'Urgente', 'Requiere Factura'],
    professional: {
      id: '1',
      name: 'Juan Pérez',
      specialty: 'Plomero Profesional',
      rating: 4.8,
      reviewCount: 142,
      responseTime: '< 1 hora',
      verified: true,
    },
    createdAt: '2025-01-16',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/services" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Volver a servicios
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                <p className="text-gray-600">{service.category}</p>
              </div>
              {service.urgent && (
                <Badge className="bg-red-100 text-red-800">URGENTE</Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {service.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div>
                <p className="text-sm text-gray-600 mb-1">Precio Estimado</p>
                <p className="font-bold text-lg text-green-600">{service.estimatedPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Calificación</p>
                <p className="font-bold">⭐ {service.rating} ({service.reviewCount})</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Distancia</p>
                <p className="font-bold">{service.distance} km</p>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-3">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{service.description}</p>
          </section>

          {/* Location */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-3">Ubicación</h2>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-3">
              <span className="text-gray-500">📍 Mapa de ubicación</span>
            </div>
            <p className="text-gray-700 font-semibold">{service.location}</p>
          </section>

          {/* Professional Info */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-4">Profesional Recomendado</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{service.professional.name}</h3>
                  {service.professional.verified && (
                    <Badge className="bg-green-100 text-green-800">Verificado</Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{service.professional.specialty}</p>
                <p className="text-sm">⭐ {service.professional.rating} ({service.professional.reviewCount} reseñas) • Responde en {service.professional.responseTime}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Negotiation */}
        <div>
          <div className="bg-white rounded-lg border p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Realizar Solicitud</h2>

            {/* Negotiate Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={negotiate}
                  onChange={(e) => setNegotiate(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold">Negociar precio</span>
              </label>
            </div>

            {/* Negotiation Fields */}
            {negotiate && (
              <div className="space-y-4 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <label className="block text-sm font-semibold mb-2">Precio Mínimo (Bs)</label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Precio Máximo (Bs)</label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nota Adicional</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Comunica detalles importantes..."
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Rango propuesto:</span>
                <span className="font-semibold">
                  {negotiate ? `${priceMin} - ${priceMax} Bs` : `${service.priceMin} - ${service.priceMax} Bs`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                Realizar Solicitud
              </Button>
              <Button variant="outline" className="w-full py-2">
                Guardar para después
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <p className="font-semibold mb-1">💡 Consejo</p>
              <p>
                Al especificar tu rango de precio, aumentas las posibilidades de recibir ofertas
                dentro de tu presupuesto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
