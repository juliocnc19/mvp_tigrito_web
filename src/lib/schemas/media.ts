import { z } from 'zod';
import { MediaTypeSchema } from './common';

// Media Schema
export const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: MediaTypeSchema,
  filename: z.string().nullable(),
  sizeBytes: z.number().nullable(),
  uploadedById: z.string().nullable(),
  postingId: z.string().nullable(),
  proServiceId: z.string().nullable(),
  transactionId: z.string().nullable(),
  reportId: z.string().nullable(),
  createdAt: z.string().datetime(),
});

// Get Media Query Schema
export const GetMediaQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: MediaTypeSchema.optional(),
  uploadedById: z.string().optional(),
  postingId: z.string().optional(),
  proServiceId: z.string().optional(),
  transactionId: z.string().optional(),
  reportId: z.string().optional(),
});

// Media with Relations Schema
export const MediaWithRelationsSchema = MediaSchema.extend({
  uploadedBy: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
  }).nullable().optional(),
  posting: z.object({
    id: z.string(),
    title: z.string(),
  }).nullable().optional(),
  proService: z.object({
    id: z.string(),
    title: z.string(),
  }).nullable().optional(),
  transaction: z.object({
    id: z.string(),
  }).nullable().optional(),
  report: z.object({
    id: z.string(),
    reason: z.string(),
  }).nullable().optional(),
});

// Media List Response Schema
export const MediaListResponseSchema = z.object({
  media: z.array(MediaWithRelationsSchema),
  total: z.number(),
});