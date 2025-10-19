'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Wrench, 
  ClipboardList, 
  CreditCard, 
  User, 
  HelpCircle, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarNavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: Home,
  },
  {
    label: 'Servicios',
    href: '/services',
    icon: Wrench,
  },
  {
    label: 'Mis Solicitudes',
    href: '/my-requests',
    icon: ClipboardList,
    badge: 3,
  },
  {
    label: 'Transacciones',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    label: 'Perfil',
    href: '/profile',
    icon: User,
  },
];

export function SidebarNavigation({ isOpen = true, onClose, onLogout }: SidebarNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Menú</h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link href="/help">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Ayuda</span>
            </button>
          </Link>
          <Link href="/settings">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm">
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </Link>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
    </aside>
  );
}
