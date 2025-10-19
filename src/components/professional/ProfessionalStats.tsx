'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react';
import { useProfessionalDashboardStats, useProfessionalEarningsStats } from '@/hooks/services/useProfessionals';
import { useAuth } from '@/hooks/useAuth';

export function ProfessionalStats() {
  const { user } = useAuth();
  const { data: dashboardStats, isLoading: dashboardLoading, error: dashboardError } = useProfessionalDashboardStats(user?.id || '');
  const { data: earningsStats, isLoading: earningsLoading, error: earningsError } = useProfessionalEarningsStats(user?.id || '');

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCompletionRateColor = (rate: number | undefined) => {
    if (!rate) return 'text-[var(--color-neutral-text-secondary)]';
    if (rate >= 90) return 'text-[var(--color-success)]';
    if (rate >= 80) return 'text-[var(--color-warning-badge)]';
    return 'text-destructive';
  };

  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return 'text-[var(--color-neutral-text-secondary)]';
    if (rating >= 4.5) return 'text-[var(--color-success)]';
    if (rating >= 4.0) return 'text-[var(--color-warning-badge)]';
    return 'text-destructive';
  };

  // Show loading state
  if (dashboardLoading || earningsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError || earningsError) {
    return (
      <Alert className="border-destructive/20 bg-[var(--color-danger-light)]">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-[var(--color-danger-text)]">
          Error al cargar las estadísticas. Por favor, intenta de nuevo más tarde.
        </AlertDescription>
      </Alert>
    );
  }

  // Use real data from hooks
  const stats = dashboardStats;
  const monthlyData = earningsStats?.monthlyEarnings || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Estadísticas de Rendimiento</h2>
        <p className="text-[var(--color-neutral-text-secondary)]">Resumen de tu actividad profesional en la plataforma</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trabajos Totales</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.totalJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Desde que te uniste
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">{dashboardStats?.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats?.completionRate}% de finalización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-[var(--color-success)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--color-success)]">
              {formatPrice(dashboardStats?.totalEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos acumulados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-[var(--color-warning-badge)]" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRatingColor(dashboardStats?.averageRating)}`}>
              {dashboardStats?.averageRating}
            </div>
            <p className="text-xs text-muted-foreground">
              Basado en reseñas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tasa de Finalización</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-[var(--color-skeleton)] rounded-full h-2">
                  <div 
                    className="bg-[var(--color-success)] h-2 rounded-full" 
                    style={{ width: `${dashboardStats?.completionRate}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${getCompletionRateColor(dashboardStats?.completionRate)}`}>
                  {dashboardStats?.completionRate}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tiempo de Respuesta</span>
              <span className="text-sm font-medium text-[var(--color-brand-primary)]">{stats?.responseTime || 0} horas</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Servicios Activos</span>
              <span className="text-sm font-medium text-purple-600">{stats?.activeServices || 0}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Trabajos Cancelados</span>
              <span className="text-sm font-medium text-destructive">{dashboardStats?.cancelledJobs}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendencias Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Último mes</span>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--color-success)]">+12 trabajos</div>
                <div className="text-xs text-[var(--color-neutral-text-tertiary)]">vs mes anterior</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ganancias mensuales</span>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--color-success)]">+15%</div>
                <div className="text-xs text-[var(--color-neutral-text-tertiary)]">vs mes anterior</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Calificación promedio</span>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--color-success)]">+0.2</div>
                <div className="text-xs text-[var(--color-neutral-text-tertiary)]">vs mes anterior</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tiempo de respuesta</span>
              <div className="text-right">
                <div className="text-sm font-medium text-[var(--color-success)]">-30 min</div>
                <div className="text-xs text-[var(--color-neutral-text-tertiary)]">vs mes anterior</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Actividad de los Últimos Meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.length > 0 ? (
              monthlyData.slice(0, 6).map((month: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--color-neutral-surface)] rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{month.month}</div>
                    <div className="text-xs text-[var(--color-neutral-text-tertiary)]">{month.jobs} trabajos completados</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[var(--color-success)]">
                      {formatPrice(month.earnings)}
                    </div>
                    <div className="text-xs text-[var(--color-neutral-text-tertiary)]">
                      {month.jobs > 0 ? `Promedio: ${formatPrice(month.earnings / month.jobs)}` : 'Sin trabajos'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[var(--color-neutral-text-tertiary)]">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos de actividad mensual disponibles</p>
                <p className="text-sm">Los datos aparecerán después de completar trabajos</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
