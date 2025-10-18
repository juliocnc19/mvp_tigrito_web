import { z } from 'zod';
import { PaymentMethodSchema } from './common';

// User Payment Method Schema
export const UserPaymentMethodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  method: PaymentMethodSchema,
  accountNumber: z.string().nullable(),
  accountAlias: z.string().nullable(),
  idNumber: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  details: z.any().nullable(),
  isVerified: z.boolean(),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create Payment Method Request
export const CreatePaymentMethodRequestSchema = z.object({
  method: PaymentMethodSchema,
  accountNumber: z.string().optional(),
  accountAlias: z.string().optional(),
  idNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  details: z.any().optional(),
  isDefault: z.boolean().default(false),
});

// Update Payment Method Request
export const UpdatePaymentMethodRequestSchema = z.object({
  accountNumber: z.string().optional(),
  accountAlias: z.string().optional(),
  idNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  details: z.any().optional(),
  isDefault: z.boolean().optional(),
});
