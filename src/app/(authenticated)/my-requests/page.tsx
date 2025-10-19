'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RequestCard } from '@/components';

// Mock data
const mockRequests = [
  {
    id: '1',
    title: 'Plomería urgente',
    category: 'Plomería',
    location: 'Valencia, Carabobo',
    priceMin: 5000,
    priceMax: 10000,
    status: 'open' as const,
    offerCount: 3,
    createdAt: new Date('2025-01-16'),
  },
  {
    id: '2',
    title: 'Revisión eléctrica general',
    category: 'Electricidad',
    location: 'Valencia, Carabobo',
    priceMin: 8000,
    priceMax: 15000,
    status: 'in-progress' as const,
    offerCount: 1,
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '3',
    title: 'Limpieza profunda',
    category: 'Limpieza',
    location: 'Valencia, Carabobo',
    priceMin: 3000,
    priceMax: 5000,
    status: 'completed' as const,
    offerCount: 2,
    createdAt: new Date('2025-01-05'),
  },
];

export default function MyRequestsPage() {
  const [tab, setTab] = useState<'open' | 'in-progress' | 'completed'>('open');

  const filteredRequests = mockRequests.filter((req) => {
    if (tab === 'open') return req.status === 'open';
    if (tab === 'in-progress') return req.status === 'in-progress';
    if (tab === 'completed') return req.status === 'completed';
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Solicitudes</h1>
        <Link href="/my-requests/create">
          <Button>
            + Nueva Solicitud
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <section className="mb-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setTab('open')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'open'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Abiertas
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {mockRequests.filter((r) => r.status === 'open').length}
            </span>
          </button>
          <button
            onClick={() => setTab('in-progress')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'in-progress'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            En Curso
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {mockRequests.filter((r) => r.status === 'in-progress').length}
            </span>
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              tab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Historial
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {mockRequests.filter((r) => r.status === 'completed').length}
            </span>
          </button>
        </div>
      </section>

      {/* Requests List */}
      <section>
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                id={request.id}
                title={request.title}
                category={request.category}
                location={request.location}
                priceMin={request.priceMin}
                priceMax={request.priceMax}
                status={request.status}
                offerCount={request.offerCount}
                createdAt={request.createdAt}
                onEdit={(id) => console.log('Edit:', id)}
                onDelete={(id) => console.log('Delete:', id)}
                onViewOffers={(id) => console.log('View offers:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-900 font-semibold mb-2">No hay solicitudes</p>
            <p className="text-gray-600 mb-4">
              {tab === 'open'
                ? 'Aún no has publicado ninguna solicitud abierta.'
                : tab === 'in-progress'
                ? 'No hay solicitudes en curso.'
                : 'No hay historial de solicitudes.'}
            </p>
            {tab === 'open' && (
              <Link href="/my-requests/create">
                <Button>
                  Publicar primera solicitud
                </Button>
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
