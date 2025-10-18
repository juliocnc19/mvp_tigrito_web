'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { PhoneVerificationRequestSchema } from '@/lib/schemas/verification';
import type { PhoneVerificationRequest } from '@/lib/types/verification';
import { useSendOTP } from '@/hooks/verification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescriptionList } from '@/components/ui/alert';
import { Loader2, Phone } from 'lucide-react';

interface PhoneVerificationFormProps {
  onSubmit?: (data: PhoneVerificationRequest) => Promise<void>;
}

export function PhoneVerificationForm({ onSubmit }: PhoneVerificationFormProps) {
  const sendOTPMutation = useSendOTP();

  const form = useForm<PhoneVerificationRequest>({
    resolver: zodResolver(PhoneVerificationRequestSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const handleSubmit = async (data: PhoneVerificationRequest) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Use React Query mutation
        await sendOTPMutation.mutateAsync(data);

        // Redirect to OTP verification page on success
        const encodedPhone = encodeURIComponent(data.phoneNumber);
        window.location.href = `/verification/otp?phone=${encodedPhone}`;
      }
    } catch (err) {
      // Error is handled by React Query
      console.error('Failed to send OTP:', err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Ingresa tu Teléfono
        </CardTitle>
        <CardDescription>
          Verificaremos tu número con un código OTP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {sendOTPMutation.isError && (
              <Alert variant="destructive">
                <AlertDescriptionList
                  error={
                    sendOTPMutation.error instanceof Error
                      ? sendOTPMutation.error.message
                      : 'Ha ocurrido un error inesperado'
                  }
                />
              </Alert>
            )}

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="04120386216"
                      disabled={sendOTPMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-2">
                    Formato: 04XXXXXXXXX (11 dígitos)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Recibirás un código de verificación por SMS
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={sendOTPMutation.isPending}>
              {sendOTPMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando código...
                </>
              ) : (
                'Enviar Código'
              )}
            </Button>

            <Link href="/verification/id" className="block text-center">
              <Button variant="outline" className="w-full" type="button">
                Volver
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
