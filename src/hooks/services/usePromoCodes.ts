'use client';

import { useQuery } from '@tanstack/react-query';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxUses: number;
  usesCount: number;
  maxUsesPerUser: number;
  validFrom: string;
  validUntil: string | null;
  targetCategory: string | null;
  isActive: boolean;
  createdAt: string;
  totalUses: number;
  totalTransactions: number;
}

interface PromoCodesResponse {
  data: PromoCode[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UsePromoCodesParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  discountType?: string;
  search?: string;
}

export function usePromoCodes(params: UsePromoCodesParams = {}) {
  const { page = 1, limit = 10, isActive = true, discountType, search } = params;

  return useQuery<PromoCodesResponse>({
    queryKey: ['promoCodes', page, limit, isActive, discountType, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        isActive: isActive.toString(),
        ...(discountType && { discountType }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/promo-codes/list?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch promo codes');
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for getting active promotions for dashboard
export function useActivePromotions() {
  return usePromoCodes({ 
    limit: 3, 
    isActive: true 
  });
}
