'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';

// Local form schema for ID verification
const IDVerificationLocalSchema = z.object({
  cedula: z.string()
    .regex(/^\d{7,8}$/, 'Cédula debe tener 7-8 dígitos'),
});

type IDVerificationLocalData = z.infer<typeof IDVerificationLocalSchema>;

interface IDVerificationFormProps {
  onSubmit?: (data: {
    cedula: string;
    cedulaImage: string;
    faceScanData: string;
  }) => Promise<void>;
}

export function IDVerificationForm({ onSubmit }: IDVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'cedula' | 'image' | 'face' | 'complete'>('cedula');
  const [cedulaImage, setCedulaImage] = useState<string | null>(null);
  const [faceScanData, setFaceScanData] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<IDVerificationLocalData>({
    resolver: zodResolver(IDVerificationLocalSchema),
    defaultValues: {
      cedula: '',
    },
  });

  const handleCedulaSubmit = (data: IDVerificationLocalData) => {
    setStep('image');
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo debe ser menor a 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen (JPG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCedulaImage(event.target?.result as string);
      setError(null);
      setStep('face');
    };
    reader.onerror = () => {
      setError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  const startFaceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara');
    }
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const faceData = canvasRef.current.toDataURL('image/webp');
        setFaceScanData(faceData);
        
        // Stop video stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        
        setStep('complete');
        setError(null);
      }
    }
  };

  const handleFinalSubmit = async () => {
    if (!cedulaImage || !faceScanData) {
      setError('Por favor completa todos los pasos');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (onSubmit) {
        await onSubmit({
          cedula: form.getValues('cedula'),
          cedulaImage,
          faceScanData,
        });
      } else {
        // Default API call
        const response = await fetch('/api/user/verify-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({
            cedula: form.getValues('cedula'),
            cedulaImage,
            faceScanData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Verification failed');
        }

        // Redirect to phone verification
        window.location.href = '/verification/phone';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Verificación de Identidad</CardTitle>
        <CardDescription>Paso 2 de 4</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={step === 'cedula' || step === 'image' || step === 'face' || step === 'complete' ? 'font-bold' : 'text-gray-500'}>
                Cédula
              </span>
              <span className={step === 'image' || step === 'face' || step === 'complete' ? 'font-bold' : 'text-gray-500'}>
                Foto
              </span>
              <span className={step === 'face' || step === 'complete' ? 'font-bold' : 'text-gray-500'}>
                Rostro
              </span>
              <span className={step === 'complete' ? 'font-bold' : 'text-gray-500'}>
                Completar
              </span>
            </div>
            <Progress
              value={
                step === 'cedula'
                  ? 25
                  : step === 'image'
                  ? 50
                  : step === 'face'
                  ? 75
                  : 100
              }
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Cedula */}
          {step === 'cedula' && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCedulaSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Cédula</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="27483383"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Ingresa tu cédula sin puntos ni espacios (7-8 dígitos)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Continuar
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Image Upload */}
          {step === 'image' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="font-medium mb-2">Sube la foto de tu cédula</p>
                <p className="text-sm text-gray-600 mb-4">
                  Formato: JPG o PNG | Máximo: 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Seleccionar archivo
                </Button>
              </div>
              <Button
                type="button"
                onClick={() => setStep('cedula')}
                variant="ghost"
                className="w-full"
              >
                Volver
              </Button>
            </div>
          )}

          {/* Step 3: Face Scan */}
          {step === 'face' && (
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Escanea tu rostro</p>
                <p className="text-sm text-gray-600 mb-4">
                  Colócate frente a la cámara y toma una foto clara de tu rostro
                </p>
                {!faceScanData ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-black"
                      style={{ maxWidth: '320px', height: 'auto', margin: '0 auto' }}
                    />
                    <canvas ref={canvasRef} className="hidden" width={320} height={240} />
                    <Button
                      type="button"
                      onClick={() => startFaceScan()}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Iniciar Cámara
                    </Button>
                    <Button
                      type="button"
                      onClick={captureFace}
                      className="w-full mt-2"
                    >
                      Capturar Foto
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-700">Foto capturada correctamente</span>
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={() => setStep('image')}
                variant="ghost"
                className="w-full"
              >
                Volver
              </Button>
            </div>
          )}

          {/* Step 4: Review & Complete */}
          {step === 'complete' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">Resumen de Verificación</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cédula: {form.getValues('cedula')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Foto de cédula cargada</span>
                  </li>
                  <li className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Foto de rostro capturada</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Próximo paso:</strong> Verificaremos tu número de teléfono con un código OTP
                </p>
              </div>

              <Button
                onClick={handleFinalSubmit}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Continuar a Verificación de Teléfono'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
