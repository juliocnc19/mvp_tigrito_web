import { z } from 'zod';
import { AdSegmentSchema } from './common';

// Ad Campaign Schema
export const AdCampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  targetSegment: AdSegmentSchema,
  location: z.string(),
  imageUrl: z.string(),
  targetUrl: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean(),
  impressions: z.number(),
  clicks: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create Ad Campaign Request
export const CreateAdCampaignRequestSchema = z.object({
  title: z.string().min(5),
  targetSegment: AdSegmentSchema,
  location: z.string().min(2),
  imageUrl: z.string().url(),
  targetUrl: z.string().url(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// Update Ad Campaign Request
export const UpdateAdCampaignRequestSchema = z.object({
  title: z.string().min(5).optional(),
  targetSegment: AdSegmentSchema.optional(),
  location: z.string().min(2).optional(),
  imageUrl: z.string().url().optional(),
  targetUrl: z.string().url().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

// Get Ad Campaigns Query Schema
export const GetAdCampaignsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
  targetSegment: AdSegmentSchema.optional(),
});
