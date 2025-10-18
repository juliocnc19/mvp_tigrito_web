'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TopNavigationProps {
  userName?: string;
  userImage?: string;
  balance?: number;
  notificationCount?: number;
  onMenuToggle?: () => void;
}

export function TopNavigation({
  userName = 'Juan Pérez',
  userImage,
  balance = 15000,
  notificationCount = 2,
  onMenuToggle,
}: TopNavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const formattedBalance = balance.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Side - Logo and Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🐯 UnTigrito
          </Link>
        </div>

        {/* Center - Balance Display */}
        <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">Saldo:</span>
          <span className="font-bold text-blue-600">{formattedBalance} Bs</span>
        </div>

        {/* Right Side - Notifications and Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Link href="/notifications">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>
          </Link>

          {/* Messages */}
          <Link href="/messages">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">{userName}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="font-semibold text-sm">{userName}</p>
                  <p className="text-xs text-gray-600">Cliente verificado</p>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/profile">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors">
                      Mi Perfil
                    </button>
                  </Link>
                  <Link href="/profile/balance">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors">
                      Saldo y Pagos
                    </button>
                  </Link>
                  <Link href="/profile/settings">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors">
                      Configuración
                    </button>
                  </Link>
                </div>
                <div className="p-2 border-t">
                  <button className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
