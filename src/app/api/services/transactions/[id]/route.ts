import { NextRequest, NextResponse } from 'next/server';
import { TransactionResponseSchema } from '@/lib/schemas/transaction';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { requireAuth } from '@/lib/auth/middleware';
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
    const auth = requireAuth(request);
    if (!auth.success) {
      return auth.response;
    }
    const { userId, role } = auth.user;
    
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
    const responseValidation = TransactionResponseSchema.safeParse(responseData);

    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed',
          responseValidation.error.issues
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(responseValidation.data, 'Transaction retrieved successfully')
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
