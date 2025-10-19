import { z } from 'zod';

// Profession Schema
export const ProfessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
});

// Create Profession Request
export const CreateProfessionRequestSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});

// Update Profession Request
export const UpdateProfessionRequestSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
});

// Get Professions Query Schema
export const GetProfessionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Profession Response
export const ProfessionResponseSchema = z.object({
  profession: ProfessionSchema,
});

// Professions List Response
export const ProfessionsListResponseSchema = z.object({
  professions: z.array(ProfessionSchema),
  total: z.number(),
});

// Professional Profession Link Schemas
export const ProfessionalProfessionLinkSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  professionId: z.string(),
  documents: z.record(z.string(), z.any()).nullable(),
  verified: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProfessionalProfessionLinkRequestSchema = z.object({
  userId: z.string(),
  professionId: z.string(),
  documents: z.record(z.string(), z.any()).optional(),
});

export const UpdateProfessionalProfessionLinkRequestSchema = z.object({
  documents: z.record(z.string(), z.any()).optional(),
  verified: z.boolean().optional(),
});

export const ProfessionalProfessionLinkResponseSchema = z.object({
  professionLink: ProfessionalProfessionLinkSchema,
});

export const ProfessionalProfessionLinksListResponseSchema = z.object({
  professionLinks: z.array(ProfessionalProfessionLinkSchema),
});
