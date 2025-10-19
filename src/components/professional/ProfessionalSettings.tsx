'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Bell, 
  Shield, 
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';

interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isIDVerified: boolean;
  balance: number;
  joinedAt: string;
  lastActive: string;
}

interface ProfessionalSettingsProps {
  profile: ProfessionalProfile;
}

export function ProfessionalSettings({ profile }: ProfessionalSettingsProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState({
    notifications: {
      newJobs: true,
      messages: true,
      payments: true,
      reviews: true,
      promotions: false
    },
    privacy: {
      showPhone: true,
      showEmail: false,
      showLocation: true,
      showEarnings: false
    },
    work: {
      maxDistance: 20,
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      autoAccept: false,
      minPrice: 5000
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (category: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Guardar configuración:', { formData, settings });
    // Here you would typically save to the backend
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Configuración</h2>
        <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              placeholder="Cuéntanos sobre tu experiencia y especialidades..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="password">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Ingresa tu contraseña actual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirma la nueva contraseña"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Nuevos Trabajos</div>
                <div className="text-sm text-gray-500">Recibe notificaciones cuando haya nuevos trabajos disponibles</div>
              </div>
              <Switch
                checked={settings.notifications.newJobs}
                onCheckedChange={(checked: boolean) => handleSettingChange('notifications', 'newJobs', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mensajes</div>
                <div className="text-sm text-gray-500">Notificaciones de mensajes de clientes</div>
              </div>
              <Switch
                checked={settings.notifications.messages}
                onCheckedChange={(checked: boolean) => handleSettingChange('notifications', 'messages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Pagos</div>
                <div className="text-sm text-gray-500">Notificaciones sobre pagos y retiros</div>
              </div>
              <Switch
                checked={settings.notifications.payments}
                onCheckedChange={(checked: boolean) => handleSettingChange('notifications', 'payments', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Reseñas</div>
                <div className="text-sm text-gray-500">Notificaciones cuando recibas nuevas reseñas</div>
              </div>
              <Switch
                checked={settings.notifications.reviews}
                onCheckedChange={(checked: boolean) => handleSettingChange('notifications', 'reviews', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Promociones</div>
                <div className="text-sm text-gray-500">Ofertas especiales y promociones</div>
              </div>
              <Switch
                checked={settings.notifications.promotions}
                onCheckedChange={(checked: boolean) => handleSettingChange('notifications', 'promotions', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mostrar Teléfono</div>
                <div className="text-sm text-gray-500">Permitir que los clientes vean tu número de teléfono</div>
              </div>
              <Switch
                checked={settings.privacy.showPhone}
                onCheckedChange={(checked: boolean) => handleSettingChange('privacy', 'showPhone', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mostrar Email</div>
                <div className="text-sm text-gray-500">Permitir que los clientes vean tu email</div>
              </div>
              <Switch
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked: boolean) => handleSettingChange('privacy', 'showEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mostrar Ubicación</div>
                <div className="text-sm text-gray-500">Mostrar tu ubicación general a los clientes</div>
              </div>
              <Switch
                checked={settings.privacy.showLocation}
                onCheckedChange={(checked: boolean) => handleSettingChange('privacy', 'showLocation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mostrar Ganancias</div>
                <div className="text-sm text-gray-500">Mostrar estadísticas de ganancias en tu perfil</div>
              </div>
              <Switch
                checked={settings.privacy.showEarnings}
                onCheckedChange={(checked: boolean) => handleSettingChange('privacy', 'showEarnings', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Preferencias de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxDistance">Distancia Máxima (km)</Label>
            <Input
              id="maxDistance"
              type="number"
              value={settings.work.maxDistance}
              onChange={(e) => handleSettingChange('work', 'maxDistance', parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Hora de Inicio</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.work.workingHours.start}
                onChange={(e) => handleSettingChange('work', 'workingHours', {
                  ...settings.work.workingHours,
                  start: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="endTime">Hora de Fin</Label>
              <Input
                id="endTime"
                type="time"
                value={settings.work.workingHours.end}
                onChange={(e) => handleSettingChange('work', 'workingHours', {
                  ...settings.work.workingHours,
                  end: e.target.value
                })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="minPrice">Precio Mínimo (VES)</Label>
            <Input
              id="minPrice"
              type="number"
              value={settings.work.minPrice}
              onChange={(e) => handleSettingChange('work', 'minPrice', parseInt(e.target.value))}
              min="0"
              step="100"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Aceptación Automática</div>
              <div className="text-sm text-gray-500">Aceptar automáticamente trabajos que cumplan tus criterios</div>
            </div>
            <Switch
              checked={settings.work.autoAccept}
              onCheckedChange={(checked: boolean) => handleSettingChange('work', 'autoAccept', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
