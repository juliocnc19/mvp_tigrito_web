'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Upload, MapPin, Plus, Trash2 } from 'lucide-react';

interface ServiceLocation {
  lat: number;
  lng: number;
  address: string;
}

interface CreateServiceModalProps {
  onClose: () => void;
  onSave: (serviceData: any) => void;
}

export function CreateServiceModal({ onClose, onSave }: CreateServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    serviceLocations: [] as ServiceLocation[],
    media: [] as string[]
  });

  const [newLocation, setNewLocation] = useState({
    address: '',
    lat: 0,
    lng: 0
  });

  const categories = [
    'Plomería',
    'Electricidad',
    'Limpieza',
    'Albañilería',
    'Pintura',
    'Reparaciones',
    'Mudanzas',
    'Jardinería',
    'Carpintería',
    'Herrería'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLocation = () => {
    if (newLocation.address.trim()) {
      setFormData(prev => ({
        ...prev,
        serviceLocations: [...prev.serviceLocations, { ...newLocation }]
      }));
      setNewLocation({ address: '', lat: 0, lng: 0 });
    }
  };

  const handleRemoveLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: prev.serviceLocations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.serviceLocations.length === 0) {
      alert('Por favor agrega al menos una ubicación de servicio');
      return;
    }

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookingsCount: 0,
      rating: 0,
      earnings: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Crear Nuevo Servicio</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            
            <div>
              <Label htmlFor="title">Título del Servicio *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Reparación de grifos y tuberías"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe detalladamente tu servicio, qué incluye, materiales, garantía, etc."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (VES) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="15000"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service Locations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ubicaciones de Servicio</h3>
            
            <div className="space-y-2">
              <Label>Agregar Ubicación</Label>
              <div className="flex gap-2">
                <Input
                  value={newLocation.address}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Ej: Caracas, Distrito Capital"
                />
                <Button
                  type="button"
                  onClick={handleAddLocation}
                  disabled={!newLocation.address.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.serviceLocations.length > 0 && (
              <div className="space-y-2">
                <Label>Ubicaciones Agregadas</Label>
                {formData.serviceLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{location.address}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLocation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Media Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Imágenes del Servicio</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG hasta 10MB cada una
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-2">
                Seleccionar Imágenes
              </Button>
            </div>

            {formData.media.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {formData.media.map((media, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={media} 
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          media: prev.media.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Servicio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
