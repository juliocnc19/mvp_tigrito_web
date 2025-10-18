import { z } from 'zod';
import { NextRequest } from 'next/server';
import { createErrorResponse, COMMON_ERROR_CODES } from './response';

export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: any }> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid input data',
          error.issues
        ),
      };
    }
    return {
      success: false,
      error: createErrorResponse(
        COMMON_ERROR_CODES.BAD_REQUEST,
        'Invalid request format'
      ),
    };
  }
}

export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: any } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          error.issues
        ),
      };
    }
    return {
      success: false,
      error: createErrorResponse(
        COMMON_ERROR_CODES.BAD_REQUEST,
        'Invalid query format'
      ),
    };
  }
}

export function validateResponse<T>(
  data: T,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: any } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          error.issues
        ),
      };
    }
    return {
      success: false,
      error: createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Response validation error'
      ),
    };
  }
}
