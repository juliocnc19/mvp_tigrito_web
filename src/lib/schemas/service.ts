import { z } from 'zod';

// Service Posting Schema
export const ServicePostingSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  budget: z.number(),
  deadline: z.string().datetime().nullable(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  location: z.string().nullable(),
  locationLat: z.number().nullable(),
  locationLng: z.number().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// Create Service Posting Request
export const CreateServicePostingRequestSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  category: z.string(),
  budget: z.number().min(0),
  deadline: z.string().datetime().optional(),
  location: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

// Update Service Posting Request
export const UpdateServicePostingRequestSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).max(5000).optional(),
  budget: z.number().min(0).optional(),
  deadline: z.string().datetime().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  location: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
});

// Service Offer Schema
export const ServiceOfferSchema = z.object({
  id: z.string(),
  postingId: z.string(),
  professionalId: z.string(),
  proposedPrice: z.number(),
  description: z.string(),
  estimatedDuration: z.number(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create Service Offer Request
export const CreateServiceOfferRequestSchema = z.object({
  postingId: z.string(),
  proposedPrice: z.number().min(0),
  description: z.string().min(10).max(2000),
  estimatedDuration: z.number().min(1),
});

// Update Service Offer Request
export const UpdateServiceOfferRequestSchema = z.object({
  proposedPrice: z.number().min(0).optional(),
  description: z.string().min(10).max(2000).optional(),
  estimatedDuration: z.number().min(1).optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED']).optional(),
});

// Service Transaction Schema
export const ServiceTransactionSchema = z.object({
  id: z.string(),
  postingId: z.string(),
  offerId: z.string(),
  clientId: z.string(),
  professionalId: z.string(),
  agreedPrice: z.number(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
  startDate: z.string().datetime().nullable(),
  completionDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Get Service Postings Query Schema
export const GetServicePostingsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  category: z.string().optional(),
  minBudget: z.coerce.number().min(0).optional(),
  maxBudget: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
  sortBy: z.enum(['budget', 'recent', 'deadline']).optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

// Get Service Offers Query Schema
export const GetServiceOffersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED']).optional(),
  sortBy: z.enum(['price', 'recent', 'duration']).optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

// Service Posting Response Schema
export const ServicePostingResponseSchema = z.object({
  posting: ServicePostingSchema,
});

// Service Postings List Response Schema
export const ServicePostingsListResponseSchema = z.object({
  postings: z.array(ServicePostingSchema),
  total: z.number(),
});

// Service Offer Response Schema
export const ServiceOfferResponseSchema = z.object({
  offer: ServiceOfferSchema,
});

// Service Offers List Response Schema
export const ServiceOffersListResponseSchema = z.object({
  offers: z.array(ServiceOfferSchema),
  total: z.number(),
});

// Service Transaction Response Schema
export const ServiceTransactionResponseSchema = z.object({
  transaction: ServiceTransactionSchema,
});

// Service Transactions List Response Schema
export const ServiceTransactionsListResponseSchema = z.object({
  transactions: z.array(ServiceTransactionSchema),
  total: z.number(),
});

// Accept Offer Request Schema
export const AcceptOfferRequestSchema = z.object({
  offerId: z.string(),
});

// Complete Service Request Schema
export const CompleteServiceRequestSchema = z.object({
  transactionId: z.string(),
  notes: z.string().optional(),
});

