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
  Gift, 
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
  ToggleRight,
  Calendar,
  Users,
  TrendingUp
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses: number | null;
  usesCount: number;
  maxUsesPerUser: number | null;
  validFrom: string;
  validUntil: string | null;
  targetCategory: string | null;
  isActive: boolean;
  createdAt: string;
  usageHistory: Array<{
    id: string;
    userId: string;
    usedAt: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }>;
  totalUses: number;
  totalTransactions: number;
}

export default function PromoCodesManagementPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
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
    discountType: 'all',
    search: '',
  });
  const [sorting, setSorting] = useState({
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    discountValue: 0,
    maxUses: '',
    maxUsesPerUser: '',
    validFrom: '',
    validUntil: '',
    targetCategory: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPromoCodes();
  }, [pagination.page, pagination.limit, filters, sorting]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.isActive && filters.isActive !== 'all' && { isActive: filters.isActive }),
        ...(filters.discountType && filters.discountType !== 'all' && { discountType: filters.discountType }),
        ...(filters.search && { search: filters.search }),
        ...(sorting.sortBy && { sortBy: sorting.sortBy }),
        ...(sorting.sortDirection && { sortDirection: sorting.sortDirection }),
      });

      const response = await fetch(`/api/promo-codes/list?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch promo codes');
      }
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      setPromoCodes(data.data || []);
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading promo codes');
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

  const handleViewPromoCode = (promoCode: PromoCode) => {
    console.log('View promo code:', promoCode);
    // Implement view promo code modal or navigation
  };

  const handleEditPromoCode = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setFormData({
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      maxUses: promoCode.maxUses?.toString() || '',
      maxUsesPerUser: promoCode.maxUsesPerUser?.toString() || '',
      validFrom: promoCode.validFrom.split('T')[0],
      validUntil: promoCode.validUntil?.split('T')[0] || '',
      targetCategory: promoCode.targetCategory || '',
      isActive: promoCode.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleDeletePromoCode = async (promoCode: PromoCode) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el código "${promoCode.code}"?`)) {
      try {
        setError(null);
        const response = await fetch(`/api/promo-codes/${promoCode.id}/delete`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSuccessMessage(`Código "${promoCode.code}" eliminado exitosamente`);
          fetchPromoCodes(); // Refresh the list
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          const errorData = await response.json();
          setError(errorData.error?.message || 'Error al eliminar código');
        }
      } catch (err) {
        setError('Error de conexión al eliminar código');
        console.error('Error deleting promo code:', err);
      }
    }
  };

  const handleToggleActive = async (promoCode: PromoCode) => {
    try {
      setError(null);
      const response = await fetch(`/api/promo-codes/${promoCode.id}/toggle-active`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        setSuccessMessage(`Código "${promoCode.code}" ${!promoCode.isActive ? 'activado' : 'desactivado'} exitosamente`);
        fetchPromoCodes(); // Refresh the list
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al cambiar estado del código');
      }
    } catch (err) {
      setError('Error de conexión al cambiar estado del código');
      console.error('Error toggling promo code:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      maxUses: '',
      maxUsesPerUser: '',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      targetCategory: '',
      isActive: true,
    });
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePromoCode = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleSubmitCreate = async () => {
    try {
      setError(null);
      const response = await fetch('/api/promo-codes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
          maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : undefined,
          validFrom: formData.validFrom || undefined,
          validUntil: formData.validUntil || undefined,
          targetCategory: formData.targetCategory || undefined,
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Código "${formData.code}" creado exitosamente`);
        setIsCreateModalOpen(false);
        resetForm();
        fetchPromoCodes();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al crear código');
      }
    } catch (err) {
      setError('Error de conexión al crear código');
      console.error('Error creating promo code:', err);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editingPromoCode) return;
    
    try {
      setError(null);
      const response = await fetch(`/api/promo-codes/${editingPromoCode.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
          maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : undefined,
          validFrom: formData.validFrom || undefined,
          validUntil: formData.validUntil || undefined,
          targetCategory: formData.targetCategory || undefined,
        }),
      });
      
      if (response.ok) {
        setSuccessMessage(`Código "${formData.code}" actualizado exitosamente`);
        setIsEditModalOpen(false);
        setEditingPromoCode(null);
        resetForm();
        fetchPromoCodes();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Error al actualizar código');
      }
    } catch (err) {
      setError('Error de conexión al actualizar código');
      console.error('Error updating promo code:', err);
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

  const getDiscountTypeLabel = (type: string) => {
    return type === 'PERCENTAGE' ? 'Porcentaje' : 'Monto Fijo';
  };

  const getDiscountDisplay = (type: string, value: number) => {
    return type === 'PERCENTAGE' ? `${value}%` : `$${value.toLocaleString()}`;
  };

  const isExpired = (validUntil: string | null) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const columns: Column<PromoCode>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      render: (value, promoCode) => (
        <div>
          <div className="font-mono font-semibold">{value}</div>
          <div className="text-sm text-gray-500">
            {promoCode.targetCategory || 'Todas las categorías'}
          </div>
        </div>
      ),
    },
    {
      key: 'discountType',
      header: 'Descuento',
      sortable: true,
      render: (value, promoCode) => (
        <div>
          <div className="font-medium">{getDiscountDisplay(value, promoCode.discountValue)}</div>
          <div className="text-sm text-gray-500">{getDiscountTypeLabel(value)}</div>
        </div>
      ),
    },
    {
      key: 'usesCount',
      header: 'Uso',
      sortable: true,
      render: (value, promoCode) => (
        <div>
          <div className="font-medium">{value} / {promoCode.maxUses || '∞'}</div>
          <div className="text-sm text-gray-500">
            {promoCode.maxUsesPerUser ? `Máx: ${promoCode.maxUsesPerUser}/usuario` : 'Sin límite por usuario'}
          </div>
        </div>
      ),
    },
    {
      key: 'validFrom',
      header: 'Válido',
      sortable: true,
      render: (value, promoCode) => (
        <div>
          <div className="text-sm">
            Desde: {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            {promoCode.validUntil ? (
              <>
                Hasta: {new Date(promoCode.validUntil).toLocaleDateString()}
                {isExpired(promoCode.validUntil) && (
                  <Badge variant="destructive" className="ml-2">Expirado</Badge>
                )}
              </>
            ) : (
              'Sin vencimiento'
            )}
          </div>
        </div>
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
      key: 'totalUses',
      header: 'Estadísticas',
      sortable: true,
      render: (value, promoCode) => (
        <div>
          <div className="text-sm font-medium">{value} usos totales</div>
          <div className="text-xs text-gray-500">
            {promoCode.totalTransactions} transacciones
          </div>
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
                <Gift className="h-8 w-8 mr-3" />
                Gestión de Códigos de Promoción
              </h1>
              <p className="text-gray-600 mt-2">
                Administra los códigos de descuento y promociones
              </p>
            </div>
            <Button onClick={handleCreatePromoCode}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Código
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
              <CardTitle className="text-sm font-medium">Total Códigos</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promoCodes.length}</div>
              <p className="text-xs text-muted-foreground">
                {promoCodes.filter(p => p.isActive).length} activos
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
                {promoCodes.filter(p => p.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Disponibles para usar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usos Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {promoCodes.reduce((sum, p) => sum + p.totalUses, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Veces utilizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {promoCodes.reduce((sum, p) => sum + p.totalTransactions, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Con códigos aplicados
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
                <label className="text-sm font-medium mb-2 block">Tipo de Descuento</label>
                <Select
                  value={filters.discountType}
                  onValueChange={(value: string) => handleFilter({ discountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="PERCENTAGE">Porcentaje</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Monto Fijo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Código o categoría..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promo Codes Table */}
        <DataTable
          data={promoCodes}
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
          actions={(promoCode) => (
            <EntityActions
              onView={() => handleViewPromoCode(promoCode)}
              onEdit={() => handleEditPromoCode(promoCode)}
              onDelete={() => handleDeletePromoCode(promoCode)}
              onActivate={!promoCode.isActive ? () => handleToggleActive(promoCode) : undefined}
              onDeactivate={promoCode.isActive ? () => handleToggleActive(promoCode) : undefined}
              showActivate={!promoCode.isActive}
              showDeactivate={promoCode.isActive}
              activateLabel="Activar"
              deactivateLabel="Desactivar"
              deleteTitle="¿Eliminar código de promoción?"
              deleteDescription="¿Estás seguro de que quieres eliminar este código de promoción? Esta acción no se puede deshacer."
            />
          )}
          emptyMessage="No se encontraron códigos de promoción"
        />

        {/* Create Promo Code Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nuevo Código de Promoción</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Ej: DESCUENTO20"
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">Tipo de Descuento *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => handleInputChange('discountType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Porcentaje</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Monto Fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountValue">Valor de Descuento *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="targetCategory">Categoría Objetivo</Label>
                  <Input
                    id="targetCategory"
                    value={formData.targetCategory}
                    onChange={(e) => handleInputChange('targetCategory', e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxUses">Máximo de Usos</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => handleInputChange('maxUses', e.target.value)}
                    placeholder="Sin límite"
                  />
                </div>
                <div>
                  <Label htmlFor="maxUsesPerUser">Máximo por Usuario</Label>
                  <Input
                    id="maxUsesPerUser"
                    type="number"
                    value={formData.maxUsesPerUser}
                    onChange={(e) => handleInputChange('maxUsesPerUser', e.target.value)}
                    placeholder="Sin límite"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Válido Desde</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Válido Hasta</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  />
                </div>
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

        {/* Edit Promo Code Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Código de Promoción</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-code">Código *</Label>
                  <Input
                    id="edit-code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Ej: DESCUENTO20"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-discountType">Tipo de Descuento *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => handleInputChange('discountType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Porcentaje</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Monto Fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-discountValue">Valor de Descuento *</Label>
                  <Input
                    id="edit-discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-targetCategory">Categoría Objetivo</Label>
                  <Input
                    id="edit-targetCategory"
                    value={formData.targetCategory}
                    onChange={(e) => handleInputChange('targetCategory', e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-maxUses">Máximo de Usos</Label>
                  <Input
                    id="edit-maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => handleInputChange('maxUses', e.target.value)}
                    placeholder="Sin límite"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxUsesPerUser">Máximo por Usuario</Label>
                  <Input
                    id="edit-maxUsesPerUser"
                    type="number"
                    value={formData.maxUsesPerUser}
                    onChange={(e) => handleInputChange('maxUsesPerUser', e.target.value)}
                    placeholder="Sin límite"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-validFrom">Válido Desde</Label>
                  <Input
                    id="edit-validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-validUntil">Válido Hasta</Label>
                  <Input
                    id="edit-validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => handleInputChange('validUntil', e.target.value)}
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
