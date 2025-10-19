'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  CheckCircle, 
  FileText, 
  Edit, 
  Trash2, 
  Upload,
  Award,
  Calendar,
  Eye
} from 'lucide-react';

interface Profession {
  id: string;
  name: string;
  verified: boolean;
  experience: string;
  documents: string[];
}

interface ProfessionalProfessionsProps {
  professions: Profession[];
}

export function ProfessionalProfessions({ professions }: ProfessionalProfessionsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfession, setNewProfession] = useState({
    name: '',
    experience: '',
    documents: [] as string[]
  });

  const availableProfessions = [
    'Plomero',
    'Electricista',
    'Albañil',
    'Pintor',
    'Carpintero',
    'Herrero',
    'Técnico en Gas',
    'Técnico en Aire Acondicionado',
    'Jardinería',
    'Limpieza Profesional',
    'Mudanzas',
    'Reparaciones Generales'
  ];

  const handleAddProfession = () => {
    if (newProfession.name && newProfession.experience) {
      // Here you would typically save to the backend
      console.log('Agregar profesión:', newProfession);
      setNewProfession({ name: '', experience: '', documents: [] });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Mis Profesiones</h2>
          <p className="text-gray-600">Gestiona tus especialidades y certificaciones</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Profesión
        </Button>
      </div>

      {/* Add Profession Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Profesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesión
              </label>
              <select
                value={newProfession.name}
                onChange={(e) => setNewProfession(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecciona una profesión</option>
                {availableProfessions.map(profession => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Años de Experiencia
              </label>
              <input
                type="text"
                value={newProfession.experience}
                onChange={(e) => setNewProfession(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Ej: 5+ años, 10+ años"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documentos/Certificaciones
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Sube certificados, diplomas o documentos que respalden tu experiencia
                </p>
                <Button type="button" variant="outline" size="sm">
                  Seleccionar Archivos
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddProfession} className="flex-1">
                Agregar Profesión
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professions List */}
      <div className="space-y-4">
        {professions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👷</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes profesiones registradas
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega tus especialidades para que los clientes puedan encontrarte
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Profesión
            </Button>
          </div>
        ) : (
          professions.map((profession) => (
            <Card key={profession.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profession.name}
                        </h3>
                        {profession.verified && (
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {profession.experience}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {profession.documents.length} documento(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Documents List */}
                {profession.documents.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Documentos:</h4>
                    <div className="space-y-1">
                      {profession.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{doc}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Estado de Verificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Perfil Verificado</div>
                  <div className="text-sm text-green-600">Tu identidad ha sido verificada</div>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Verificado
              </Badge>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Beneficios de la verificación:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Mayor confianza de los clientes</li>
                <li>Prioridad en los resultados de búsqueda</li>
                <li>Acceso a trabajos premium</li>
                <li>Badge de verificación en tu perfil</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
