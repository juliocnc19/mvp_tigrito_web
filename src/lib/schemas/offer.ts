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
  proposedPrice: z.number().nullable(),
});

// Create Offer Request
export const CreateOfferRequestSchema = z.object({
  postingId: z.string(),
  price: z.number().min(0),
  message: z.string().optional(),
  proposedPrice: z.number().min(0).optional(),
});

// Update Offer Request
export const UpdateOfferRequestSchema = z.object({
  price: z.number().min(0).optional(),
  message: z.string().optional(),
  proposedPrice: z.number().min(0).optional(),
  status: OfferStatusSchema.optional(),
});

// Get Offers Query Schema
export const GetOffersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  postingId: z.string().optional(),
  professionalId: z.string().optional(),
  status: OfferStatusSchema.optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

// Offer with Relations Schema
export const OfferWithRelationsSchema = OfferSchema.extend({
  posting: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    budget: z.number().nullable(),
    status: z.string(),
    client: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string().nullable(),
    }),
  }).optional(),
  professional: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    professionalProfile: z.object({
      id: z.string(),
      rating: z.number().nullable(),
      ratingCount: z.number(),
    }).nullable(),
  }).optional(),
});

// Offers List Response Schema
export const OffersListResponseSchema = z.object({
  offers: z.array(OfferWithRelationsSchema),
  total: z.number(),
});