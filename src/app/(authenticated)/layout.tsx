'use client';

import React, { useState } from 'react';
import { ReactNode } from 'react';
import { TopNavigation, SidebarNavigation, ProtectedRoute } from '@/components';
import { useAuth } from '@/hooks';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarNavigation 
            isOpen={true}
            onClose={() => setSidebarOpen(false)}
            onLogout={logout}
          />
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top Navigation */}
          <TopNavigation 
            userName={user?.name || 'Usuario'}
            balance={user?.balance || 0}
            notificationCount={2}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onLogout={logout}
          />

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
