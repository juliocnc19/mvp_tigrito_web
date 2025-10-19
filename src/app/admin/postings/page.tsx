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
  FileText, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  MapPin,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface Posting {
  id: string;
  clientId: string;
  title: string;
  description: string;
  categoryId: string;
  lat: number | null;
  lng: number | null;
  address: string | null;
  requiredFrom: string | null;
  requiredTo: string | null;
  priceMin: number | null;
  priceMax: number | null;
  status: 'OPEN' | 'CLOSED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  transactionId: string | null;
  budget: number | null;
  deletedAt: string | null;
  locationLat: number | null;
  locationLng: number | null;
  client: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
    isVerified: boolean;
    isIDVerified: boolean;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  offers: Array<{
    id: string;
    price: number;
    status: string;
    createdAt: string;
    professional: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }>;
  transaction: {
    id: string;
    currentStatus: string;
    priceAgreed: number;
    createdAt: string;
  } | null;
  offersCount: number;
}

export default function PostingsManagementPage() {
  const [postings, setPostings] = useState<Posting[]>([]);
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
    category: 'all',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchPostings();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchPostings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/admin/postings/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch postings');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setPostings(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading postings');
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

  const handleViewPosting = (posting: Posting) => {
    console.log('View posting:', posting);
    // Implement view posting modal or navigation
  };

  const handleClosePosting = async (posting: Posting) => {
    try {
      setError(null);
      const response = await fetch(`/api/services/postings/${posting.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CLOSED',
          adminNotes: 'Cerrada por administrador',
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Solicitud "${posting.title}" cerrada exitosamente`);
        fetchPostings(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al cerrar solicitud');
      }
    } catch (err) {
      setError('Error de conexión al cerrar solicitud');
      console.error('Error closing posting:', err);
    }
  };

  const handleReopenPosting = async (posting: Posting) => {
    try {
      setError(null);
      const response = await fetch(`/api/services/postings/${posting.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'OPEN',
          adminNotes: 'Reabierta por administrador',
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Solicitud "${posting.title}" reabierta exitosamente`);
        fetchPostings(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al reabrir solicitud');
      }
    } catch (err) {
      setError('Error de conexión al reabrir solicitud');
      console.error('Error reopening posting:', err);
    }
  };

  const handleDeletePosting = async (posting: Posting) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la solicitud "${posting.title}"?`)) {
      try {
        setError(null);
        const response = await fetch(`/api/services/postings/${posting.id}/delete`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage(`Solicitud "${posting.title}" eliminada exitosamente`);
          fetchPostings(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.error?.message || 'Error al eliminar solicitud');
        }
      } catch (err) {
        setError('Error de conexión al eliminar solicitud');
        console.error('Error deleting posting:', err);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'EXPIRED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="default">Abierta</Badge>;
      case 'CLOSED':
        return <Badge variant="secondary">Cerrada</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<Posting>[] = [
    {
      key: 'title',
      header: 'Solicitud',
      sortable: true,
      render: (value, posting) => (
        <div>
          <div className="font-medium">{posting.title}</div>
          <div className="text-sm text-gray-500">{posting.category.name}</div>
          <div className="text-xs text-gray-400">
            {posting.description.length > 100 
              ? `${posting.description.substring(0, 100)}...` 
              : posting.description}
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Cliente',
      sortable: true,
      render: (value, posting) => (
        <div>
          <div className="font-medium">{posting.client.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{posting.client.email}</div>
          <div className="flex items-center space-x-1 mt-1">
            {posting.client.isVerified && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
            {posting.client.isIDVerified && (
              <User className="h-3 w-3 text-blue-500" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Presupuesto',
      sortable: true,
      render: (value, posting) => (
        <div>
          {posting.budget ? (
            <div className="font-mono font-semibold">${posting.budget.toLocaleString()}</div>
          ) : posting.priceMin || posting.priceMax ? (
            <div className="font-mono font-semibold">
              ${posting.priceMin || 0} - ${posting.priceMax || '∞'}
            </div>
          ) : (
            <span className="text-sm text-gray-400">No especificado</span>
          )}
        </div>
      ),
    },
    {
      key: 'offersCount',
      header: 'Ofertas',
      sortable: true,
      render: (value, posting) => (
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{value}</span>
          {posting.offers.length > 0 && (
            <div className="text-xs text-gray-500">
              Última: ${posting.offers[0].price.toLocaleString()}
            </div>
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
            <FileText className="h-8 w-8 mr-3" />
            Gestión de Solicitudes
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las solicitudes de servicios de los clientes
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
              <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postings.length}</div>
              <p className="text-xs text-muted-foreground">
                {postings.filter(p => p.status === 'OPEN').length} abiertas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abiertas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {postings.filter(p => p.status === 'OPEN').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Recibiendo ofertas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Ofertas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {postings.filter(p => p.offersCount > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Con propuestas recibidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${postings.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor total de solicitudes
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
                    <SelectItem value="OPEN">Abierta</SelectItem>
                    <SelectItem value="CLOSED">Cerrada</SelectItem>
                    <SelectItem value="EXPIRED">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <Select
                  value={filters.category}
                  onValueChange={(value: string) => handleFilter({ category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {/* Add dynamic categories here */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Título, cliente o descripción..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Postings Table */}
        <DataTable
          data={postings}
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
          actions={(posting) => (
            <EntityActions
              onView={() => handleViewPosting(posting)}
              onApprove={posting.status === 'OPEN' ? () => handleClosePosting(posting) : undefined}
              onReject={posting.status === 'CLOSED' ? () => handleReopenPosting(posting) : undefined}
              onDelete={() => handleDeletePosting(posting)}
              showApprove={posting.status === 'OPEN'}
              showReject={posting.status === 'CLOSED'}
              approveLabel="Cerrar"
              rejectLabel="Reabrir"
              deleteTitle="¿Eliminar solicitud?"
              deleteDescription="¿Estás seguro de que quieres eliminar esta solicitud? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron solicitudes"
        />
      </div>
    </div>
  );
}
