import { prisma } from '../prisma';
import { Review, Prisma } from '@prisma/client';
import { GetReviewsQuerySchema, CreateReviewRequestSchema, UpdateReviewRequestSchema } from '@/lib/schemas/review';
import { z } from 'zod';

// Get reviews with filters and pagination
export async function getReviews(query: z.infer<typeof GetReviewsQuerySchema>): Promise<{
  reviews: Review[];
  total: number;
}> {
  const { page, limit, reviewerId, reviewedId, transactionId, isProReview } = query;

  const where: Prisma.ReviewWhereInput = {};

  if (reviewerId) where.reviewerId = reviewerId;
  if (reviewedId) where.reviewedId = reviewedId;
  if (transactionId) where.transactionId = transactionId;
  if (isProReview !== undefined) where.isProReview = isProReview;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, total };
}

// Get review by ID
export async function getReviewById(id: string): Promise<Review | null> {
  return prisma.review.findUnique({
    where: { id },
  });
}

// Create review
export async function createReview(reviewerId: string, data: z.infer<typeof CreateReviewRequestSchema>): Promise<Review> {
  return prisma.review.create({
    data: {
      ...data,
      reviewerId,
    },
  });
}

// Update review
export async function updateReview(id: string, data: z.infer<typeof UpdateReviewRequestSchema>): Promise<Review> {
  return prisma.review.update({
    where: { id },
    data,
  });
}

// Delete review
export async function deleteReview(id: string): Promise<Review> {
  return prisma.review.delete({
    where: { id },
  });
}
