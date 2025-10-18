import { useQuery } from '@tanstack/react-query';

export interface Service {
  id: string;
  title: string;
  category: string;
  description?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  reviewCount?: number;
  distance?: number;
  urgent?: boolean;
  location?: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  rating?: number;
  reviewCount?: number;
  responseTime?: string;
  distance?: number;
  verified?: boolean;
}

interface UseServicesOptions {
  category?: string;
  search?: string;
  limit?: number;
}

// Mock services data
const mockServices: Service[] = [
  {
    id: '1',
    title: 'Reparación de fugas urgente',
    category: 'Plomería',
    description: 'Fuga en lavadero',
    priceMin: 5000,
    priceMax: 10000,
    rating: 4.8,
    reviewCount: 24,
    distance: 0.5,
    urgent: true,
  },
  {
    id: '2',
    title: 'Revisión eléctrica general',
    category: 'Electricidad',
    description: 'Inspección completa',
    priceMin: 8000,
    priceMax: 15000,
    rating: 4.6,
    reviewCount: 18,
    distance: 1.2,
    urgent: false,
  },
  {
    id: '3',
    title: 'Limpieza profunda',
    category: 'Limpieza',
    description: 'Casa completa',
    priceMin: 3000,
    priceMax: 5000,
    rating: 4.9,
    reviewCount: 67,
    distance: 2.1,
    urgent: false,
  },
];

// Mock professionals data
const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    specialty: 'Electricista',
    rating: 4.9,
    reviewCount: 142,
    responseTime: '< 1 hora',
    distance: 0.8,
    verified: true,
  },
  {
    id: '2',
    name: 'María García',
    specialty: 'Plomera',
    rating: 4.7,
    reviewCount: 89,
    responseTime: '2 horas',
    distance: 1.5,
    verified: true,
  },
  {
    id: '3',
    name: 'Carlos López',
    specialty: 'Electricista',
    rating: 4.8,
    reviewCount: 156,
    responseTime: '1 hora',
    distance: 0.3,
    verified: true,
  },
];

export function useServices(options?: UseServicesOptions) {
  const query = useQuery({
    queryKey: ['services', options],
    queryFn: async () => {
      // Simulate API call with mock data
      // In production, this would be replaced with actual API calls

      let filteredServices = [...mockServices];
      let filteredProfessionals = [...mockProfessionals];

      // Filter by category if provided
      if (options?.category) {
        filteredServices = filteredServices.filter(
          (s) => s.category.toLowerCase() === options.category?.toLowerCase()
        );
      }

      // Filter by search term if provided
      if (options?.search) {
        const searchLower = options.search.toLowerCase();
        filteredServices = filteredServices.filter(
          (s) =>
            s.title.toLowerCase().includes(searchLower) ||
            s.description?.toLowerCase().includes(searchLower)
        );
        filteredProfessionals = filteredProfessionals.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.specialty.toLowerCase().includes(searchLower)
        );
      }

      // Limit results if specified
      if (options?.limit) {
        filteredServices = filteredServices.slice(0, options.limit);
        filteredProfessionals = filteredProfessionals.slice(0, options.limit);
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        services: filteredServices,
        professionals: filteredProfessionals,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    services: query.data?.services || [],
    professionals: query.data?.professionals || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
}

export function useServiceById(id: string) {
  const query = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      // Simulate API call with mock data
      const found = mockServices.find((s) => s.id === id);
      if (!found) {
        throw new Error('Service not found');
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return found;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    service: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
  };
}
