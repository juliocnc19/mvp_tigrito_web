'use client';

import React from 'react';

export default function ProfilePage() {
  // TODO: User profile data fetching
  // TODO: ProfileHeader Component
  // TODO: RoleToggle Component
  // TODO: ProfileMenuItems

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Perfil</h1>

      {/* Profile Header */}
      <section className="bg-card rounded-lg p-6 mb-6">
        {/* TODO: ProfileHeader Component */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Nombre del Usuario</h2>
          <p className="text-gray-600">Cliente Verificado</p>
        </div>
      </section>

      {/* Role Toggle */}
      <section className="bg-card rounded-lg p-6 mb-6">
        {/* TODO: RoleToggle Component */}
        <div className="flex justify-between items-center">
          <span className="font-semibold">Soy un profesional</span>
          <button className="px-4 py-2 bg-gray-300 rounded-lg">Toggle</button>
        </div>
      </section>

      {/* Menu Items */}
      <section className="space-y-3">
        {/* TODO: ProfileMenuItem Components */}
        <div className="bg-card rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <span>Saldo y Pagos</span>
          <span>→</span>
        </div>
        <div className="bg-card rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <span>Historial de Servicios</span>
          <span>→</span>
        </div>
        <div className="bg-card rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <span>Configuración</span>
          <span>→</span>
        </div>
        <div className="bg-card rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
          <span>Cerrar Sesión</span>
          <span>→</span>
        </div>
      </section>
    </div>
  );
}
