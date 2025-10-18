import { z } from 'zod';
import { PostingStatusSchema } from './common';

// Service Posting Schema
export const ServicePostingSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  address: z.string().nullable(),
  requiredFrom: z.string().datetime().nullable(),
  requiredTo: z.string().datetime().nullable(),
  priceMin: z.number().nullable(),
  priceMax: z.number().nullable(),
  status: PostingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
});

// Create Service Posting Request
export const CreateServicePostingRequestSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  categoryId: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
  requiredFrom: z.string().datetime().optional(),
  requiredTo: z.string().datetime().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  mediaIds: z.array(z.string()).optional(),
});

// Update Service Posting Request
export const UpdateServicePostingRequestSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
  requiredFrom: z.string().datetime().optional(),
  requiredTo: z.string().datetime().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  mediaIds: z.array(z.string()).optional(),
});

// Update Posting Status Request
export const UpdatePostingStatusRequestSchema = z.object({
  status: PostingStatusSchema,
});

// Get Postings Query Schema
export const GetPostingsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: PostingStatusSchema.optional(),
  clientId: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
