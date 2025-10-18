import { z } from 'zod';
import { RoleSchema } from './common';

// Professional Profile Schema
export const ProfessionalProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable(),
  rating: z.number().nullable(),
  totalReviews: z.number().nullable(),
  yearsOfExperience: z.number().nullable(),
  certifications: z.string().nullable(),
  specialties: z.array(z.string()).optional(),
  responseTime: z.number().nullable(),
  completionRate: z.number().nullable(),
  hourlyRate: z.number().nullable(),
  bankAccount: z.string().nullable(),
  taxId: z.string().nullable(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// Create Professional Profile Request
export const CreateProfessionalProfileRequestSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  role: z.string().optional(),
  bio: z.string().max(1000).optional(),
  yearsOfExperience: z.number().min(0).max(70).optional(),
  certifications: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  bankAccount: z.string().optional(),
  taxId: z.string().optional(),
});

// Update Professional Profile Request
export const UpdateProfessionalProfileRequestSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  bio: z.string().max(1000).optional(),
  yearsOfExperience: z.number().min(0).max(70).optional(),
  certifications: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
  bankAccount: z.string().optional(),
});

// Get Professionals Query Schema
export const GetProfessionalsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  specialty: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxHourlyRate: z.coerce.number().min(0).optional(),
  minExperience: z.coerce.number().min(0).optional(),
  isVerified: z.coerce.boolean().optional(),
  search: z.string().optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
  sortBy: z.enum(['rating', 'experience', 'hourlyRate', 'recent', 'quality']).optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

// Professional Statistics Schema
export const ProfessionalStatsSchema = z.object({
  totalClients: z.number(),
  totalCompletedServices: z.number(),
  totalEarnings: z.number(),
  averageRating: z.number(),
  totalReviews: z.number(),
  successRate: z.number(),
});

// Professional with User Schema
export const ProfessionalWithUserSchema = ProfessionalProfileSchema.extend({
  user: z.any().optional(),
});

// Professional List Response Schema
export const ProfessionalsListResponseSchema = z.object({
  professionals: z.array(ProfessionalWithUserSchema),
  total: z.number(),
});

// Professional Profile Response Schema
export const ProfessionalProfileResponseSchema = z.object({
  professional: ProfessionalWithUserSchema,
});

// Professional Statistics Response Schema
export const ProfessionalStatsResponseSchema = z.object({
  stats: ProfessionalStatsSchema,
});

// Professional Verification Schema
export const ProfessionalVerificationSchema = z.object({
  isVerified: z.boolean(),
  reason: z.string().optional(),
});

// Professional Service Schema
export const ProfessionalServiceSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  duration: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Professional Services List Schema
export const ProfessionalServicesListSchema = z.object({
  services: z.array(ProfessionalServiceSchema),
  total: z.number(),
});
