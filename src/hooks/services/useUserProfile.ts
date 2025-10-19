'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/authStore';

interface UserProfileResponse {
  user: {
    id: string;
    email: string | null;
    phone: string | null;
    name: string | null;
    role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
    isVerified: boolean;
    isIDVerified: boolean;
    balance: number;
    isSuspended: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    locationLat: number | null;
    locationLng: number | null;
    locationAddress: string | null;
  };
}

export function useUserProfile() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`/api/users/profile?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
