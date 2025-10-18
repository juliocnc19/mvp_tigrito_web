import { z } from 'zod';
import { BaseResponseSchema, PaginationSchema } from '@/lib/schemas/common';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: z.infer<typeof PaginationSchema>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  pagination?: z.infer<typeof PaginationSchema>
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination,
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: any
): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

export function calculatePagination(
  page: number,
  limit: number,
  total: number
): z.infer<typeof PaginationSchema> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
  };
}

export function paginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): ApiResponse<T[]> {
  const pagination = calculatePagination(page, limit, total);
  
  return createSuccessResponse(data, message, pagination);
}

export const COMMON_ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
