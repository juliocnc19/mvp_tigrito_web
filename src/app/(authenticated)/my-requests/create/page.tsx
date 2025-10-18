'use client';

import React, { useState } from 'react';

export default function CreateRequestPage() {
  // TODO: 2.1.1 - RequestForm Component (multi-step)
  // TODO: 2.1.2 - CategorySelector Component
  // TODO: 2.1.3 - LocationPicker Component
  // TODO: 2.1.4 - DateTimePicker Component
  // TODO: 2.1.5 - MediaUpload Component
  // TODO: 2.1.6 - PriceRangeSlider Component
  // TODO: 2.1.7 - UrgencyToggle Component

  const [step, setStep] = useState(1);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Crear Nueva Solicitud</h1>

      {/* Progress Indicator */}
      <div className="mb-8 flex justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full mx-1 ${
              s <= step ? 'bg-primary' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>

      {/* Form Steps */}
      <form className="space-y-6">
        {/* Step 1: Basic Info */}
        {step >= 1 && (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
            {/* TODO: RequestForm basic fields */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Título de la Solicitud</label>
                <input
                  type="text"
                  placeholder="Ej: Plomería urgente"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Descripción</label>
                <textarea
                  placeholder="Describe el problema en detalle..."
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2">Categoría</label>
                {/* TODO: CategorySelector Component */}
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Selecciona una categoría</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Location & Time */}
        {step >= 2 && (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Ubicación y Tiempo</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Ubicación</label>
                {/* TODO: LocationPicker Component */}
                <input
                  type="text"
                  placeholder="Dirección..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Fecha</label>
                  {/* TODO: DateTimePicker Component */}
                  <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Hora</label>
                  <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Budget & Media */}
        {step >= 3 && (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Presupuesto y Archivos</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Rango de Precio</label>
                {/* TODO: PriceRangeSlider Component */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Adjuntar Fotos/Videos (Opcional)</label>
                {/* TODO: MediaUpload Component */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-gray-600">Arrastra archivos aquí o haz clic para seleccionar</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Urgency & Review */}
        {step >= 4 && (
          <section className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Urgencia y Revisión</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">¿Es urgente?</label>
                {/* TODO: UrgencyToggle Component */}
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Revisa los detalles de tu solicitud antes de publicar.</p>
              </div>
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            className="px-6 py-2 border rounded-lg"
            disabled={step === 1}
          >
            Atrás
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Publicar Solicitud
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
