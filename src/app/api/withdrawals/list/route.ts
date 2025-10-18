import { NextRequest, NextResponse } from 'next/server';
import { GetWithdrawalsQuerySchema, WithdrawalsListResponseSchema } from '@/lib/schemas/withdrawal';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES, paginationResponse } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getWithdrawals } from '@/lib/db/queries/withdrawal';

/**
 * Get withdrawals list
 * @description Retrieve paginated list of withdrawals with optional filters
 * @query GetWithdrawalsQuerySchema
 * @response 200:WithdrawalsListResponseSchema:Withdrawals retrieved successfully
 * @responseSet public
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    // Validate query parameters
    const queryParams = Object.fromEntries(request.nextUrl.searchParams);
    const validation = GetWithdrawalsQuerySchema.safeParse(queryParams);
    
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

    const { page, limit, status, userId, dateFrom, dateTo } = validation.data;

    // Get withdrawals with filters and pagination
    const { withdrawals, total } = await getWithdrawals({
      page,
      limit,
      status,
      userId,
      dateFrom,
      dateTo,
    });

    // Prepare response data
    const withdrawalsData = withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      paymentMethodId: withdrawal.paymentMethodId,
      amount: withdrawal.amount.toNumber(),
      status: withdrawal.status,
      requestedAt: withdrawal.requestedAt.toISOString(),
      completedAt: withdrawal.completedAt?.toISOString() || null,
      adminNotes: withdrawal.adminNotes,
      rejectionReason: withdrawal.rejectionReason,
      user: (withdrawal as any).user,
      paymentMethod: (withdrawal as any).paymentMethod,
    }));

    const responseData = {
      withdrawals: withdrawalsData,
      total,
    };

    // Validate response
    const responseValidation = WithdrawalsListResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.INTERNAL_ERROR,
          'Response validation failed'
        ),
        { status: 500 }
      );
    }

    return NextResponse.json(
      paginationResponse(
        withdrawalsData,
        total,
        page,
        limit,
        'Withdrawals retrieved successfully'
      )
    );

  } catch (error) {
    console.error('Get withdrawals error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve withdrawals'
      ),
      { status: 500 }
    );
  }
}
