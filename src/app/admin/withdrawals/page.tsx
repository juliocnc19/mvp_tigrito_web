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
  DollarSign, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  CreditCard
} from 'lucide-react';

interface Withdrawal {
  id: string;
  userId: string;
  paymentMethodId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  requestedAt: string;
  completedAt: string | null;
  adminNotes: string | null;
  rejectionReason: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  paymentMethod: {
    id: string;
    method: string;
    accountAlias: string | null;
  };
}

export default function WithdrawalsManagementPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'requestedAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchWithdrawals();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/withdrawals/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch withdrawals');
      }
      const data = await response.json();
      setWithdrawals(data.data.withdrawals);
      setPagination(prev => ({ ...prev, total: data.data.total }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading withdrawals');
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

  const handleViewWithdrawal = (withdrawal: Withdrawal) => {
    console.log('View withdrawal:', withdrawal);
    // Implement view withdrawal modal or navigation
  };

  const handleApproveWithdrawal = async (withdrawal: Withdrawal) => {
    if (confirm(`¿Estás seguro de que quieres aprobar el retiro de $${withdrawal.amount}?`)) {
      try {
        const response = await fetch(`/api/withdrawals/${withdrawal.id}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'COMPLETED',
            adminNotes: 'Aprobado por administrador',
          }),
        });
        if (response.ok) {
          fetchWithdrawals(); // Refresh the list
        }
      } catch (err) {
        console.error('Error approving withdrawal:', err);
      }
    }
  };

  const handleRejectWithdrawal = async (withdrawal: Withdrawal) => {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      try {
        const response = await fetch(`/api/withdrawals/${withdrawal.id}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'FAILED',
            rejectionReason: reason,
            adminNotes: `Rechazado: ${reason}`,
          }),
        });
        if (response.ok) {
          fetchWithdrawals(); // Refresh the list
        }
      } catch (err) {
        console.error('Error rejecting withdrawal:', err);
      }
    }
  };

  const handleDeleteWithdrawal = async (withdrawal: Withdrawal) => {
    if (confirm(`¿Estás seguro de que quieres eliminar este retiro?`)) {
      try {
        const response = await fetch(`/api/withdrawals/${withdrawal.id}/delete`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchWithdrawals(); // Refresh the list
        }
      } catch (err) {
        console.error('Error deleting withdrawal:', err);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">Completado</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Fallido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<Withdrawal>[] = [
    {
      key: 'user',
      header: 'Usuario',
      sortable: true,
      render: (value, withdrawal) => (
        <div>
          <div className="font-medium">{withdrawal.user.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{withdrawal.user.email}</div>
          {withdrawal.user.phone && (
            <div className="text-sm text-gray-500">{withdrawal.user.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold">${value.toLocaleString()}</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Método de Pago',
      render: (value, withdrawal) => (
        <div>
          <div className="font-medium">{withdrawal.paymentMethod.method}</div>
          {withdrawal.paymentMethod.accountAlias && (
            <div className="text-sm text-gray-500">{withdrawal.paymentMethod.accountAlias}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          {getStatusBadge(value)}
        </div>
      ),
    },
    {
      key: 'requestedAt',
      header: 'Solicitado',
      sortable: true,
      render: (value) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'completedAt',
      header: 'Completado',
      sortable: true,
      render: (value) => (
        <span className="text-sm">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'adminNotes',
      header: 'Notas Admin',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="h-8 w-8 mr-3" />
            Gestión de Retiros
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las solicitudes de retiro de fondos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Retiros</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withdrawals.length}</div>
              <p className="text-xs text-muted-foreground">
                {withdrawals.filter(w => w.status === 'PENDING').length} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {withdrawals.filter(w => w.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren aprobación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {withdrawals.filter(w => w.status === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Procesados exitosamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {withdrawals.filter(w => w.status === 'FAILED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Rechazados o fallidos
              </p>
            </CardContent>
          </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select
                  value={filters.status}
                  onValueChange={(value: string) => handleFilter({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="COMPLETED">Completado</SelectItem>
                    <SelectItem value="FAILED">Fallido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Usuario, email o monto..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <DataTable
          data={withdrawals}
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
          actions={(withdrawal) => (
            <EntityActions
              onView={() => handleViewWithdrawal(withdrawal)}
              onDelete={() => handleDeleteWithdrawal(withdrawal)}
              onApprove={withdrawal.status === 'PENDING' ? () => handleApproveWithdrawal(withdrawal) : undefined}
              onReject={withdrawal.status === 'PENDING' ? () => handleRejectWithdrawal(withdrawal) : undefined}
              showApprove={withdrawal.status === 'PENDING'}
              showReject={withdrawal.status === 'PENDING'}
              approveLabel="Aprobar"
              rejectLabel="Rechazar"
              deleteTitle="¿Eliminar retiro?"
              deleteDescription="¿Estás seguro de que quieres eliminar este retiro? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron retiros"
        />
      </div>
    </div>
  );
}
