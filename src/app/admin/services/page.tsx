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
  Settings, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  DollarSign,
  Plus,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfessionalService {
  id: string;
  professionalId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  serviceLocations: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  professionalProfileId: string | null;
  professional: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  ProfessionalProfile?: {
    id: string;
    bio: string | null;
    rating: number | null;
    ratingCount: number;
  };
  media?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    isActive: 'all',
    category: 'all',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProfessionalService | null>(null);
  const [formData, setFormData] = useState({
    professionalId: '',
    title: '',
    slug: '',
    description: '',
    price: 0,
    categoryId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchServices();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.isActive && filters.isActive !== 'all' && { isActive: filters.isActive }),
        ...(filters.category && filters.category !== 'all' && { categoryId: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/services/professional-services/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setServices(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading services');
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

  const handleViewService = (service: ProfessionalService) => {
    console.log('View service:', service);
    // Implement view service modal or navigation
  };

  const handleEditService = (service: ProfessionalService) => {
    setEditingService(service);
    setFormData({
      professionalId: service.professionalId,
      title: service.title,
      slug: service.slug,
      description: service.description,
      price: service.price,
      categoryId: service.categoryId,
      isActive: service.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteService = async (service: ProfessionalService) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.title}"?`)) {
      try {
        setError(null);
        const response = await fetch(`/api/services/professional-services/${service.id}/delete`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage(`Servicio "${service.title}" eliminado exitosamente`);
          fetchServices(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.error?.message || 'Error al eliminar servicio');
        }
      } catch (err) {
        setError('Error de conexión al eliminar servicio');
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleToggleActive = async (service: ProfessionalService) => {
    try {
      setError(null);
      const response = await fetch(`/api/services/professional-services/${service.id}/toggle-active`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setSuccessMessage(`Servicio "${service.title}" ${!service.isActive ? 'activado' : 'desactivado'} exitosamente`);
        fetchServices(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al cambiar estado del servicio');
      }
    } catch (err) {
      setError('Error de conexión al cambiar estado del servicio');
      console.error('Error toggling service:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      professionalId: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      categoryId: '',
      isActive: true,
    });
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = String(value)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleCreateService = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setError(null);
      const response = await fetch('/api/services/professional-services/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSuccessMessage(`Servicio "${formData.title}" creado exitosamente`);
        setIsCreateModalOpen(false);
        resetForm();
        fetchServices();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al crear servicio');
      }
    } catch (err) {
      setError('Error de conexión al crear servicio');
      console.error('Error creating service:', err);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingService) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/services/professional-services/${editingService.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSuccessMessage(`Servicio "${formData.title}" actualizado exitosamente`);
        setIsEditModalOpen(false);
        setEditingService(null);
        resetForm();
        fetchServices();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al actualizar servicio');
      }
    } catch (err) {
      setError('Error de conexión al actualizar servicio');
      console.error('Error updating service:', err);
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  const columns: Column<ProfessionalService>[] = [
    {
      key: 'title',
      header: 'Servicio',
      sortable: true,
      render: (value, service) => (
        <div>
          <div className="font-medium">{service.title}</div>
          <div className="text-sm text-gray-500">/{service.slug}</div>
          <div className="text-xs text-gray-400">
            {service.description.length > 100 
              ? `${service.description.substring(0, 100)}...` 
              : service.description}
          </div>
        </div>
      ),
    },
    {
      key: 'professional',
      header: 'Profesional',
      sortable: true,
      render: (value, service) => (
        <div>
          <div className="font-medium">{service.professional.name || 'Sin nombre'}</div>
          <div className="text-sm text-gray-500">{service.professional.email}</div>
          {service.professional.phone && (
            <div className="text-sm text-gray-500">{service.professional.phone}</div>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      sortable: true,
      render: (value, service) => (
        <Badge variant="outline">
          {service.category.name}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Precio',
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold">${value.toLocaleString()}</span>
      ),
    },
    {
      key: 'isActive',
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3" />
                Gestión de Servicios
              </h1>
              <p className="text-gray-600 mt-2">
                Administra los servicios ofrecidos por profesionales
              </p>
            </div>
            <Button onClick={handleCreateService}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
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
              <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">
                {services.filter(s => s.isActive).length} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Disponibles para contratar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => !s.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Deshabilitados temporalmente
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
                ${services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor promedio de servicios
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
                  value={filters.isActive}
                  onValueChange={(value: string) => handleFilter({ isActive: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="true">Activos</SelectItem>
                    <SelectItem value="false">Inactivos</SelectItem>
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
                    placeholder="Título, profesional o descripción..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <DataTable
          data={services}
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
          actions={(service) => (
            <EntityActions
              onView={() => handleViewService(service)}
              onEdit={() => handleEditService(service)}
              onDelete={() => handleDeleteService(service)}
              onActivate={!service.isActive ? () => handleToggleActive(service) : undefined}
              onDeactivate={service.isActive ? () => handleToggleActive(service) : undefined}
              showActivate={!service.isActive}
              showDeactivate={service.isActive}
              activateLabel="Activar"
              deactivateLabel="Desactivar"
              deleteTitle="¿Eliminar servicio?"
              deleteDescription="¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron servicios"
        />

        {/* Create Service Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nuevo Servicio</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Reparación de plomería"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="reparacion-plomeria"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción detallada del servicio..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="professionalId">ID Profesional *</Label>
                  <Input
                    id="professionalId"
                    value={formData.professionalId}
                    onChange={(e) => handleInputChange('professionalId', e.target.value)}
                    placeholder="ID del profesional"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="categoryId">ID Categoría *</Label>
                <Input
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  placeholder="ID de la categoría"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitCreate}>
                Crear
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Service Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Servicio</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Título *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: Reparación de plomería"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-slug">Slug *</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="reparacion-plomeria"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Descripción *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción detallada del servicio..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Precio *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-categoryId">ID Categoría *</Label>
                  <Input
                    id="edit-categoryId"
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    placeholder="ID de la categoría"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitEdit}>
                Actualizar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
