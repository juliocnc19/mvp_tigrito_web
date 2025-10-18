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
  serviceLocations: z.any().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  professionalProfileId: z.string().optional(),
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
  isActive: z.boolean().optional(),
  mediaIds: z.array(z.string()).optional(),
});

// Get Professional Services Query Schema
export const GetProfessionalServicesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  professionalId: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

// Professional Service with Relations Schema
export const ProfessionalServiceWithRelationsSchema = ProfessionalServiceSchema.extend({
  professional: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  }).optional(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }).optional(),
  ProfessionalProfile: z.object({
    id: z.string(),
    bio: z.string().nullable(),
    rating: z.number().nullable(),
    ratingCount: z.number(),
  }).optional(),
  media: z.array(z.any()).optional(),
});

// Professional Services List Response Schema
export const ProfessionalServicesListResponseSchema = z.object({
  services: z.array(ProfessionalServiceWithRelationsSchema),
  total: z.number(),
});

// Professional Service Response Schema
export const ProfessionalServiceResponseSchema = z.object({
  service: ProfessionalServiceWithRelationsSchema,
});

// Request Professional Service Schema
export const RequestProfessionalServiceSchema = z.object({
  professionalServiceId: z.string(),
  agreedPrice: z.number().min(0),
  scheduledDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  promoCodeId: z.string().optional(),
});