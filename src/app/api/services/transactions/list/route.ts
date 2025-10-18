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
    const role = request.nextUrl.searchParams.get('role');
    
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
    
    let clientId: string | undefined = validation.data.clientId;
    let professionalId: string | undefined = validation.data.professionalId;

    // Non-admin users can only see their own transactions
    if (role !== 'ADMIN') {
      if (role === 'CLIENT') {
        clientId = userId;
      } else if (role === 'PROFESSIONAL') {
        professionalId = userId;
      }
    }

    const { transactions, total } = await getServiceTransactions({
      page,
      limit,
      clientId,
      professionalId,
      status,
      dateFrom,
      dateTo,
    });

    const responseData = { transactions, total };
    const responseValidation = TransactionsListResponseSchema.safeParse(responseData);

    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues,
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginationResponse(
        transactions,
        total,
        page,
        limit,
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
