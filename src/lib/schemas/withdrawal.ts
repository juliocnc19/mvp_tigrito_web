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
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Withdrawal with Relations Schema
export const WithdrawalWithRelationsSchema = WithdrawalSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  }).optional(),
  paymentMethod: z.object({
    id: z.string(),
    method: z.string(),
    accountAlias: z.string().nullable(),
  }).optional(),
});

// Withdrawals List Response Schema
export const WithdrawalsListResponseSchema = z.object({
  withdrawals: z.array(WithdrawalWithRelationsSchema),
  total: z.number(),
});
