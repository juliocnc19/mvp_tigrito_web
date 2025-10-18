'use client';

import { useSearchParams } from 'next/navigation';
import { OTPVerificationForm } from '@/components/verification/OTPVerificationForm';

export function OTPVerificationContent() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '04120386216';

  return <OTPVerificationForm phoneNumber={phoneNumber} />;
}
