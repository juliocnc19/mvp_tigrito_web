'use client';

import { IDVerificationForm } from '@/components/verification/IDVerificationForm';

export default function IDVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Verificación de Identidad</h1>
          <p className="text-slate-300">Paso 2 de 4 en el proceso de verificación</p>
        </div>
        <div className="flex justify-center">
          <IDVerificationForm />
        </div>
      </div>
    </div>
  );
}
