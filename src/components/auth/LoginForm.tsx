'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { LoginRequestSchema } from '@/lib/schemas/auth';
import type { LoginRequest } from '@/lib/types/auth';
import { useAuth } from '@/hooks/useAuth';
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
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSubmit?: (data: LoginRequest) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { login, loginState, user } = useAuth();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: LoginRequest) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Use Zustand + React Query combined hook
        const result = await login(data.email || '', data.password);

        // Redirect based on user role
        if (result.user.role === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          // Default to client authenticated pages for CLIENT and other roles
          window.location.href = '/(authenticated)';
        }
      }
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Login failed:', err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      disabled={loginState.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={loginState.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loginState.isLoading}>
              {loginState.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            {loginState.error && (
              <Alert variant="destructive">
                <AlertDescriptionList error={loginState.error} />
              </Alert>
            )}

            <div className="space-y-2 text-sm">
              <Link
                href="/forgot-password"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
