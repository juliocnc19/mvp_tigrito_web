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
