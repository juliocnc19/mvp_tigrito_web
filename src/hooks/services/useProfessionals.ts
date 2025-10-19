import { useQuery } from '@tanstack/react-query';
import type { GetProfessionalsQuerySchema, ProfessionalsListResponseSchema } from '@/lib/schemas/professional';

type ProfessionalsQuery = {
  page?: number;
  limit?: number;
  specialty?: string;
  minRating?: number;
  maxHourlyRate?: number;
  minExperience?: number;
  isVerified?: boolean;
  search?: string;
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  sortBy?: 'rating' | 'experience' | 'hourlyRate' | 'recent';
  sortDirection?: 'asc' | 'desc';
};

export function useProfessionals(params?: ProfessionalsQuery) {
  return useQuery({
    queryKey: ['professionals', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/professionals/list?${searchParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch professionals');
      }

      const data = await response.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - professionals data can be cached longer
  });
}

// Professional Portfolio Hooks
export function useProfessionalPortfolio(professionalId: string) {
  return useQuery({
    queryKey: ['professional-portfolio', professionalId],
    queryFn: async () => {
      const response = await fetch(`/api/professionals/portfolio/list?professionalId=${professionalId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch portfolio');
      }
      const data = await response.json();
      return data.data;
    },
  });
}

export function useCreateProfessionalPortfolio() {
  return {
    mutateAsync: async (data: any) => {
      // Placeholder implementation
      return null;
    },
    isLoading: false,
    error: null,
  };
}

export function useDeleteProfessionalPortfolio() {
  return {
    mutateAsync: async (id: string) => {
      // Placeholder implementation
      return null;
    },
    isLoading: false,
    isPending: false,
    error: null,
  };
}

export function useUploadPortfolioFiles() {
  return {
    mutateAsync: async (data: any) => {
      // Placeholder implementation
      return null;
    },
    isLoading: false,
    error: null,
  };
}

// Professional Stats Hooks
export function useProfessionalDashboardStats(professionalId: string) {
  return useQuery({
    queryKey: ['professional-dashboard-stats', professionalId],
    queryFn: async () => {
      const response = await fetch(`/api/professionals/stats/dashboard?professionalId=${professionalId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard stats');
      }
      const data = await response.json();
      return data.data;
    },
  });
}

export function useProfessionalEarningsStats(professionalId: string, period?: string) {
  return useQuery({
    queryKey: ['professional-earnings-stats', professionalId, period],
    queryFn: async () => {
      const url = new URL('/api/professionals/stats/earnings', window.location.origin);
      url.searchParams.set('professionalId', professionalId);
      if (period) url.searchParams.set('period', period);
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch earnings stats');
      }
      const data = await response.json();
      return data.data;
    },
  });
}
