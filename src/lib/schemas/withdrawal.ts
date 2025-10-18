import { z } from 'zod';
import { WithdrawalStatusSchema } from './common';

// Withdrawal Schema
export const WithdrawalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  paymentMethodId: z.string(),
  amount: z.number(),
  status: WithdrawalStatusSchema,
  requestedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  adminNotes: z.string().nullable(),
  rejectionReason: z.string().nullable(),
});

// Create Withdrawal Request
export const CreateWithdrawalRequestSchema = z.object({
  paymentMethodId: z.string(),
  amount: z.number().min(0.01),
});

// Update Withdrawal Status Request
export const UpdateWithdrawalStatusRequestSchema = z.object({
  status: z.enum(['COMPLETED', 'FAILED']),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

// Get Withdrawals Query Schema
export const GetWithdrawalsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  userId: z.string().optional(),
  status: WithdrawalStatusSchema.optional(),
});
