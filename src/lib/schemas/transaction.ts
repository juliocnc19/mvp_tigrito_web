import { z } from 'zod';
import { ServiceStatusSchema } from './common';

// Service Transaction Schema
export const ServiceTransactionSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  professionalId: z.string(),
  priceAgreed: z.number(),
  discountAmount: z.number(),
  platformFee: z.number(),
  escrowAmount: z.number(),
  currentStatus: ServiceStatusSchema,
  scheduledDate: z.string().datetime().nullable(),
  postingId: z.string().nullable(),
  proServiceId: z.string().nullable(),
  promoCodeId: z.string().nullable(),
  yummyLogistics: z.any().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

// Create Transaction Request
export const CreateTransactionRequestSchema = z.object({
  offerId: z.string(),
  scheduledDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// Update Transaction Status Request
export const UpdateTransactionStatusRequestSchema = z.object({
  status: ServiceStatusSchema,
  notes: z.string().optional(),
});

// Get Transactions Query Schema
export const GetTransactionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  clientId: z.string().optional(),
  professionalId: z.string().optional(),
  status: ServiceStatusSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
