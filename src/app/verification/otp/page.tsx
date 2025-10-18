import { Suspense } from 'react';
import { OTPVerificationContent } from './OTPVerificationContent';

export default function OTPVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verificación OTP</h1>
          <p className="text-slate-300">Paso 4 de 4</p>
        </div>
        <Suspense fallback={
          <div className="w-full max-w-md">
            <div className="animate-pulse">
              <div className="h-32 bg-slate-700 rounded-lg"></div>
            </div>
          </div>
        }>
          <OTPVerificationContent />
        </Suspense>
      </div>
    </div>
  );
}
