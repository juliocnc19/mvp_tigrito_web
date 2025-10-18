'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    label: 'Inicio',
    href: '/',
    icon: '🏠',
  },
  {
    label: 'Servicios',
    href: '/services',
    icon: '🔧',
  },
  {
    label: 'Mis Solicitudes',
    href: '/my-requests',
    icon: '📋',
    badge: 3,
  },
  {
    label: 'Transacciones',
    href: '/transactions',
    icon: '💳',
  },
  {
    label: 'Perfil',
    href: '/profile',
    icon: '👤',
  },
];

export function SidebarNavigation({ isOpen = true, onClose }: SidebarNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-600">Menú</h2>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-left ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
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
        <div className="p-4 border-t space-y-2">
          <Link href="/help">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm">
              <span>❓</span>
              <span>Ayuda</span>
            </button>
          </Link>
          <Link href="/settings">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm">
              <span>⚙️</span>
              <span>Configuración</span>
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
