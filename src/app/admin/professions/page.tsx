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
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  Save,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Profession {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export default function ProfessionsManagementPage() {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProfession, setEditingProfession] = useState<Profession | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    fetchProfessions();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchProfessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/professions/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch professions');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setProfessions(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading professions');
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

  const handleViewProfession = (profession: Profession) => {
    console.log('View profession:', profession);
    // Implement view profession modal or navigation
  };


  const handleDeleteProfession = async (profession: Profession) => {
    try {
      setError(null);
      const response = await fetch(`/api/professions/${profession.id}/delete`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage(`Profesión ${profession.name} eliminada exitosamente`);
        fetchProfessions(); // Refresh the list
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al eliminar profesión');
      }
    } catch (err) {
      setError('Error de conexión al eliminar profesión');
      console.error('Error deleting profession:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleCreateProfession = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEditProfession = (profession: Profession) => {
    setEditingProfession(profession);
    setFormData({
      name: profession.name,
      slug: profession.slug,
      description: profession.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setError(null);
      const response = await fetch('/api/professions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSuccessMessage(`Profesión ${formData.name} creada exitosamente`);
        setIsCreateModalOpen(false);
        resetForm();
        fetchProfessions();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al crear profesión');
      }
    } catch (err) {
      setError('Error de conexión al crear profesión');
      console.error('Error creating profession:', err);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingProfession) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/professions/${editingProfession.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSuccessMessage(`Profesión ${formData.name} actualizada exitosamente`);
        setIsEditModalOpen(false);
        setEditingProfession(null);
        resetForm();
        fetchProfessions();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al actualizar profesión');
      }
    } catch (err) {
      setError('Error de conexión al actualizar profesión');
      console.error('Error updating profession:', err);
    }
  };

  const columns: Column<Profession>[] = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (value, profession) => (
        <div>
          <div className="font-medium">{profession.name}</div>
          <div className="text-sm text-gray-500">/{profession.slug}</div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (value) => (
        <div className="max-w-xs">
          <span className="text-sm text-gray-600">
            {value ? (value.length > 100 ? `${value.substring(0, 100)}...` : value) : 'Sin descripción'}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de Creación',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
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
                <Briefcase className="h-8 w-8 mr-3" />
                Gestión de Profesiones
              </h1>
              <p className="text-gray-600 mt-2">
                Administra las profesiones disponibles en el sistema
              </p>
            </div>
            <Button onClick={handleCreateProfession}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Profesión
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profesiones</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professions.length}</div>
              <p className="text-xs text-muted-foreground">
                Profesiones registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Descripción</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {professions.filter(p => p.description).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Con descripción completa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Descripción</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {professions.filter(p => !p.description).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren descripción
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nombre, slug o descripción..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professions Table */}
        <DataTable
          data={professions}
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
          actions={(profession) => (
            <EntityActions
              onView={() => handleViewProfession(profession)}
              onEdit={() => handleEditProfession(profession)}
              onDelete={() => handleDeleteProfession(profession)}
              deleteTitle="¿Eliminar profesión?"
              deleteDescription={`¿Estás seguro de que quieres eliminar la profesión ${profession.name}? Esta acción no se puede deshacer.`}
            />
          )}
          emptyMessage="No se encontraron profesiones"
        />

        {/* Create Profession Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva Profesión</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                  placeholder="Ej: Plomería"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="col-span-3"
                  placeholder="plomeria"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="col-span-3"
                  placeholder="Descripción de la profesión..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSubmitCreate}>
                <Save className="h-4 w-4 mr-2" />
                Crear
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profession Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Profesión</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                  placeholder="Ej: Plomería"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="col-span-3"
                  placeholder="plomeria"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="col-span-3"
                  placeholder="Descripción de la profesión..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSubmitEdit}>
                <Save className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
