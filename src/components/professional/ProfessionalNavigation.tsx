'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Briefcase, 
  Settings, 
  User,
  Plus
} from 'lucide-react';

interface ProfessionalNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationTabs = [
  {
    id: 'publicaciones',
    label: 'Publicaciones',
    icon: FileText,
    href: '/profesional',
    badge: 0
  },
  {
    id: 'tigres',
    label: 'Tigres',
    icon: Briefcase,
    href: '/profesional/tigres',
    badge: 3
  },
  {
    id: 'servicios',
    label: 'Servicios',
    icon: Settings,
    href: '/profesional/servicios',
    badge: 0
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: User,
    href: '/profesional/perfil',
    badge: 0
  }
];

export function ProfessionalNavigation({ activeTab, onTabChange }: ProfessionalNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Quick Action Button */}
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            <span>Nuevo Servicio</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
