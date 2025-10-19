'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/authStore';

interface ServicePosting {
  id: string;
  title: string;
  description: string;
  category: string;
  locationAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
  priceMin: number | null;
  priceMax: number | null;
  isUrgent: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELED';
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  offers?: Array<{
    id: string;
    professionalId: string;
    price: number;
    notes: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
  }>;
}

interface ServicePostingsResponse {
  servicePostings: ServicePosting[];
  total: number;
  page: number;
  limit: number;
}

interface UseServicePostingsParams {
  page?: number;
  limit?: number;
  category?: string;
  isUrgent?: boolean;
  status?: string;
  search?: string;
  locationLat?: number;
  locationLng?: number;
  radius?: number;
}

export function useServicePostings(params: UseServicePostingsParams = {}) {
  const userId = useAuthStore((state) => state.user?.id);
  const { 
    page = 1, 
    limit = 10, 
    category, 
    isUrgent, 
    status, 
    search, 
    locationLat = 0, // Default value for required parameter
    locationLng = 0, // Default value for required parameter
    radius = 10 // Default radius
  } = params;

  return useQuery<ServicePostingsResponse>({
    queryKey: ['servicePostings', userId, page, limit, category, isUrgent, status, search, locationLat, locationLng, radius],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        locationLat: locationLat.toString(), // Required parameter
        locationLng: locationLng.toString(), // Required parameter
        radius: radius.toString(),
        ...(category && { category }),
        ...(status && { status }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/services/postings/list?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch service postings');
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useMyServicePostings(params: UseServicePostingsParams = {}) {
  const userId = useAuthStore((state) => state.user?.id);
  const { 
    page = 1, 
    limit = 10, 
    category, 
    isUrgent, 
    status, 
    search,
    locationLat = 0, // Default value for required parameter
    locationLng = 0, // Default value for required parameter
    radius = 10 // Default radius
  } = params;

  return useQuery<ServicePostingsResponse>({
    queryKey: ['myServicePostings', userId, page, limit, category, isUrgent, status, search, locationLat, locationLng, radius],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const searchParams = new URLSearchParams({
        userId,
        page: page.toString(),
        limit: limit.toString(),
        locationLat: locationLat.toString(), // Required parameter
        locationLng: locationLng.toString(), // Required parameter
        radius: radius.toString(),
        ...(category && { category }),
        ...(status && { status }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/services/postings/list?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch my service postings');
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}