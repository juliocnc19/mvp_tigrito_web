import { useQuery } from '@tanstack/react-query';
import type { GetServicePostingsQuerySchema, ServicePostingsListResponseSchema } from '@/lib/schemas/service';

type ServicePostingsQuery = {
  page?: number;
  limit?: number;
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  sortBy?: 'budget' | 'recent' | 'deadline';
  sortDirection?: 'asc' | 'desc';
};

export function useServicePostings(params?: ServicePostingsQuery) {
  return useQuery({
    queryKey: ['servicePostings', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.set(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/services/postings/list?${searchParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch service postings');
      }

      const data = await response.json();
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
