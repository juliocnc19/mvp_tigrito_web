'use client';

import React, { useState } from 'react';
import { TigresTabNavigation } from '@/components/professional/TigresTabNavigation';
import { TigresJobCard } from '@/components/professional/TigresJobCard';
import { TigresCalendar } from '@/components/professional/TigresCalendar';
import { Button } from '@/components/ui/button';
import { Calendar, List, Plus } from 'lucide-react';

// Mock data for different job statuses
const mockJobs = {
  solicitud: [
    {
      id: '1',
      title: 'Reparación de fuga en lavadero',
      clientName: 'María González',
      clientPhone: '+58 412 123 4567',
      location: 'Caracas, Distrito Capital',
      price: 7500,
      scheduledDate: '2024-01-15T09:00:00Z',
      status: 'PENDING_SOLICITUD',
      description: 'Fuga constante en la tubería del lavadero',
      category: 'Plomería',
      urgent: true,
      createdAt: '2024-01-14T10:30:00Z'
    }
  ],
  pendientes: [
    {
      id: '2',
      title: 'Instalación de ventilador de techo',
      clientName: 'Carlos Rodríguez',
      clientPhone: '+58 414 987 6543',
      location: 'Valencia, Carabobo',
      price: 20000,
      scheduledDate: '2024-01-16T08:00:00Z',
      status: 'SCHEDULED',
      description: 'Instalación de ventilador en sala principal',
      category: 'Electricidad',
      urgent: false,
      createdAt: '2024-01-14T08:15:00Z'
    }
  ],
  agendados: [
    {
      id: '3',
      title: 'Limpieza profunda de oficina',
      clientName: 'Ana Martínez',
      clientPhone: '+58 416 555 1234',
      location: 'Maracay, Aragua',
      price: 10000,
      scheduledDate: '2024-01-17T07:00:00Z',
      status: 'SCHEDULED',
      description: 'Limpieza completa de oficina de 200m²',
      category: 'Limpieza',
      urgent: false,
      createdAt: '2024-01-13T16:45:00Z'
    }
  ],
  en_progreso: [
    {
      id: '4',
      title: 'Reparación de grifo de cocina',
      clientName: 'Luis Fernández',
      clientPhone: '+58 424 777 8888',
      location: 'Barquisimeto, Lara',
      price: 8500,
      scheduledDate: '2024-01-14T14:00:00Z',
      status: 'IN_PROGRESS',
      description: 'Cambio de grifo y reparación de conexiones',
      category: 'Plomería',
      urgent: false,
      createdAt: '2024-01-14T10:00:00Z',
      startedAt: '2024-01-14T14:30:00Z',
      estimatedCompletion: '2024-01-14T16:00:00Z'
    }
  ],
  completados: [
    {
      id: '5',
      title: 'Pintura de habitación',
      clientName: 'Carmen Silva',
      clientPhone: '+58 426 333 4444',
      location: 'Mérida, Mérida',
      price: 12000,
      scheduledDate: '2024-01-12T10:00:00Z',
      status: 'COMPLETED',
      description: 'Pintura completa de habitación principal',
      category: 'Pintura',
      urgent: false,
      createdAt: '2024-01-11T08:00:00Z',
      completedAt: '2024-01-12T15:30:00Z',
      rating: 5,
      review: 'Excelente trabajo, muy profesional'
    }
  ]
};

export default function TigresPage() {
  const [activeTab, setActiveTab] = useState('solicitud');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const getJobsForTab = (tab: string) => {
    switch (tab) {
      case 'solicitud':
        return mockJobs.solicitud;
      case 'pendientes':
        return mockJobs.pendientes;
      case 'agendados':
        return mockJobs.agendados;
      case 'en_progreso':
        return mockJobs.en_progreso;
      case 'completados':
        return mockJobs.completados;
      default:
        return [];
    }
  };

  const currentJobs = getJobsForTab(activeTab);
  const totalJobs = Object.values(mockJobs).flat().length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Tigres</h1>
          <p className="text-gray-600">Gestiona tus trabajos y servicios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{mockJobs.solicitud.length}</div>
          <div className="text-sm text-gray-600">Solicitudes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{mockJobs.pendientes.length + mockJobs.agendados.length}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-orange-600">{mockJobs.en_progreso.length}</div>
          <div className="text-sm text-gray-600">En Progreso</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{mockJobs.completados.length}</div>
          <div className="text-sm text-gray-600">Completados</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TigresTabNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        jobCounts={{
          solicitud: mockJobs.solicitud.length,
          pendientes: mockJobs.pendientes.length,
          agendados: mockJobs.agendados.length,
          en_progreso: mockJobs.en_progreso.length,
          completados: mockJobs.completados.length
        }}
      />

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {currentJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay trabajos en esta categoría
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'solicitud' 
                  ? 'Revisa las publicaciones disponibles para encontrar nuevos trabajos'
                  : 'Los trabajos aparecerán aquí cuando cambien de estado'
                }
              </p>
              {activeTab === 'solicitud' && (
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ver Publicaciones
                </Button>
              )}
            </div>
          ) : (
            currentJobs.map((job) => (
              <TigresJobCard
                key={job.id}
                job={job}
                onAccept={() => console.log('Aceptar trabajo:', job.id)}
                onReject={() => console.log('Rechazar trabajo:', job.id)}
                onStart={() => console.log('Iniciar trabajo:', job.id)}
                onComplete={() => console.log('Completar trabajo:', job.id)}
                onContact={() => console.log('Contactar cliente:', job.id)}
              />
            ))
          )}
        </div>
      ) : (
        <TigresCalendar jobs={Object.values(mockJobs).flat()} />
      )}
    </div>
  );
}
