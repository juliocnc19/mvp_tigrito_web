'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, X } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  password: string;
  confirmPassword: string;
  locationAddress: string;
  locationLat: number | null;
  locationLng: number | null;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'CLIENT',
    password: '',
    confirmPassword: '',
    locationAddress: '',
    locationLat: null,
    locationLng: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'El nombre es requerido';
    if (!formData.email.trim()) return 'El email es requerido';
    if (!formData.email.includes('@')) return 'El email debe ser válido';
    if (!formData.phone.trim()) return 'El teléfono es requerido';
    if (!formData.password) return 'La contraseña es requerida';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden';
    if (!formData.role) return 'El rol es requerido';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
        locationAddress: formData.locationAddress.trim() || undefined,
        locationLat: formData.locationLat || undefined,
        locationLng: formData.locationLng || undefined,
      };
      
      console.log('📤 [CreateUserModal] Sending data:', requestData);
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [CreateUserModal] User created successfully:', data);
        onSuccess(data.data);
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('❌ [CreateUserModal] Error response:', errorData);
        setError(errorData.error?.message || 'Error al crear usuario');
      }
    } catch (err) {
      setError('Error de conexión al crear usuario');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CLIENT',
      password: '',
      confirmPassword: '',
      locationAddress: '',
      locationLat: null,
      locationLng: null,
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Crear Nuevo Usuario
          </DialogTitle>
          <DialogDescription>
            Complete la información para crear un nuevo usuario en el sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ej: juan@ejemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Ej: +1234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN') => 
                  handleInputChange('role', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">Cliente</SelectItem>
                  <SelectItem value="PROFESSIONAL">Profesional</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationAddress">Dirección</Label>
            <Input
              id="locationAddress"
              value={formData.locationAddress}
              onChange={(e) => handleInputChange('locationAddress', e.target.value)}
              placeholder="Ej: Calle 123, Ciudad"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Repetir contraseña"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
