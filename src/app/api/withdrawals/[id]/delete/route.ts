import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { deleteWithdrawal, getWithdrawalById } from '@/lib/db/queries/withdrawal';

/**
 * Delete withdrawal
 * @description Delete a withdrawal by ID
 * @response 200:Success response:Withdrawal deleted successfully
 * @add 404:Withdrawal not found
 * @responseSet public
 * @openapi
 */
export async function DELETE(
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

    // Delete withdrawal
    await deleteWithdrawal(id);

    return NextResponse.json(
      createSuccessResponse(null, 'Withdrawal deleted successfully')
    );

  } catch (error) {
    console.error('Delete withdrawal error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete withdrawal'
      ),
      { status: 500 }
    );
  }
}
