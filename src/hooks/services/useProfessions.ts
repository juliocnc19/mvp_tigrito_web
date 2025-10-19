'use client';

import { useQuery } from '@tanstack/react-query';

interface Profession {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

interface ProfessionsResponse {
  data: Profession[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseProfessionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useProfessions(params: UseProfessionsParams = {}) {
  const { page = 1, limit = 50, search } = params;

  return useQuery<ProfessionsResponse>({
    queryKey: ['professions', page, limit, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/professions/list?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch professions');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
