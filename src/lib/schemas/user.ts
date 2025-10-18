import { z } from 'zod';
import { RoleSchema } from './common';

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  role: RoleSchema,
  isVerified: z.boolean(),
  isIDVerified: z.boolean(),
  balance: z.number(),
  isSuspended: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  locationLat: z.number().nullable(),
  locationLng: z.number().nullable(),
  locationAddress: z.string().nullable(),
});

// Update User Profile Request
export const UpdateUserProfileRequestSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  locationAddress: z.string().optional(),
});

// Get Users Query Schema
export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  role: RoleSchema.optional(),
  isVerified: z.coerce.boolean().optional(),
  search: z.string().optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
});

// Verify User Request Schema
export const VerifyUserRequestSchema = z.object({
  isVerified: z.boolean(),
  isIDVerified: z.boolean(),
});

// Suspend User Request Schema
export const SuspendUserRequestSchema = z.object({
  isSuspended: z.boolean(),
  reason: z.string().optional(),
});

// User Statistics Schema
export const UserStatsSchema = z.object({
  totalPostings: z.number(),
  totalOffers: z.number(),
  totalTransactions: z.number(),
  totalReviews: z.number(),
  averageRating: z.number(),
});

// User with Relations Schema
export const UserWithRelationsSchema = UserSchema.extend({
  professionalProfile: z.any().nullable().optional(),
  postings: z.array(z.any()).optional(),
  offers: z.array(z.any()).optional(),
  proactiveServices: z.array(z.any()).optional(),
  servicesAsClient: z.array(z.any()).optional(),
  servicesAsPro: z.array(z.any()).optional(),
  reviewsGiven: z.array(z.any()).optional(),
  reviewsReceived: z.array(z.any()).optional(),
  payments: z.array(z.any()).optional(),
  reportsSent: z.array(z.any()).optional(),
  reportsReceived: z.array(z.any()).optional(),
  promoUses: z.array(z.any()).optional(),
  devices: z.array(z.any()).optional(),
  notifications: z.array(z.any()).optional(),
  media: z.array(z.any()).optional(),
  conversationsAsParticipant: z.array(z.any()).optional(),
  messages: z.array(z.any()).optional(),
  auditLogs: z.array(z.any()).optional(),
  conversationsCreated: z.array(z.any()).optional(),
  paymentMethods: z.array(z.any()).optional(),
  withdrawals: z.array(z.any()).optional(),
});

// User Profile Response Schema
export const UserProfileResponseSchema = z.object({
  user: UserWithRelationsSchema,
});

// Users List Response Schema
export const UsersListResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
});

// User Statistics Response Schema
export const UserStatsResponseSchema = z.object({
  stats: UserStatsSchema,
});