import { NextRequest, NextResponse } from 'next/server';
import { UpdateWithdrawalStatusRequestSchema, WithdrawalSchema } from '@/lib/schemas/withdrawal';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { updateWithdrawal, getWithdrawalById } from '@/lib/db/queries/withdrawal';

/**
 * Update withdrawal
 * @description Update withdrawal status and admin notes
 * @body UpdateWithdrawalStatusRequestSchema
 * @response 200:WithdrawalSchema:Withdrawal updated successfully
 * @add 404:Withdrawal not found
 * @responseSet public
 * @openapi
 */
export async function PUT(
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

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateWithdrawalStatusRequestSchema.safeParse(body);
    
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

    // Check if withdrawal exists
    const existingWithdrawal = await getWithdrawalById(id);
    if (!existingWithdrawal) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Withdrawal not found'
        ),
        { status: 404 }
      );
    }

    // Update withdrawal
    const withdrawal = await updateWithdrawal(id, validation.data);

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
      createSuccessResponse(responseValidation.data, 'Withdrawal updated successfully')
    );

  } catch (error) {
    console.error('Update withdrawal error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update withdrawal'
      ),
      { status: 500 }
    );
  }
}
