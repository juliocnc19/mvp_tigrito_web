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
  Flag, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  Image,
  FileText,
  Shield,
  Ban
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Report {
  id: string;
  reporterId: string;
  reportedId: string | null;
  serviceId: string | null;
  reason: string;
  proofMedia: any;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  adminNotes: string | null;
  createdAt: string;
  reporter: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
  };
  reportedUser: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: string;
  } | null;
  service: {
    id: string;
    currentStatus: string;
    priceAgreed: number;
    client: {
      id: string;
      name: string | null;
      email: string | null;
    };
    professional: {
      id: string;
      name: string | null;
      email: string | null;
    };
  } | null;
  media: Array<{
    id: string;
    url: string;
    type: string;
    filename: string;
  }>;
}

export default function ReportsManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchReports();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchReports = async () => {
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

      const response = await fetch(`/api/reports/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setReports(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading reports');
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

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (report: Report, newStatus: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/reports/${report.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes,
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Estado del reporte actualizado a ${getStatusLabel(newStatus)}`);
        fetchReports(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al actualizar estado');
      }
    } catch (err) {
      setError('Error de conexión al actualizar estado');
      console.error('Error updating report status:', err);
    }
  };

  const handleDeleteReport = async (report: Report) => {
    if (confirm(`¿Estás seguro de que quieres eliminar este reporte?`)) {
      try {
        setError(null);
        const response = await fetch(`/api/reports/${report.id}/delete`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage(`Reporte eliminado exitosamente`);
          fetchReports(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.error?.message || 'Error al eliminar reporte');
        }
      } catch (err) {
        setError('Error de conexión al eliminar reporte');
        console.error('Error deleting report:', err);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'REVIEWED':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DISMISSED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'REVIEWED':
        return <Badge variant="default">Revisado</Badge>;
      case 'RESOLVED':
        return <Badge variant="default">Resuelto</Badge>;
      case 'DISMISSED':
        return <Badge variant="destructive">Desestimado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'REVIEWED':
        return 'Revisado';
      case 'RESOLVED':
        return 'Resuelto';
      case 'DISMISSED':
        return 'Desestimado';
      default:
        return status;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'FRAUD':
        return 'Fraude';
      case 'INAPPROPRIATE_BEHAVIOR':
        return 'Comportamiento Inapropiado';
      case 'POOR_SERVICE':
        return 'Mal Servicio';
      case 'SCAM':
        return 'Estafa';
      case 'SPAM':
        return 'Spam';
      case 'HARASSMENT':
        return 'Acoso';
      case 'OTHER':
        return 'Otro';
      default:
        return reason;
    }
  };

  const columns: Column<Report>[] = [
    {
      key: 'reporter',
      header: 'Reportador',
      sortable: true,
      render: (value, report) => (
        <div>
          <div className="font-medium">{report.reporter.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{report.reporter.email}</div>
          <div className="text-xs text-gray-400">{report.reporter.role}</div>
        </div>
      ),
    },
    {
      key: 'reportedUser',
      header: 'Reportado',
      sortable: true,
      render: (value, report) => (
        <div>
          <div className="font-medium">{report.reportedUser?.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{report.reportedUser?.email || 'Sin email'}</div>
          <div className="text-xs text-gray-400">{report.reportedUser?.role || 'Sin rol'}</div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Motivo',
      sortable: true,
      render: (value) => (
        <Badge variant="outline">
          {getReasonLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'reason',
      header: 'Motivo',
      render: (value) => (
        <div className="max-w-xs">
          <span className="text-sm text-gray-600">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Servicio',
      render: (value, report) => (
        <div>
          {report.service ? (
            <div>
              <div className="text-sm font-medium">
                ${report.service.priceAgreed.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {report.service.currentStatus}
              </div>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Sin servicio</span>
          )}
        </div>
      ),
    },
    {
      key: 'media',
      header: 'Pruebas',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Image className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value.length}</span>
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
            <Flag className="h-8 w-8 mr-3" />
            Gestión de Reportes
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los reportes de usuarios y transacciones
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
              <CardTitle className="text-sm font-medium">Total Reportes</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                {reports.filter(r => r.status === 'PENDING').length} pendientes
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
                {reports.filter(r => r.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren revisión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'RESOLVED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Procesados exitosamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desestimados</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.status === 'DISMISSED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sin fundamento
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
                    <SelectItem value="REVIEWED">Revisado</SelectItem>
                    <SelectItem value="RESOLVED">Resuelto</SelectItem>
                    <SelectItem value="DISMISSED">Desestimado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Reportador, reportado o motivo..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <DataTable
          data={reports}
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
          actions={(report) => (
            <EntityActions
              onView={() => handleViewReport(report)}
              onApprove={report.status === 'PENDING' ? () => handleUpdateStatus(report, 'REVIEWED') : undefined}
              onReject={report.status === 'PENDING' ? () => handleUpdateStatus(report, 'DISMISSED') : undefined}
              onActivate={report.status === 'REVIEWED' ? () => handleUpdateStatus(report, 'RESOLVED') : undefined}
              onDelete={() => handleDeleteReport(report)}
              showApprove={report.status === 'PENDING'}
              showReject={report.status === 'PENDING'}
              showActivate={report.status === 'REVIEWED'}
              approveLabel="Revisar"
              rejectLabel="Desestimar"
              activateLabel="Resolver"
              deleteTitle="¿Eliminar reporte?"
              deleteDescription="¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron reportes"
        />

        {/* View Report Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Detalles del Reporte</DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                {/* Report Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Reportador</Label>
                    <div className="mt-1">
                      <div className="font-medium">{selectedReport.reporter.name || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-500">{selectedReport.reporter.email}</div>
                      <div className="text-xs text-gray-400">{selectedReport.reporter.role}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Usuario Reportado</Label>
                    <div className="mt-1">
                      <div className="font-medium">{selectedReport.reportedUser?.name || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-500">{selectedReport.reportedUser?.email || 'Sin email'}</div>
                      <div className="text-xs text-gray-400">{selectedReport.reportedUser?.role || 'Sin rol'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Motivo</Label>
                  <div className="mt-1">
                    <Badge variant="outline">
                      {getReasonLabel(selectedReport.reason)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Descripción</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{selectedReport.reason}</p>
                  </div>
                </div>

                {selectedReport.service && (
                  <div>
                    <Label className="text-sm font-medium">Servicio Relacionado</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium">Cliente</div>
                          <div className="text-sm text-gray-600">
                            {selectedReport.service.client.name || selectedReport.service.client.email}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Profesional</div>
                          <div className="text-sm text-gray-600">
                            {selectedReport.service.professional.name || selectedReport.service.professional.email}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Monto</div>
                          <div className="text-sm text-gray-600">
                            ${selectedReport.service.priceAgreed.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Estado</div>
                          <div className="text-sm text-gray-600">
                            {selectedReport.service.currentStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.media.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Pruebas Adjuntas</Label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      {selectedReport.media.map((media) => (
                        <div key={media.id} className="p-2 border rounded-md">
                          <div className="text-sm font-medium">{media.filename}</div>
                          <div className="text-xs text-gray-500">{media.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Notas del Administrador</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Agregar notas del administrador..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => handleUpdateStatus(selectedReport, 'REVIEWED')}>
                    Marcar como Revisado
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleUpdateStatus(selectedReport, 'DISMISSED')}
                  >
                    Desestimar
                  </Button>
                  <Button 
                    onClick={() => handleUpdateStatus(selectedReport, 'RESOLVED')}
                  >
                    Resolver
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
