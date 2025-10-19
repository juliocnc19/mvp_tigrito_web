'use client';

import React from 'react';
import { Bell, User, DollarSign, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProfessionalTopBarProps {
  userName?: string;
  balance?: number;
  notificationCount?: number;
  onMenuToggle?: () => void;
}

export function ProfessionalTopBar({ 
  userName = "Profesional",
  balance = 0,
  notificationCount = 0,
  onMenuToggle
}: ProfessionalTopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Modo Profesional</h1>
            <p className="text-sm text-gray-500">¡Encuentra trabajos y gana dinero!</p>
          </div>
        </div>

        {/* Right side - Balance, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Balance */}
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              ${balance.toLocaleString()}
            </span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
