import { z } from 'zod';

// Base response schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number().min(0),
  totalPages: z.number().min(0),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

// Success response with data
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseResponseSchema.extend({
    success: z.literal(true),
    data: dataSchema,
    pagination: PaginationSchema.optional(),
  });

// Enum schemas
export const RoleSchema = z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']);
export const PostingStatusSchema = z.enum(['OPEN', 'CLOSED', 'EXPIRED']);
export const ServiceStatusSchema = z.enum([
  'PENDING_SOLICITUD',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELED',
]);
export const OfferStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);
export const PaymentStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);
export const PaymentMethodSchema = z.enum([
  'CASHEA',
  'BALANCE',
  'TRANSFER',
  'PAY_MOBILE',
  'CARD',
  'OTHER',
]);
export const MediaTypeSchema = z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']);
export const DiscountTypeSchema = z.enum(['PERCENTAGE', 'FIXED_AMOUNT']);
export const AdSegmentSchema = z.enum(['CLIENT', 'PROFESSIONAL', 'ALL']);
export const WithdrawalStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED']);
export const ConversationTypeSchema = z.enum(['CLIENT_PROFESSIONAL', 'SUPPORT']);
export const MessageRoleSchema = z.enum(['USER', 'ASSISTANT', 'SYSTEM']);
export const MessageTypeSchema = z.enum(['TEXT', 'IMAGE', 'FILE', 'SYSTEM']);
