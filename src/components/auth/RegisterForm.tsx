'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';
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

// Enhanced Register Schema with password confirmation
const RegisterFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un correo válido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'La contraseña debe contener al menos un carácter especial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => Promise<void>;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { register, registerState } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;

      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Use Zustand + React Query combined hook
        await register(registerData.name, registerData.email, registerData.password);

        // Redirect to verification on success
        window.location.href = '/verification/intro';
      }
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Registration failed:', err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear Cuenta</CardTitle>
        <CardDescription>Registrate para acceder a UnTigrito®</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {registerState.error && (
              <Alert variant="destructive">
                <AlertDescriptionList error={registerState.error} />
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Luis Jose"
                      disabled={registerState.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={registerState.isLoading}
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
                      disabled={registerState.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      disabled={registerState.isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={registerState.isLoading}>
              {registerState.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
                Iniciar Sesión
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
