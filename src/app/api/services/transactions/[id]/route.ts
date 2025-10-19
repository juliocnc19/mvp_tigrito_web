import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getServiceTransactionById } from '@/lib/db/queries/transaction';

/**
 * Get service transaction by ID
 * @description Retrieve a single service transaction by its ID. Users can only see their own transactions.
 * @param params.id {string} The transaction ID
 * @response 200:TransactionResponseSchema:Transaction retrieved successfully
 * @response 403:Forbidden
 * @response 404:Not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    
    const { id } = await params;

    const transaction = await getServiceTransactionById(id);

    if (!transaction) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Transaction not found'),
        { status: 404 }
      );
    }
    
    if (role !== 'ADMIN' && transaction.clientId !== userId && transaction.professionalId !== userId) {
        return NextResponse.json(
            createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'You do not have permission to view this transaction'),
            { status: 403 }
        );
    }

    const responseData = { transaction };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Transaction retrieved successfully')
    );
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve transaction'
      ),
      { status: 500 }
    );
  }
}
