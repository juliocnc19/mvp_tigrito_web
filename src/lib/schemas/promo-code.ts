import { z } from 'zod';
import { DiscountTypeSchema } from './common';

// Promo Code Schema
export const PromoCodeSchema = z.object({
  id: z.string(),
  code: z.string(),
  discountType: DiscountTypeSchema,
  discountValue: z.number(),
  maxUses: z.number().nullable(),
  usesCount: z.number(),
  maxUsesPerUser: z.number().nullable(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime().nullable(),
  targetCategory: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});

// Create Promo Code Request
export const CreatePromoCodeRequestSchema = z.object({
  code: z.string().min(3),
  discountType: DiscountTypeSchema,
  discountValue: z.number().min(0),
  maxUses: z.number().min(1).optional(),
  maxUsesPerUser: z.number().min(1).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  targetCategory: z.string().optional(),
});

// Validate Promo Code Request
export const ValidatePromoCodeRequestSchema = z.object({
  code: z.string(),
  userId: z.string(),
  transactionId: z.string(),
});

// Use Promo Code Request
export const UsePromoCodeRequestSchema = z.object({
  transactionId: z.string(),
});

// Get Promo Codes Query Schema
export const GetPromoCodesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  code: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  targetCategory: z.string().optional(),
});
