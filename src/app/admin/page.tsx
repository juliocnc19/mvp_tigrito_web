'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, logout } = useAuth();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a esta página.
            </p>
            <Link href="/login">
              <Button variant="outline">Ir al Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user.name}. Gestiona el sistema desde aquí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">+8% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+23% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seguridad</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OK</div>
              <p className="text-xs text-muted-foreground">Sistema seguro</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Gestionar Usuarios
              </Button>
              <Button className="w-full" variant="outline">
                Ver Reportes
              </Button>
              <Button className="w-full" variant="outline">
                Configuración del Sistema
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Versión:</span>
                <span className="text-sm text-gray-600">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Última actualización:</span>
                <span className="text-sm text-gray-600">2025-10-18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <span className="text-sm text-green-600">Operativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Usuario actual:</span>
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rol:</span>
                <span className="text-sm text-blue-600">{user.role}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Panel de administración - UnTigrito®
          </p>
        </div>
      </div>
    </div>
  );
}
