'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Briefcase, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface ModeSwitchProps {
  currentMode: 'client' | 'professional';
  onModeChange: (mode: 'client' | 'professional') => void;
  isVerified?: boolean;
}

export function ModeSwitch({ 
  currentMode, 
  onModeChange, 
  isVerified = false 
}: ModeSwitchProps) {
  const isProfessional = currentMode === 'professional';

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Modo de Trabajo</h3>
          <p className="text-sm text-gray-600">
            Cambia entre modo Cliente y Profesional
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isVerified && (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verificado
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Mode Display */}
        <div className={`p-4 rounded-lg border-2 ${
          isProfessional 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isProfessional 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {isProfessional ? (
                <Briefcase className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {isProfessional ? 'Modo Profesional' : 'Modo Cliente'}
              </div>
              <div className="text-sm text-gray-600">
                {isProfessional 
                  ? 'Gestiona trabajos y servicios' 
                  : 'Contrata servicios profesionales'
                }
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Activo</div>
              <div className="text-xs text-gray-500">Modo actual</div>
            </div>
          </div>
        </div>

        {/* Mode Switch */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium text-sm">Modo Cliente</div>
              <div className="text-xs text-gray-500">Contratar servicios</div>
            </div>
          </div>
          <Switch
            checked={isProfessional}
            onCheckedChange={(checked: boolean) => onModeChange(checked ? 'professional' : 'client')}
          />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-medium text-sm">Modo Profesional</div>
              <div className="text-xs text-gray-500">Ofrecer servicios</div>
            </div>
            <Briefcase className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => onModeChange('client')}
            className={`flex items-center gap-2 ${
              !isProfessional ? 'border-primary text-primary' : ''
            }`}
          >
            <User className="h-4 w-4" />
            Ir a Modo Cliente
            {!isProfessional && <CheckCircle className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onModeChange('professional')}
            className={`flex items-center gap-2 ${
              isProfessional ? 'border-primary text-primary' : ''
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Ir a Modo Profesional
            {isProfessional && <CheckCircle className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mode Benefits */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {isProfessional ? 'Beneficios del Modo Profesional:' : 'Beneficios del Modo Cliente:'}
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {isProfessional ? (
              <>
                <li>• Acceso a publicaciones de trabajos</li>
                <li>• Crear servicios proactivos</li>
                <li>• Gestionar trabajos en curso</li>
                <li>• Ver estadísticas de ganancias</li>
                <li>• Construir portafolio profesional</li>
              </>
            ) : (
              <>
                <li>• Publicar solicitudes de servicios</li>
                <li>• Comparar ofertas de profesionales</li>
                <li>• Pagar de forma segura</li>
                <li>• Calificar y reseñar servicios</li>
                <li>• Historial de servicios contratados</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
