'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/authStore';

interface Transaction {
  id: string;
  clientId: string;
  professionalId: string;
  servicePostingId: string | null;
  professionalServiceId: string | null;
  agreedPrice: number;
  currentStatus: 'PENDING_SOLICITUD' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  scheduledDate: string | null;
  notes: string | null;
  promoCodeId: string | null;
  createdAt: string;
  updatedAt: string;
  servicePosting?: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  professionalService?: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  client?: {
    id: string;
    name: string;
    email: string;
  };
  professional?: {
    id: string;
    name: string;
    email: string;
  };
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

interface UseTransactionsParams {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useTransactions(params: UseTransactionsParams = {}) {
  const userId = useAuthStore((state) => state.user?.id);
  const { page = 1, limit = 10, status, dateFrom, dateTo } = params;

  return useQuery<TransactionsResponse>({
    queryKey: ['transactions', userId, page, limit, status, dateFrom, dateTo],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const searchParams = new URLSearchParams({
        userId,
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });

      const response = await fetch(`/api/services/transactions/list?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
