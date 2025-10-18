import { z } from 'zod';
import { PaymentStatusSchema, PaymentMethodSchema } from './common';

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  transactionId: z.string().nullable(),
  amount: z.number(),
  fee: z.number(),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema,
  details: z.any().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create Payment Request
export const CreatePaymentRequestSchema = z.object({
  transactionId: z.string(),
  amount: z.number().min(0),
  method: PaymentMethodSchema,
  details: z.any().optional(),
});

// Process Payment Request
export const ProcessPaymentRequestSchema = z.object({
  paymentDetails: z.any(),
});

// Refund Payment Request
export const RefundPaymentRequestSchema = z.object({
  reason: z.string().optional(),
  amount: z.number().min(0).optional(),
});

// Get Payments Query Schema
export const GetPaymentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  userId: z.string().optional(),
  status: PaymentStatusSchema.optional(),
  method: PaymentMethodSchema.optional(),
});
