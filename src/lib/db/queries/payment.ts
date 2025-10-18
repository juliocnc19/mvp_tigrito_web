import { prisma } from '../prisma';
import { Payment, Prisma } from '@prisma/client';
import { GetPaymentsQuerySchema } from '@/lib/schemas/payment';
import { z } from 'zod';

// Create payment
export async function createPayment(data: {
  userId: string;
  transactionId?: string;
  amount: number;
  fee?: number;
  method: 'CASHEA' | 'BALANCE' | 'TRANSFER' | 'PAY_MOBILE' | 'CARD' | 'OTHER';
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  details?: any;
  recipientId?: string;
}): Promise<Payment> {
  return prisma.payment.create({
    data: {
      userId: data.userId,
      transactionId: data.transactionId,
      amount: data.amount,
      fee: data.fee || 0,
      method: data.method,
      status: data.status || 'PENDING',
      details: data.details,
      recipientId: data.recipientId,
    },
  });
}

// Get payment by ID
export async function getPaymentById(id: string): Promise<Payment | null> {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      user: true,
      transaction: true,
    },
  });
}

// Update payment
export async function updatePayment(id: string, data: {
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  details?: any;
}): Promise<Payment> {
  return prisma.payment.update({
    where: { id },
    data,
  });
}

// Get payments with filters and pagination
export async function getPayments(query: z.infer<typeof GetPaymentsQuerySchema>): Promise<{
  payments: Payment[];
  total: number;
}> {
  const { page, limit, status, userId, method } = query;
  
  const where: Prisma.PaymentWhereInput = {};

  // Status filter
  if (status) {
    where.status = status;
  }

  // User filter
  if (userId) {
    where.userId = userId;
  }

  // Method filter
  if (method) {
    where.method = method;
  }

  // Date filters removed - not available in current schema

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
        transaction: true,
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return { payments, total };
}

// Get payments by user
export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      transaction: true,
    },
  });
}

// Get payments by status
export async function getPaymentsByStatus(status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: { status },
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
      transaction: true,
    },
  });
}

// Get payment statistics
export async function getPaymentStats(): Promise<{
  total: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  totalAmount: number;
  totalFees: number;
  completedAmount: number;
}> {
  const [total, pending, completed, failed, refunded, amounts] = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'COMPLETED' } }),
    prisma.payment.count({ where: { status: 'FAILED' } }),
    prisma.payment.count({ where: { status: 'REFUNDED' } }),
    prisma.payment.aggregate({
      _sum: { amount: true, fee: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ]);

  return {
    total,
    pending,
    completed,
    failed,
    refunded,
    totalAmount: amounts._sum.amount?.toNumber() || 0,
    totalFees: amounts._sum.fee?.toNumber() || 0,
    completedAmount: amounts._sum.amount?.toNumber() || 0,
  };
}

// Get recent payments
export async function getRecentPayments(limit: number = 10): Promise<Payment[]> {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      transaction: true,
    },
  });
}

// Get payments by method
export async function getPaymentsByMethod(method: 'CASHEA' | 'BALANCE' | 'TRANSFER' | 'PAY_MOBILE' | 'CARD' | 'OTHER'): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: { method },
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
      transaction: true,
    },
  });
}
