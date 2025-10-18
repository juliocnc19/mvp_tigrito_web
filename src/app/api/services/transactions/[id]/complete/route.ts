import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getServiceTransactionById } from '@/lib/db/queries/transaction';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const CompleteTransactionSchema = z.object({
  notes: z.string().optional(),
  finalAmount: z.number().min(0).optional(),
});

/**
 * Complete transaction
 * @description Mark a service transaction as completed and process payment
 * @body CompleteTransactionSchema
 * @response 200:Transaction completed successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params;
    const auth = optionalAuth(request);

    if (!auth?.user?.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = CompleteTransactionSchema.safeParse(body);
    
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

    const { notes, finalAmount } = validation.data;

    // Get the transaction
    const transaction = await getServiceTransactionById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Transaction not found'),
        { status: 404 }
      );
    }

    // Check if user is the professional in the transaction
    if (transaction.professionalId !== auth.user.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Only the professional can complete the transaction'),
        { status: 403 }
      );
    }

    // Check if transaction is in progress
    if (transaction.currentStatus !== 'IN_PROGRESS') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.CONFLICT,
          'Transaction must be in progress to be completed'
        ),
        { status: 409 }
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Update transaction status to completed
      const updatedTransaction = await tx.serviceTransaction.update({
        where: { id: transactionId },
        data: {
          currentStatus: 'COMPLETED',
          status: 'COMPLETED',
          completedAt: new Date(),
          notes: notes || transaction.notes,
          agreedPrice: finalAmount ? finalAmount : transaction.agreedPrice,
        },
        include: {
          client: { select: { id: true, name: true, email: true, balance: true } },
          professional: { select: { id: true, name: true, email: true, balance: true } },
          payment: true,
        },
      });

      // Calculate final amounts
      const finalPrice = finalAmount || transaction.priceAgreed.toNumber();
      const platformFee = finalPrice * 0.05; // 5% platform fee
      const professionalAmount = finalPrice - platformFee;

      // Create or update payment
      let payment;
      if (transaction.payment) {
        payment = await tx.payment.update({
          where: { id: transaction.payment.id },
          data: {
            amount: finalPrice,
            fee: platformFee,
            status: 'COMPLETED',
          },
        });
      } else {
        payment = await tx.payment.create({
          data: {
            userId: transaction.clientId,
            transactionId: transactionId,
            amount: finalPrice,
            fee: platformFee,
            method: 'BALANCE',
            status: 'COMPLETED',
            details: {
              professionalAmount,
              platformFee,
              transactionId,
            },
          },
        });
      }

      // Update user balances
      await tx.user.update({
        where: { id: transaction.clientId },
        data: {
          balance: {
            decrement: finalPrice,
          },
        },
      });

      await tx.user.update({
        where: { id: transaction.professionalId },
        data: {
          balance: {
            increment: professionalAmount,
          },
        },
      });

      return { transaction: updatedTransaction, payment };
    });

    return NextResponse.json(
      createSuccessResponse(
        {
          transaction: {
            id: result.transaction.id,
            status: result.transaction.status,
            currentStatus: result.transaction.currentStatus,
            completedAt: result.transaction.completedAt?.toISOString(),
            notes: result.transaction.notes,
            agreedPrice: result.transaction.agreedPrice?.toNumber() || 0,
            updatedAt: result.transaction.updatedAt.toISOString(),
          },
          payment: {
            id: result.payment.id,
            amount: result.payment.amount.toNumber(),
            fee: result.payment.fee.toNumber(),
            status: result.payment.status,
            method: result.payment.method,
          },
          professionalAmount: ((result.transaction.agreedPrice?.toNumber() || 0) - result.payment.fee.toNumber()),
        },
        'Transaction completed successfully'
      ),
      { status: 200 }
    );

  } catch (error) {
    console.error('Complete transaction error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to complete transaction'
      ),
      { status: 500 }
    );
  }
}
