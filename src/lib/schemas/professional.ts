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

// Professional Portfolio Schemas
export const ProfessionalPortfolioSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  images: z.array(z.string()),
  videos: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string(),
  completionDate: z.string().datetime(),
  clientRating: z.number().nullable(),
  clientReview: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProfessionalPortfolioRequestSchema = z.object({
  professionalId: z.string().min(1, 'professionalId is required'),
  title: z.string().min(1, 'title is required'),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  videos: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().min(1, 'category is required'),
  completionDate: z.string().datetime(),
  clientRating: z.number().min(1).max(5).optional(),
  clientReview: z.string().optional(),
});

export const UpdateProfessionalPortfolioRequestSchema = z.object({
  title: z.string().min(1, 'title is required').optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required').optional(),
  videos: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().min(1, 'category is required').optional(),
  completionDate: z.string().datetime().optional(),
  clientRating: z.number().min(1).max(5).optional(),
  clientReview: z.string().optional(),
});

export const ProfessionalPortfolioResponseSchema = z.object({
  portfolio: ProfessionalPortfolioSchema,
});

export const ProfessionalPortfoliosListResponseSchema = z.object({
  portfolios: z.array(ProfessionalPortfolioSchema),
  total: z.number(),
});

// Professional Notification Schemas
export const ProfessionalNotificationSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  metadata: z.any().optional(),
  createdAt: z.string().datetime(),
});

export const ProfessionalNotificationsListResponseSchema = z.object({
  notifications: z.array(ProfessionalNotificationSchema),
  total: z.number(),
  unreadCount: z.number(),
});

// Professional Settings Schemas
export const ProfessionalSettingsSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  privacy: z.object({
    showPhone: z.boolean(),
    showEmail: z.boolean(),
    showLocation: z.boolean(),
  }),
  work: z.object({
    availability: z.string(),
    maxDistance: z.number(),
    autoAccept: z.boolean(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateProfessionalSettingsRequestSchema = z.object({
  bio: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  certifications: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  bankAccount: z.string().optional(),
  taxId: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }).optional(),
  privacy: z.object({
    showPhone: z.boolean(),
    showEmail: z.boolean(),
    showLocation: z.boolean(),
  }).optional(),
  work: z.object({
    availability: z.string(),
    maxDistance: z.number(),
    autoAccept: z.boolean(),
  }).optional(),
});

// Professional Stats Schemas
export const ProfessionalDashboardStatsSchema = z.object({
  totalJobs: z.number(),
  completedJobs: z.number(),
  pendingJobs: z.number(),
  totalEarnings: z.number(),
  averageRating: z.number(),
  portfolioItems: z.number(),
  reviews: z.number(),
});

export const ProfessionalCalendarStatsSchema = z.object({
  upcomingJobs: z.array(z.object({
    id: z.string(),
    title: z.string(),
    clientName: z.string(),
    scheduledDate: z.string().datetime(),
    location: z.string(),
    price: z.number(),
  })),
  completedJobs: z.array(z.object({
    id: z.string(),
    title: z.string(),
    clientName: z.string(),
    completedDate: z.string().datetime(),
    location: z.string(),
    price: z.number(),
  })),
});

export const ProfessionalEarningsStatsSchema = z.object({
  monthlyEarnings: z.number(),
  totalEarnings: z.number(),
  earningsByMonth: z.array(z.object({
    month: z.string(),
    earnings: z.number(),
  })),
});

export const ProfessionalReviewsStatsSchema = z.object({
  reviews: z.array(z.object({
    id: z.string(),
    rating: z.number(),
    comment: z.string(),
    clientName: z.string(),
    createdAt: z.string().datetime(),
  })),
  averageRating: z.number(),
  totalReviews: z.number(),
  ratingDistribution: z.array(z.object({
    rating: z.number(),
    count: z.number(),
  })),
});

export const ProfessionalDashboardStatsResponseSchema = z.object({
  stats: ProfessionalDashboardStatsSchema,
});

export const ProfessionalCalendarStatsResponseSchema = z.object({
  stats: ProfessionalCalendarStatsSchema,
});

export const ProfessionalEarningsStatsResponseSchema = z.object({
  stats: ProfessionalEarningsStatsSchema,
});

export const ProfessionalReviewsStatsResponseSchema = z.object({
  stats: ProfessionalReviewsStatsSchema,
});
