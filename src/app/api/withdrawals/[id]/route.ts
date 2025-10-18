import { NextRequest, NextResponse } from 'next/server';
import { WithdrawalSchema } from '@/lib/schemas/withdrawal';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getWithdrawalById } from '@/lib/db/queries/withdrawal';

/**
 * Get withdrawal by ID
 * @description Retrieve a specific withdrawal's details by ID
 * @response 200:WithdrawalSchema:Withdrawal retrieved successfully
 * @add 404:Withdrawal not found
 * @responseSet public
 * @openapi
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid withdrawal ID'
        ),
        { status: 422 }
      );
    }

    // Get withdrawal by ID
    const withdrawal = await getWithdrawalById(id);
    if (!withdrawal) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Withdrawal not found'
        ),
        { status: 404 }
      );
    }

    // Prepare response data
    const withdrawalData = {
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
    };

    // Validate response
    const responseValidation = WithdrawalSchema.safeParse(withdrawalData);
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
      createSuccessResponse(responseValidation.data, 'Withdrawal retrieved successfully')
    );

  } catch (error) {
    console.error('Get withdrawal by ID error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve withdrawal'
      ),
      { status: 500 }
    );
  }
}
