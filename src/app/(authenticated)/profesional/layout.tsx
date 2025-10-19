'use client';

import React, { useState } from 'react';
import { ReactNode } from 'react';
import { ProfessionalNavigation } from '@/components/professional/ProfessionalNavigation';
import { ProfessionalTopBar } from '@/components/professional/ProfessionalTopBar';

interface ProfessionalLayoutProps {
  children: ReactNode;
}

export default function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  const [activeTab, setActiveTab] = useState('publicaciones');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Top Bar */}
      <ProfessionalTopBar />

      {/* Professional Navigation Tabs */}
      <ProfessionalNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
