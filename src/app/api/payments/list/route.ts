import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get payments list for admin
 * @description Retrieve paginated list of payments with filters
 * @query page, limit, status, method, search
 * @response 200:Payments retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (method && method !== 'all') {
      where.method = method;
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get payments with pagination
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          transaction: {
            select: {
              id: true,
              currentStatus: true,
              posting: {
                select: {
                  title: true,
                },
              },
              proService: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    // Map payments data
    const paymentsData = payments.map(payment => ({
      id: payment.id,
      userId: payment.userId,
      transactionId: payment.transactionId,
      amount: payment.amount.toNumber(),
      fee: payment.fee.toNumber(),
      method: payment.method,
      status: payment.status,
      details: payment.details,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      recipientId: payment.recipientId,
      user: payment.user,
      transaction: payment.transaction,
    }));

    return NextResponse.json(
      createSuccessResponse(
        paymentsData,
        'Pagos obtenidos exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener pagos'
      ),
      { status: 500 }
    );
  }
}
