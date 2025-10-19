'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Settings,
  BarChart3,
  CreditCard,
  FileText,
  Gift,
  TrendingUp,
  UserCheck,
  Briefcase,
  ShoppingCart,
  Flag,
  DollarSign,
  Database,
  Bell,
  MessageCircle,
  Image,
  Play,
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
    title: 'Categorías',
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
  {
    title: 'Playground',
    href: '/admin/chatbot/playground',
    icon: Play,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full w-64 flex-col bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)]', className)}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-[var(--color-sidebar-border)]">
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
                  ? 'bg-[var(--color-brand-primary)] text-[var(--color-sidebar-text)]'
                  : 'text-[var(--color-sidebar-text-secondary)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-text)]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--color-sidebar-border)] p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-[var(--color-sidebar-text-secondary)] truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
