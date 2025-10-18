'use client';

import { useEffect, useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EntityActions } from '@/components/admin/EntityActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  isVerified: boolean;
  isIDVerified: boolean;
  balance: number;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
  locationAddress: string | null;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    role: '',
    isVerified: '',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/users/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.data.users);
      setPagination(prev => ({ ...prev, total: data.data.total }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleSort = (key: string) => {
    setSorting(prev => ({
      sortBy: key,
      sortDirection: prev.sortBy === key && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewUser = (user: User) => {
    console.log('View user:', user);
    // Implement view user modal or navigation
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user);
    // Implement edit user modal or navigation
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name || user.email}?`)) {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchUsers(); // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleVerification = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isVerified: !user.isVerified,
        }),
      });
      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating verification:', err);
    }
  };

  const handleToggleSuspension = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isSuspended: !user.isSuspended,
        }),
      });
      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error('Error updating suspension:', err);
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (value, user) => (
        <div>
          <div className="font-medium">{user.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'ADMIN' ? 'destructive' : value === 'PROFESSIONAL' ? 'default' : 'secondary'}>
          {value === 'CLIENT' ? 'Cliente' : value === 'PROFESSIONAL' ? 'Profesional' : 'Admin'}
        </Badge>
      ),
    },
    {
      key: 'isVerified',
      header: 'Verificado',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">{value ? 'Sí' : 'No'}</span>
        </div>
      ),
    },
    {
      key: 'isIDVerified',
      header: 'ID Verificado',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value ? (
            <Shield className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm">{value ? 'Sí' : 'No'}</span>
        </div>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      render: (value) => (
        <span className="font-mono">${value.toLocaleString()}</span>
      ),
    },
    {
      key: 'isSuspended',
      header: 'Estado',
      sortable: true,
      render: (value) => (
        <Badge variant={value ? 'destructive' : 'default'}>
          {value ? 'Suspendido' : 'Activo'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de Registro',
      sortable: true,
      render: (value) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="h-8 w-8 mr-3" />
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-2">
                Administra todos los usuarios del sistema
              </p>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rol</label>
                <Select
                  value={filters.role}
                  onValueChange={(value: string) => handleFilter({ role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los roles</SelectItem>
                    <SelectItem value="CLIENT">Cliente</SelectItem>
                    <SelectItem value="PROFESSIONAL">Profesional</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Verificación</label>
                <Select
                  value={filters.isVerified}
                  onValueChange={(value: string) => handleFilter({ isVerified: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="true">Verificados</SelectItem>
                    <SelectItem value="false">No verificados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nombre, email o teléfono..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          pagination={{
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
          }}
          sorting={{
            sortBy: sorting.sortBy,
            sortDirection: sorting.sortDirection,
            onSort: handleSort,
          }}
          onSearch={handleSearch}
          onFilter={handleFilter}
          actions={(user) => (
            <EntityActions
              onView={() => handleViewUser(user)}
              onEdit={() => handleEditUser(user)}
              onDelete={() => handleDeleteUser(user)}
              onApprove={!user.isVerified ? () => handleToggleVerification(user) : undefined}
              onReject={user.isVerified ? () => handleToggleVerification(user) : undefined}
              onActivate={user.isSuspended ? () => handleToggleSuspension(user) : undefined}
              onDeactivate={!user.isSuspended ? () => handleToggleSuspension(user) : undefined}
              showApprove={!user.isVerified}
              showReject={user.isVerified}
              showActivate={user.isSuspended}
              showDeactivate={!user.isSuspended}
              approveLabel="Verificar"
              rejectLabel="Desverificar"
              activateLabel="Activar"
              deactivateLabel="Suspender"
              deleteTitle="¿Eliminar usuario?"
              deleteDescription={`¿Estás seguro de que quieres eliminar al usuario ${user.name || user.email}? Esta acción no se puede deshacer.`}
            />
          )}
          emptyMessage="No se encontraron usuarios"
        />
      </div>
    </div>
  );
}
