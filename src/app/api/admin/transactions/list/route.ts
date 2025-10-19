import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get transactions list for admin
 * @description Retrieve paginated list of all transactions with admin details
 * @query page, limit, status, search
 * @response 200:Transactions retrieved successfully
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
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.currentStatus = status;
    }

    if (search) {
      where.OR = [
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { client: { email: { contains: search, mode: 'insensitive' } } },
        { professional: { name: { contains: search, mode: 'insensitive' } } },
        { professional: { email: { contains: search, mode: 'insensitive' } } },
        { posting: { title: { contains: search, mode: 'insensitive' } } },
        { proService: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.serviceTransaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          professional: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          posting: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          proService: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          offer: {
            select: {
              id: true,
              price: true,
              message: true,
            },
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
              method: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.serviceTransaction.count({ where }),
    ]);

    // Map transactions data
    const transactionsData = transactions.map(transaction => ({
      id: transaction.id,
      clientId: transaction.clientId,
      professionalId: transaction.professionalId,
      priceAgreed: transaction.priceAgreed.toNumber(),
      discountAmount: transaction.discountAmount.toNumber(),
      platformFee: transaction.platformFee.toNumber(),
      escrowAmount: transaction.escrowAmount.toNumber(),
      currentStatus: transaction.currentStatus,
      status: transaction.status,
      scheduledDate: transaction.scheduledDate?.toISOString() || null,
      postingId: transaction.postingId,
      proServiceId: transaction.proServiceId,
      promoCodeId: transaction.promoCodeId,
      yummyLogistics: transaction.yummyLogistics,
      notes: transaction.notes,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      completedAt: transaction.completedAt?.toISOString() || null,
      agreedPrice: transaction.agreedPrice?.toNumber() || null,
      offerId: transaction.offerId,
      client: transaction.client,
      professional: transaction.professional,
      posting: transaction.posting,
      proService: transaction.proService,
      offer: transaction.offer,
      payment: transaction.payment,
      reviews: transaction.reviews,
      reviewsCount: transaction._count.reviews,
    }));

    return NextResponse.json(
      createSuccessResponse(
        transactionsData,
        'Transacciones obtenidas exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener transacciones'
      ),
      { status: 500 }
    );
  }
}
