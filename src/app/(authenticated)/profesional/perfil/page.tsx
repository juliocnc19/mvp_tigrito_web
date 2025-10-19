'use client';

import React, { useState } from 'react';
import { ProfessionalProfileHeader } from '@/components/professional/ProfessionalProfileHeader';
import { ProfessionalStats } from '@/components/professional/ProfessionalStats';
import { ProfessionalPortfolio } from '@/components/professional/ProfessionalPortfolio';
import { ProfessionalProfessions } from '@/components/professional/ProfessionalProfessions';
import { ProfessionalSettings } from '@/components/professional/ProfessionalSettings';
import { Button } from '@/components/ui/button';
import { Edit, Settings, BarChart3, Briefcase, Image } from 'lucide-react';

// Mock data for professional profile
const mockProfile = {
  id: '1',
  name: 'Carlos Mendoza',
  email: 'carlos.mendoza@email.com',
  phone: '+58 412 123 4567',
  bio: 'Plomero profesional con más de 10 años de experiencia en reparaciones residenciales y comerciales. Especializado en instalaciones de tuberías, reparación de grifos y sistemas de drenaje.',
  rating: 4.8,
  reviewCount: 142,
  isVerified: true,
  isIDVerified: true,
  balance: 25000,
  joinedAt: '2023-06-15T10:30:00Z',
  lastActive: '2024-01-14T15:20:00Z',
  portfolio: [
    {
      id: '1',
      title: 'Reparación de fuga en edificio residencial',
      description: 'Solución completa de fuga en tubería principal del edificio',
      category: 'Plomería',
      completedAt: '2024-01-10T16:30:00Z',
      images: ['/images/portfolio1.jpg', '/images/portfolio2.jpg'],
      clientRating: 5,
      clientReview: 'Excelente trabajo, muy profesional y puntual'
    },
    {
      id: '2',
      title: 'Instalación de sistema de drenaje',
      description: 'Instalación completa de sistema de drenaje para casa nueva',
      category: 'Plomería',
      completedAt: '2024-01-05T14:00:00Z',
      images: ['/images/portfolio3.jpg'],
      clientRating: 5,
      clientReview: 'Trabajo impecable, muy recomendado'
    }
  ],
  professions: [
    {
      id: '1',
      name: 'Plomero',
      verified: true,
      experience: '10+ años',
      documents: ['certificado_plomeria.pdf', 'seguro_profesional.pdf']
    },
    {
      id: '2',
      name: 'Técnico en Gas',
      verified: true,
      experience: '5+ años',
      documents: ['certificado_gas.pdf']
    }
  ],
  stats: {
    totalJobs: 156,
    completedJobs: 142,
    cancelledJobs: 8,
    totalEarnings: 1850000,
    averageRating: 4.8,
    responseTime: '2 horas',
    completionRate: 91,
    repeatClients: 45
  }
};

export default function ProfessionalProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'portfolio', label: 'Portafolio', icon: Image },
    { id: 'professions', label: 'Profesiones', icon: Briefcase },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfessionalStats />;
      case 'portfolio':
        return <ProfessionalPortfolio />;
      case 'professions':
        return <ProfessionalProfessions professions={mockProfile.professions} />;
      case 'settings':
        return <ProfessionalSettings profile={mockProfile} />;
      default:
        return <ProfessionalStats />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfessionalProfileHeader 
        profile={mockProfile}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-none border-r last:border-r-0 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-b-2 border-b-current' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
