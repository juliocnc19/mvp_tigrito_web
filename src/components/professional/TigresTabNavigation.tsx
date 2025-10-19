'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  Play, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

interface TigresTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  jobCounts: {
    solicitud: number;
    pendientes: number;
    agendados: number;
    en_progreso: number;
    completados: number;
  };
}

const tabs = [
  {
    id: 'solicitud',
    label: 'Solicitudes',
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'pendientes',
    label: 'Pendientes',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'agendados',
    label: 'Agendados',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'en_progreso',
    label: 'En Progreso',
    icon: Play,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'completados',
    label: 'Completados',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export function TigresTabNavigation({ 
  activeTab, 
  onTabChange, 
  jobCounts 
}: TigresTabNavigationProps) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = jobCounts[tab.id as keyof typeof jobCounts];
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-none border-r last:border-r-0 ${
                isActive 
                  ? `${tab.bgColor} ${tab.color} border-b-2 border-b-current` 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{tab.label}</span>
              {count > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${
                    isActive ? 'bg-current text-white' : ''
                  }`}
                >
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
