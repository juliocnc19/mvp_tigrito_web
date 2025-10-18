'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescriptionList } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useVerifyOTP } from '@/hooks/verification';

interface OTPVerificationFormProps {
  phoneNumber: string;
  onSubmit?: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
}

export function OTPVerificationForm({
  phoneNumber,
  onSubmit,
  onResend,
}: OTPVerificationFormProps) {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);

  const verifyOTPMutation = useVerifyOTP();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode.trim()) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (onSubmit) {
        await onSubmit(otpCode);
      } else {
        // Use React Query mutation
        await verifyOTPMutation.mutateAsync({
          phoneNumber,
          otpCode: otpCode.trim(),
        });

        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      }
    } catch (err) {
      // Error is handled by React Query
      console.error('OTP verification failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setCanResend(false);
      setResendCountdown(60);
      setError(null);

      if (onResend) {
        await onResend();
      } else {
        // Default API call to resend OTP
        const response = await fetch('/api/user/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to resend OTP');
        }
      }

      // Countdown timer
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setCanResend(true);
      const message = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(message);
    }
  };

  const displayError = verifyOTPMutation.error?.message || error;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verifica tu Teléfono</CardTitle>
        <CardDescription>
          Ingresa el código enviado a {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <Alert variant="destructive">
              <AlertDescriptionList error={displayError} />
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Código de verificación</label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Ingresa el código"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              disabled={isLoading || verifyOTPMutation.isPending}
              className="text-center text-lg font-bold"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-center">
              Ingresa el código completo enviado por SMS
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || verifyOTPMutation.isPending || !otpCode.trim()}
          >
            {(isLoading || verifyOTPMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              'Verificar Código'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">¿No recibiste el código?</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={!canResend || isLoading || verifyOTPMutation.isPending}
            >
              {canResend ? 'Reenviar código' : `Reintentar en ${resendCountdown}s`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
