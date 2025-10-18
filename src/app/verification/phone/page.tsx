'use client';

import { PhoneVerificationForm } from '@/components/verification/PhoneVerificationForm';

export default function PhoneVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verificación de Teléfono</h1>
          <p className="text-slate-300">Paso 3 de 4</p>
        </div>
        <PhoneVerificationForm />
      </div>
    </div>
  );
}
