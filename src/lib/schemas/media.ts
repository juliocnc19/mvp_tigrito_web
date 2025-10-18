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

// Upload Media Request
export const UploadMediaRequestSchema = z.object({
  files: z.array(z.instanceof(File)),
  type: MediaTypeSchema.optional(),
});

// Get Media Query Schema
export const GetMediaQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  uploadedById: z.string().optional(),
  type: MediaTypeSchema.optional(),
  postingId: z.string().optional(),
  proServiceId: z.string().optional(),
  transactionId: z.string().optional(),
});
