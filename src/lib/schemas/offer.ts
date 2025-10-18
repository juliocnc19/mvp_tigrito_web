import { z } from 'zod';
import { OfferStatusSchema } from './common';

// Offer Schema
export const OfferSchema = z.object({
  id: z.string(),
  postingId: z.string(),
  professionalId: z.string(),
  price: z.number(),
  message: z.string().nullable(),
  status: OfferStatusSchema,
  createdAt: z.string().datetime(),
});

// Create Offer Request
export const CreateOfferRequestSchema = z.object({
  postingId: z.string(),
  price: z.number().min(0),
  message: z.string().optional(),
});

// Update Offer Status Request
export const UpdateOfferStatusRequestSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
});

// Get Offers Query Schema
export const GetOffersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  postingId: z.string().optional(),
  professionalId: z.string().optional(),
  status: OfferStatusSchema.optional(),
});
