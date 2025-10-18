'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  CreditCard,
  FileText,
  Gift,
  MessageSquare,
  Image,
  ClipboardList,
  Bell,
  MessageCircle,
  TrendingUp,
  UserCheck,
  Briefcase,
  ShoppingCart,
  Star,
  Flag,
  DollarSign,
  Database,
  Activity,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Usuarios',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Profesiones',
    href: '/admin/professions',
    icon: Briefcase,
  },
  {
    title: 'Servicios',
    href: '/admin/services',
    icon: Settings,
  },
  {
    title: 'Solicitudes',
    href: '/admin/postings',
    icon: FileText,
  },
  {
    title: 'Transacciones',
    href: '/admin/transactions',
    icon: ShoppingCart,
  },
  {
    title: 'Retiros',
    href: '/admin/withdrawals',
    icon: DollarSign,
  },
  {
    title: 'Pagos',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Reseñas',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Reportes',
    href: '/admin/reports',
    icon: Flag,
  },
  {
    title: 'Ofertas',
    href: '/admin/offers',
    icon: TrendingUp,
  },
  {
    title: 'Códigos Promo',
    href: '/admin/promo-codes',
    icon: Gift,
  },
  {
    title: 'Multimedia',
    href: '/admin/media',
    icon: Image,
  },
  {
    title: 'Logs de Auditoría',
    href: '/admin/audit-logs',
    icon: Database,
  },
  {
    title: 'Notificaciones',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'Conversaciones',
    href: '/admin/conversations',
    icon: MessageCircle,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full w-64 flex-col bg-gray-900 text-white', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
