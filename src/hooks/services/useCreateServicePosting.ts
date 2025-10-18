import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateServicePostingRequestSchema, ServicePostingResponseSchema } from '@/lib/schemas/service';

type CreateServicePostingVariables = {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline?: string;
  location?: string;
  locationLat?: number;
  locationLng?: number;
};

export function useCreateServicePosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: CreateServicePostingVariables) => {
      const response = await fetch('/api/services/postings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service posting');
      }

      const data = await response.json();
      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch service postings
      queryClient.invalidateQueries({ queryKey: ['servicePostings'] });
    },
  });
}
