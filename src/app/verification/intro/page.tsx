'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Shield } from 'lucide-react';

export default function VerificationIntroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verifica tu Identidad
            </CardTitle>
            <CardDescription>
              Aumenta la confianza en tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Beneficios de la verificación:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Acceso a más oportunidades de trabajo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Mayor confianza de los clientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Protección contra fraude</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">
                Requisitos necesarios:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cédula de identidad válida</li>
                <li>• Número de teléfono celular</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Link href="/verification/id" className="block">
                <Button className="w-full">Continuar</Button>
              </Link>
              <Link href="/home" className="block">
                <Button variant="outline" className="w-full">
                  Omitir por ahora
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Puedes completar la verificación más tarde en tu perfil
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
