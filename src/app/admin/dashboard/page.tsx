'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  CreditCard,
  FileText,
  Star,
  Flag,
  MessageSquare,
  Bell,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingWithdrawals: number;
    systemHealth: string;
  };
  users: {
    total: number;
    clients: number;
    professionals: number;
    admins: number;
    verified: number;
    unverified: number;
  };
  financial: {
    totalRevenue: number;
    totalPayments: number;
    completedPayments: number;
    totalWithdrawals: number;
    pendingWithdrawals: number;
    completedWithdrawals: number;
  };
  content: {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    totalOffers: number;
    pendingOffers: number;
    acceptedOffers: number;
    totalMedia: number;
    totalPromoCodes: number;
    activePromoCodes: number;
  };
  activity: {
    totalNotifications: number;
    unreadNotifications: number;
    totalConversations: number;
    totalMessages: number;
    recentActivity: number;
  };
  recent: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    transactions: Array<{
      id: string;
      amount: number;
      status: string;
      createdAt: string;
      client: { id: string; name: string; email: string };
      professional: { id: string; name: string; email: string };
    }>;
    withdrawals: Array<{
      id: string;
      amount: number;
      status: string;
      requestedAt: string;
      user: { id: string; name: string; email: string };
    }>;
    reports: Array<{
      id: string;
      reason: string;
      status: string;
      createdAt: string;
      reporter: { id: string; name: string; email: string };
    }>;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar estadísticas</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchStats}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No hay datos disponibles</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administración</h1>
          <p className="text-gray-600 mt-2">
            Resumen general del sistema y métricas clave
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overview.activeUsers} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.overview.pendingWithdrawals.toLocaleString()} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reportes Pendientes</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.content.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                {stats.content.totalReports} totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.overview.systemHealth}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activity.recentActivity} actividades recientes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Clientes:</span>
                <span className="text-sm">{stats.users.clients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Profesionales:</span>
                <span className="text-sm">{stats.users.professionals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Administradores:</span>
                <span className="text-sm">{stats.users.admins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Verificados:</span>
                <span className="text-sm text-green-600">{stats.users.verified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">No verificados:</span>
                <span className="text-sm text-orange-600">{stats.users.unverified}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Financiero
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Pagos totales:</span>
                <span className="text-sm">{stats.financial.totalPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Pagos completados:</span>
                <span className="text-sm text-green-600">{stats.financial.completedPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Retiros totales:</span>
                <span className="text-sm">{stats.financial.totalWithdrawals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Retiros pendientes:</span>
                <span className="text-sm text-orange-600">{stats.financial.pendingWithdrawals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Retiros completados:</span>
                <span className="text-sm text-green-600">{stats.financial.completedWithdrawals}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Actividad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Notificaciones:</span>
                <span className="text-sm">{stats.activity.totalNotifications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">No leídas:</span>
                <span className="text-sm text-orange-600">{stats.activity.unreadNotifications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Conversaciones:</span>
                <span className="text-sm">{stats.activity.totalConversations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Mensajes:</span>
                <span className="text-sm">{stats.activity.totalMessages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Actividad reciente:</span>
                <span className="text-sm text-blue-600">{stats.activity.recentActivity}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Usuarios Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recent.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{user.name || 'Sin nombre'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Reportes Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recent.reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{report.reason}</p>
                      <p className="text-xs text-gray-500">
                        Por: {report.reporter.name || report.reporter.email}
                      </p>
                    </div>
                    <Badge 
                      variant={report.status === 'PENDING' ? 'destructive' : 'default'}
                    >
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Gestionar Usuarios
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full">
                    <Flag className="h-4 w-4 mr-2" />
                    Ver Reportes
                  </Button>
                </Link>
                <Link href="/admin/withdrawals">
                  <Button variant="outline" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Gestionar Retiros
                  </Button>
                </Link>
                <Link href="/admin/audit-logs">
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Ver Logs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
