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
  ShoppingCart, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  Calendar,
  MessageSquare,
  Star
} from 'lucide-react';

interface Transaction {
  id: string;
  clientId: string;
  professionalId: string;
  priceAgreed: number;
  discountAmount: number;
  platformFee: number;
  escrowAmount: number;
  currentStatus: 'PENDING_SOLICITUD' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  status: 'PENDING_SOLICITUD' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  scheduledDate: string | null;
  postingId: string | null;
  proServiceId: string | null;
  promoCodeId: string | null;
  yummyLogistics: any;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  agreedPrice: number | null;
  offerId: string | null;
  client: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
  };
  professional: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
  };
  posting: {
    id: string;
    title: string;
    description: string;
  } | null;
  proService: {
    id: string;
    title: string;
    description: string;
  } | null;
  offer: {
    id: string;
    price: number;
    message: string | null;
  } | null;
  payment: {
    id: string;
    amount: number;
    status: string;
    method: string;
  } | null;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
  }>;
  reviewsCount: number;
}

export default function TransactionsManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/admin/transactions/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setTransactions(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading transactions');
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

  const handleViewTransaction = (transaction: Transaction) => {
    console.log('View transaction:', transaction);
    // Implement view transaction modal or navigation
  };

  const handleUpdateStatus = async (transaction: Transaction, newStatus: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/transactions/${transaction.id}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: `Estado actualizado por administrador a: ${newStatus}`,
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Estado de la transacción actualizado a ${newStatus}`);
        fetchTransactions(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al actualizar estado');
      }
    } catch (err) {
      setError('Error de conexión al actualizar estado');
      console.error('Error updating transaction status:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_SOLICITUD':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'SCHEDULED':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CANCELED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_SOLICITUD':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'SCHEDULED':
        return <Badge variant="default">Programada</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline">En Progreso</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">Completada</Badge>;
      case 'CANCELED':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING_SOLICITUD':
        return 'Pendiente';
      case 'SCHEDULED':
        return 'Programada';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completada';
      case 'CANCELED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value.substring(0, 8)}...</span>
      ),
    },
    {
      key: 'client',
      header: 'Cliente',
      sortable: true,
      render: (value, transaction) => (
        <div>
          <div className="font-medium">{transaction.client.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{transaction.client.email}</div>
          {transaction.client.phone && (
            <div className="text-sm text-gray-500">{transaction.client.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'professional',
      header: 'Profesional',
      sortable: true,
      render: (value, transaction) => (
        <div>
          <div className="font-medium">{transaction.professional.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{transaction.professional.email}</div>
          {transaction.professional.phone && (
            <div className="text-sm text-gray-500">{transaction.professional.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Servicio',
      render: (value, transaction) => (
        <div>
          {transaction.posting ? (
            <div>
              <div className="font-medium">{transaction.posting.title}</div>
              <div className="text-sm text-gray-500">Solicitud</div>
            </div>
          ) : transaction.proService ? (
            <div>
              <div className="font-medium">{transaction.proService.title}</div>
              <div className="text-sm text-gray-500">Servicio</div>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Sin servicio</span>
          )}
        </div>
      ),
    },
    {
      key: 'priceAgreed',
      header: 'Precio Acordado',
      sortable: true,
      render: (value, transaction) => (
        <div>
          <div className="font-mono font-semibold">${value.toLocaleString()}</div>
          <div className="text-xs text-gray-500">
            Comisión: ${transaction.platformFee.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: 'currentStatus',
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
      key: 'reviewsCount',
      header: 'Reseñas',
      sortable: true,
      render: (value, transaction) => (
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">{value}</span>
          {transaction.reviews.length > 0 && (
            <div className="text-xs text-gray-500">
              Prom: {(transaction.reviews.reduce((sum, r) => sum + r.rating, 0) / transaction.reviews.length).toFixed(1)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      sortable: true,
      render: (value) => (
        <div>
          <div className="text-sm">{new Date(value).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Gestión de Transacciones
          </h1>
          <p className="text-gray-600 mt-2">
            Administra todas las transacciones de servicios del sistema
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                {transactions.filter(t => t.currentStatus === 'COMPLETED').length} completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {transactions.filter(t => t.currentStatus === 'IN_PROGRESS').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Activas actualmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.currentStatus === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Finalizadas exitosamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${transactions.reduce((sum, t) => sum + t.priceAgreed, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Monto total transaccionado
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
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="PENDING_SOLICITUD">Pendiente</SelectItem>
                    <SelectItem value="SCHEDULED">Programada</SelectItem>
                    <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                    <SelectItem value="COMPLETED">Completada</SelectItem>
                    <SelectItem value="CANCELED">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cliente, profesional o servicio..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <DataTable
          data={transactions}
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
          actions={(transaction) => (
            <EntityActions
              onView={() => handleViewTransaction(transaction)}
              onApprove={transaction.currentStatus === 'PENDING_SOLICITUD' ? () => handleUpdateStatus(transaction, 'SCHEDULED') : undefined}
              onReject={transaction.currentStatus === 'PENDING_SOLICITUD' ? () => handleUpdateStatus(transaction, 'CANCELED') : undefined}
              onActivate={transaction.currentStatus === 'SCHEDULED' ? () => handleUpdateStatus(transaction, 'IN_PROGRESS') : undefined}
              onDeactivate={transaction.currentStatus === 'IN_PROGRESS' ? () => handleUpdateStatus(transaction, 'COMPLETED') : undefined}
              showApprove={transaction.currentStatus === 'PENDING_SOLICITUD'}
              showReject={transaction.currentStatus === 'PENDING_SOLICITUD'}
              showActivate={transaction.currentStatus === 'SCHEDULED'}
              showDeactivate={transaction.currentStatus === 'IN_PROGRESS'}
              approveLabel="Programar"
              rejectLabel="Cancelar"
              activateLabel="Iniciar"
              deactivateLabel="Completar"
              deleteTitle="¿Eliminar transacción?"
              deleteDescription="¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron transacciones"
        />
      </div>
    </div>
  );
}
