import { NextRequest, NextResponse } from 'next/server';
import { CreateWithdrawalRequestSchema } from '@/lib/schemas/withdrawal';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { createWithdrawal } from '@/lib/db/queries/withdrawal';

/**
 * Create withdrawal
 * @description Create a new withdrawal request
 * @body CreateWithdrawalRequestSchema
 * @response 201:WithdrawalSchema:Withdrawal created successfully
 * @responseSet public
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    // Parse and validate request body
    const body = await request.json();
    const validation = CreateWithdrawalRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid request body',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { paymentMethodId, amount } = validation.data;

    // Create withdrawal
    const withdrawal = await createWithdrawal({
      userId: auth?.user?.userId || 'system', // Use system if no auth
      paymentMethodId,
      amount,
      status: 'PENDING',
    });

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
    };

    return NextResponse.json(
      createSuccessResponse(withdrawalData, 'Withdrawal created successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create withdrawal error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create withdrawal'
      ),
      { status: 500 }
    );
  }
}
