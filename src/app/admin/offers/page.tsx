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
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  FileText,
  MessageSquare
} from 'lucide-react';

interface Offer {
  id: string;
  postingId: string;
  professionalId: string;
  price: number;
  proposedPrice: number | null;
  message: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
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
    priceMin: number | null;
    priceMax: number | null;
    status: string;
    client: {
      id: string;
      name: string | null;
      email: string | null;
    };
  };
}

export default function OffersManagementPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
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
    fetchOffers();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchOffers = async () => {
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

      const response = await fetch(`/api/services/offers/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setOffers(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading offers');
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

  const handleViewOffer = (offer: Offer) => {
    console.log('View offer:', offer);
    // Implement view offer modal or navigation
  };

  const handleAcceptOffer = async (offer: Offer) => {
    try {
      setError(null);
      const response = await fetch(`/api/services/offers/${offer.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ACCEPTED',
          adminNotes: 'Aceptada por administrador',
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Oferta de $${offer.price} aceptada exitosamente`);
        fetchOffers(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al aceptar oferta');
      }
    } catch (err) {
      setError('Error de conexión al aceptar oferta');
      console.error('Error accepting offer:', err);
    }
  };

  const handleRejectOffer = async (offer: Offer) => {
    try {
      setError(null);
      const response = await fetch(`/api/services/offers/${offer.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          adminNotes: 'Rechazada por administrador',
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Oferta de $${offer.price} rechazada exitosamente`);
        fetchOffers(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al rechazar oferta');
      }
    } catch (err) {
      setError('Error de conexión al rechazar oferta');
      console.error('Error rejecting offer:', err);
    }
  };

  const handleDeleteOffer = async (offer: Offer) => {
    if (confirm(`¿Estás seguro de que quieres eliminar esta oferta?`)) {
      try {
        setError(null);
        const response = await fetch(`/api/services/offers/${offer.id}/delete`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage(`Oferta eliminada exitosamente`);
          fetchOffers(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.error?.message || 'Error al eliminar oferta');
        }
      } catch (err) {
        setError('Error de conexión al eliminar oferta');
        console.error('Error deleting offer:', err);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'ACCEPTED':
        return <Badge variant="default">Aceptada</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: Column<Offer>[] = [
    {
      key: 'posting',
      header: 'Solicitud',
      sortable: true,
      render: (value, offer) => (
        <div>
          <div className="font-medium">{offer.posting.title}</div>
          <div className="text-sm text-gray-500">
            Cliente: {offer.posting.client.name || offer.posting.client.email}
          </div>
          <div className="text-xs text-gray-400">
            Presupuesto: ${offer.posting.priceMin || 0} - ${offer.posting.priceMax || '∞'}
          </div>
        </div>
      ),
    },
    {
      key: 'professional',
      header: 'Profesional',
      sortable: true,
      render: (value, offer) => (
        <div>
          <div className="font-medium">{offer.professional.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{offer.professional.email}</div>
          {offer.professional.phone && (
            <div className="text-sm text-gray-500">{offer.professional.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Precio Ofrecido',
      sortable: true,
      render: (value, offer) => (
        <div>
          <div className="font-mono font-semibold">${value.toLocaleString()}</div>
          {offer.proposedPrice && (
            <div className="text-sm text-gray-500">
              Propuesto: ${offer.proposedPrice.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Mensaje',
      render: (value) => (
        <div className="max-w-xs">
          <span className="text-sm text-gray-600">
            {value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'Sin mensaje'}
          </span>
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
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3" />
            Gestión de Ofertas
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las ofertas de profesionales a solicitudes
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
              <CardTitle className="text-sm font-medium">Total Ofertas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.length}</div>
              <p className="text-xs text-muted-foreground">
                {offers.filter(o => o.status === 'PENDING').length} pendientes
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
                {offers.filter(o => o.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren revisión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {offers.filter(o => o.status === 'ACCEPTED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Aprobadas exitosamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${offers.length > 0 ? Math.round(offers.reduce((sum, o) => sum + o.price, 0) / offers.length).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor promedio de ofertas
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
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="ACCEPTED">Aceptada</SelectItem>
                    <SelectItem value="REJECTED">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Profesional, solicitud o mensaje..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offers Table */}
        <DataTable
          data={offers}
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
          actions={(offer) => (
            <EntityActions
              onView={() => handleViewOffer(offer)}
              onApprove={offer.status === 'PENDING' ? () => handleAcceptOffer(offer) : undefined}
              onReject={offer.status === 'PENDING' ? () => handleRejectOffer(offer) : undefined}
              onDelete={() => handleDeleteOffer(offer)}
              showApprove={offer.status === 'PENDING'}
              showReject={offer.status === 'PENDING'}
              approveLabel="Aceptar"
              rejectLabel="Rechazar"
              deleteTitle="¿Eliminar oferta?"
              deleteDescription="¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron ofertas"
        />
      </div>
    </div>
  );
}
