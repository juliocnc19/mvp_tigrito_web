import { z } from 'zod';

// Professional Service Schema
export const ProfessionalServiceSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string(),
  serviceLocations: z.any().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create Professional Service Request
export const CreateProfessionalServiceRequestSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(0),
  categoryId: z.string(),
  serviceLocations: z.any().optional(),
  mediaIds: z.array(z.string()).optional(),
});

// Update Professional Service Request
export const UpdateProfessionalServiceRequestSchema = z.object({
  title: z.string().min(5).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  serviceLocations: z.any().optional(),
  mediaIds: z.array(z.string()).optional(),
});

// Get Professional Services Query Schema
export const GetProfessionalServicesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  professionalId: z.string().optional(),
  categoryId: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});
