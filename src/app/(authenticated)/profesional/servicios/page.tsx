'use client';

import React, { useState } from 'react';
import { ProfessionalServiceCard } from '@/components/professional/ProfessionalServiceCard';
import { CreateServiceModal } from '@/components/professional/CreateServiceModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Grid, List } from 'lucide-react';

// Mock data for professional services
const mockServices = [
  {
    id: '1',
    title: 'Reparación de grifos y tuberías',
    description: 'Servicio completo de reparación de grifos, cambio de tuberías y solución de fugas. Incluye materiales básicos.',
    price: 15000,
    category: 'Plomería',
    serviceLocations: [
      { lat: 10.4806, lng: -66.9036, address: 'Caracas, Distrito Capital' },
      { lat: 10.1621, lng: -68.0077, address: 'Valencia, Carabobo' }
    ],
    isActive: true,
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
    media: ['/images/plumbing-service1.jpg', '/images/plumbing-service2.jpg'],
    bookingsCount: 12,
    rating: 4.8,
    earnings: 180000
  },
  {
    id: '2',
    title: 'Instalación eléctrica residencial',
    description: 'Instalación completa de sistemas eléctricos para hogares. Certificado y con garantía.',
    price: 25000,
    category: 'Electricidad',
    serviceLocations: [
      { lat: 10.4806, lng: -66.9036, address: 'Caracas, Distrito Capital' }
    ],
    isActive: true,
    createdAt: '2024-01-08T14:15:00Z',
    updatedAt: '2024-01-12T09:45:00Z',
    media: ['/images/electrical-service1.jpg'],
    bookingsCount: 8,
    rating: 4.9,
    earnings: 200000
  },
  {
    id: '3',
    title: 'Limpieza profunda de hogar',
    description: 'Servicio de limpieza completa para casas y apartamentos. Incluye cocina, baños, salas y habitaciones.',
    price: 12000,
    category: 'Limpieza',
    serviceLocations: [
      { lat: 10.4806, lng: -66.9036, address: 'Caracas, Distrito Capital' },
      { lat: 10.1621, lng: -68.0077, address: 'Valencia, Carabobo' },
      { lat: 10.2353, lng: -67.5912, address: 'Maracay, Aragua' }
    ],
    isActive: false,
    createdAt: '2024-01-05T16:20:00Z',
    updatedAt: '2024-01-13T11:30:00Z',
    media: [],
    bookingsCount: 5,
    rating: 4.6,
    earnings: 60000
  }
];

export default function ProfessionalServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesStatus = filterActive === 'all' || 
                         (filterActive === 'active' && service.isActive) ||
                         (filterActive === 'inactive' && !service.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalEarnings = mockServices.reduce((sum, service) => sum + service.earnings, 0);
  const totalBookings = mockServices.reduce((sum, service) => sum + service.bookingsCount, 0);
  const activeServices = mockServices.filter(service => service.isActive).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-600">Gestiona tus servicios proactivos y encuentra nuevos clientes</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Servicio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            ${totalEarnings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Ganancias Totales</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{totalBookings}</div>
          <div className="text-sm text-gray-600">Reservas Totales</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">{activeServices}</div>
          <div className="text-sm text-gray-600">Servicios Activos</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar servicios..."
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

          {/* Status Filter */}
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔧</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes servicios creados
            </h3>
            <p className="text-gray-500 mb-4">
              Crea tu primer servicio para comenzar a recibir reservas
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Servicio
            </Button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <ProfessionalServiceCard
              key={service.id}
              service={service}
              viewMode={viewMode}
              onEdit={() => console.log('Editar servicio:', service.id)}
              onToggleActive={() => console.log('Toggle activo:', service.id)}
              onDelete={() => console.log('Eliminar servicio:', service.id)}
              onViewStats={() => console.log('Ver estadísticas:', service.id)}
            />
          ))
        )}
      </div>

      {/* Create Service Modal */}
      {showCreateModal && (
        <CreateServiceModal
          onClose={() => setShowCreateModal(false)}
          onSave={(serviceData) => {
            console.log('Guardar servicio:', serviceData);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
