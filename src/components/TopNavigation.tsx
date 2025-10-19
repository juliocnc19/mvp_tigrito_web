'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cat } from 'lucide-react';

interface TopNavigationProps {
  userName?: string;
  userImage?: string;
  balance?: number;
  notificationCount?: number;
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export function TopNavigation({
  userName = 'Juan Pérez',
  userImage,
  balance = 15000,
  notificationCount = 2,
  onMenuToggle,
  onLogout,
}: TopNavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const formattedBalance = balance.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="ml-2 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Cat className="w-6 h-6" />
            UnTigrito
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
              <span className="text-sm text-gray-600">Saldo:</span>
              <span className="font-semibold text-gray-900">{formattedBalance} Bs</span>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{userName}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-semibold text-sm text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Cliente verificado</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/profile">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Mi Perfil
                    </button>
                  </Link>
                  <Link href="/profile/balance">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Saldo y Pagos
                    </button>
                  </Link>
                  <Link href="/profile/settings">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      Configuración
                    </button>
                  </Link>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button 
                    onClick={onLogout}
                    className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
