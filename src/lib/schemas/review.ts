import { z } from 'zod';

// Review Schema
export const ReviewSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  reviewerId: z.string(),
  reviewedId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  isProReview: z.boolean(),
  createdAt: z.string().datetime(),
});

// Create Review Request
export const CreateReviewRequestSchema = z.object({
  transactionId: z.string(),
  reviewedId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isProReview: z.boolean(),
});

// Update Review Request
export const UpdateReviewRequestSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

// Get Reviews Query Schema
export const GetReviewsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  reviewerId: z.string().optional(),
  reviewedId: z.string().optional(),
  transactionId: z.string().optional(),
  isProReview: z.coerce.boolean().optional(),
});

// Review Response
export const ReviewResponseSchema = z.object({
  review: ReviewSchema,
});

// Reviews List Response
export const ReviewsListResponseSchema = z.object({
  reviews: z.array(ReviewSchema),
  total: z.number(),
});
