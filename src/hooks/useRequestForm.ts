import { useState, useCallback } from 'react';

export interface RequestFormData {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  latitude?: number;
  longitude?: number;
  requiredFrom: string;
  requiredTo: string;
  priceMin: number;
  priceMax: number;
  isUrgent: boolean;
  mediaIds: string[];
  notes?: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: RequestFormData = {
  title: '',
  description: '',
  categoryId: '',
  location: '',
  latitude: undefined,
  longitude: undefined,
  requiredFrom: '',
  requiredTo: '',
  priceMin: 0,
  priceMax: 0,
  isUrgent: false,
  mediaIds: [],
  notes: '',
};

export function useRequestForm(onSubmit?: (data: RequestFormData) => Promise<void>) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RequestFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = useCallback((currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'El título es requerido';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        if (!formData.categoryId) newErrors.categoryId = 'Selecciona una categoría';
        break;

      case 2:
        if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
        if (!formData.requiredFrom) newErrors.requiredFrom = 'La fecha es requerida';
        if (!formData.requiredTo) newErrors.requiredTo = 'La hora es requerida';
        break;

      case 3:
        if (formData.priceMin < 0) newErrors.priceMin = 'El precio no puede ser negativo';
        if (formData.priceMax < formData.priceMin) {
          newErrors.priceMax = 'El precio máximo no puede ser menor que el mínimo';
        }
        break;

      case 4:
        // Final validation
        if (!formData.title || !formData.description || !formData.categoryId) {
          newErrors.general = 'Por favor completa todos los campos requeridos';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const updateField = useCallback((field: keyof RequestFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  }, [step, validateStep]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(4)) {
      return;
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setFormData(initialFormData);
      setStep(1);
    } catch (error) {
      setErrors({ submit: 'Error al publicar la solicitud. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, onSubmit, validateStep]);

  const reset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setStep(1);
  }, []);

  return {
    step,
    formData,
    errors,
    isLoading,
    updateField,
    nextStep,
    prevStep,
    handleSubmit,
    reset,
    setFormData,
  };
}
