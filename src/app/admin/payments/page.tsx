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
  CreditCard, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  RefreshCw,
  ArrowLeftRight
} from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  transactionId: string | null;
  amount: number;
  fee: number;
  method: 'CASHEA' | 'BALANCE' | 'TRANSFER' | 'PAY_MOBILE' | 'CARD' | 'OTHER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  details: any;
  createdAt: string;
  updatedAt: string;
  recipientId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  transaction: {
    id: string;
    currentStatus: string;
    posting?: {
      title: string;
    };
    proService?: {
      title: string;
    };
  } | null;
}

export default function PaymentsManagementPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
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
    method: 'all',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchPayments();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.method && filters.method !== 'all' && { method: filters.method }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/payments/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setPayments(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading payments');
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

  const handleViewPayment = (payment: Payment) => {
    console.log('View payment:', payment);
    // Implement view payment modal or navigation
  };

  const handleRefundPayment = async (payment: Payment) => {
    const reason = prompt('Motivo del reembolso:');
    if (reason) {
      try {
        setError(null);
        const response = await fetch(`/api/payments/${payment.id}/refund`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reason,
            adminNotes: `Reembolso procesado por administrador: ${reason}`,
          }),
        });
        
        if (response.ok) {
          setSuccessMessage(`Pago de $${payment.amount} reembolsado exitosamente`);
          fetchPayments(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.error?.message || 'Error al procesar reembolso');
        }
      } catch (err) {
        setError('Error de conexión al procesar reembolso');
        console.error('Error refunding payment:', err);
      }
    }
  };

  const handleUpdateStatus = async (payment: Payment, newStatus: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/payments/${payment.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: `Estado actualizado por administrador a: ${newStatus}`,
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Estado del pago actualizado a ${newStatus}`);
        fetchPayments(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al actualizar estado');
      }
    } catch (err) {
      setError('Error de conexión al actualizar estado');
      console.error('Error updating payment status:', err);
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
      case 'REFUNDED':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
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
      case 'REFUNDED':
        return <Badge variant="outline">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'CASHEA':
        return 'Cashea';
      case 'BALANCE':
        return 'Balance';
      case 'TRANSFER':
        return 'Transferencia';
      case 'PAY_MOBILE':
        return 'Pago Móvil';
      case 'CARD':
        return 'Tarjeta';
      case 'OTHER':
        return 'Otro';
      default:
        return method;
    }
  };

  const columns: Column<Payment>[] = [
    {
      key: 'user',
      header: 'Usuario',
      sortable: true,
      render: (value, payment) => (
        <div>
          <div className="font-medium">{payment.user.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{payment.user.email}</div>
          {payment.user.phone && (
            <div className="text-sm text-gray-500">{payment.user.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      sortable: true,
      render: (value, payment) => (
        <div>
          <div className="font-mono font-semibold">${value.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Comisión: ${payment.fee.toLocaleString()}</div>
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Método',
      sortable: true,
      render: (value) => (
        <Badge variant="outline">
          {getMethodLabel(value)}
        </Badge>
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
      key: 'transaction',
      header: 'Transacción',
      render: (value, payment) => (
        <div>
          {payment.transaction ? (
            <div>
              <div className="text-sm font-medium">
                {payment.transaction.posting?.title || payment.transaction.proService?.title || 'Servicio'}
              </div>
              <div className="text-xs text-gray-500">
                {payment.transaction.currentStatus}
              </div>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Sin transacción</span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha',
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-8 w-8 mr-3" />
            Gestión de Pagos
          </h1>
          <p className="text-gray-600 mt-2">
            Administra todos los pagos del sistema
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
              <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-muted-foreground">
                {payments.filter(p => p.status === 'COMPLETED').length} completados
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
                {payments.filter(p => p.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren procesamiento
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
                {payments.filter(p => p.status === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Procesados exitosamente
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
                ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Monto total procesado
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="COMPLETED">Completado</SelectItem>
                    <SelectItem value="FAILED">Fallido</SelectItem>
                    <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Método</label>
                <Select
                  value={filters.method}
                  onValueChange={(value: string) => handleFilter({ method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los métodos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los métodos</SelectItem>
                    <SelectItem value="CASHEA">Cashea</SelectItem>
                    <SelectItem value="BALANCE">Balance</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="PAY_MOBILE">Pago Móvil</SelectItem>
                    <SelectItem value="CARD">Tarjeta</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Usuario, email o teléfono..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <DataTable
          data={payments}
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
          actions={(payment) => (
            <EntityActions
              onView={() => handleViewPayment(payment)}
              onApprove={payment.status === 'PENDING' ? () => handleUpdateStatus(payment, 'COMPLETED') : undefined}
              onReject={payment.status === 'PENDING' ? () => handleUpdateStatus(payment, 'FAILED') : undefined}
              onActivate={payment.status === 'COMPLETED' ? () => handleRefundPayment(payment) : undefined}
              showApprove={payment.status === 'PENDING'}
              showReject={payment.status === 'PENDING'}
              showActivate={payment.status === 'COMPLETED'}
              approveLabel="Completar"
              rejectLabel="Marcar Fallido"
              activateLabel="Reembolsar"
              deleteTitle="¿Eliminar pago?"
              deleteDescription="¿Estás seguro de que quieres eliminar este pago? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron pagos"
        />
      </div>
    </div>
  );
}
