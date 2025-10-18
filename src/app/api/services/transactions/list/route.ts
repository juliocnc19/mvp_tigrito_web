import { NextRequest, NextResponse } from 'next/server';
import { GetTransactionsQuerySchema, TransactionsListResponseSchema } from '@/lib/schemas/transaction';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getServiceTransactions } from '@/lib/db/queries/transaction';

/**
 * Get service transactions list
 * @description Retrieve paginated list of service transactions with optional filters. Users can only see their own transactions.
 * @query GetTransactionsQuerySchema
 * @response 200:TransactionsListResponseSchema:Transactions retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Get userId and role from query parameters
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'userId query parameter is required'
        ),
        { status: 400 }
      );
    }
    
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetTransactionsQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid query parameters',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { page, limit, status, dateFrom, dateTo } = validation.data;
    
    const { transactions, total } = await getServiceTransactions({
      page,
      limit,
      userId,
      status,
      dateFrom,
      dateTo,
    });
    const responseData = { transactions, total };
    
    return NextResponse.json(
      paginationResponse(
        transactions,
        total,
        page ?? 1,
        limit ?? 10,
        'Transactions retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve transactions'
      ),
      { status: 500 }
    );
  }
}

