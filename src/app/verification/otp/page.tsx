'use client';

import { useSearchParams } from 'next/navigation';
import { OTPVerificationForm } from '@/components/verification/OTPVerificationForm';

export default function OTPVerificationPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '04120386216';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verificación OTP</h1>
          <p className="text-slate-300">Paso 4 de 4</p>
        </div>
        <OTPVerificationForm phoneNumber={phoneNumber} />
      </div>
    </div>
  );
}
