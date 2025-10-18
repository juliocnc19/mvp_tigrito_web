'use client';

import React, { useState } from 'react';
import { ReactNode } from 'react';
import { TopNavigation, SidebarNavigation } from '@/components';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation 
        userName="Juan Pérez"
        balance={15000}
        notificationCount={2}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar Navigation */}
        <SidebarNavigation 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
