import { prisma } from '../prisma';
import { Withdrawal, Prisma } from '@prisma/client';
import { GetWithdrawalsQuerySchema } from '@/lib/schemas/withdrawal';
import { z } from 'zod';

// Create withdrawal
export async function createWithdrawal(data: {
  userId: string;
  paymentMethodId: string;
  amount: number;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  adminNotes?: string;
  rejectionReason?: string;
}): Promise<Withdrawal> {
  return prisma.withdrawal.create({
    data: {
      userId: data.userId,
      paymentMethodId: data.paymentMethodId,
      amount: data.amount,
      status: data.status || 'PENDING',
      adminNotes: data.adminNotes,
      rejectionReason: data.rejectionReason,
    },
  });
}

// Get withdrawal by ID
export async function getWithdrawalById(id: string): Promise<Withdrawal | null> {
  return prisma.withdrawal.findUnique({
    where: { id },
    include: {
      user: true,
      paymentMethod: true,
    },
  });
}

// Update withdrawal
export async function updateWithdrawal(id: string, data: {
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  adminNotes?: string;
  rejectionReason?: string;
  completedAt?: Date;
}): Promise<Withdrawal> {
  return prisma.withdrawal.update({
    where: { id },
    data: {
      ...data,
      completedAt: data.status === 'COMPLETED' ? new Date() : undefined,
    },
  });
}

// Delete withdrawal
export async function deleteWithdrawal(id: string): Promise<Withdrawal> {
  return prisma.withdrawal.delete({
    where: { id },
  });
}

// Get withdrawals with filters and pagination
export async function getWithdrawals(query: z.infer<typeof GetWithdrawalsQuerySchema>): Promise<{
  withdrawals: Withdrawal[];
  total: number;
}> {
  const { page, limit, status, userId, dateFrom, dateTo } = query;
  
  const where: Prisma.WithdrawalWhereInput = {};

  // Status filter
  if (status) {
    where.status = status;
  }

  // User filter
  if (userId) {
    where.userId = userId;
  }

  // Date filters
  if (dateFrom || dateTo) {
    where.requestedAt = {};
    if (dateFrom) {
      where.requestedAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.requestedAt.lte = new Date(dateTo);
    }
  }

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { requestedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        paymentMethod: true,
      },
    }),
    prisma.withdrawal.count({ where }),
  ]);

  return { withdrawals, total };
}

// Get withdrawals by user
export async function getWithdrawalsByUser(userId: string): Promise<Withdrawal[]> {
  return prisma.withdrawal.findMany({
    where: { userId },
    orderBy: { requestedAt: 'desc' },
    include: {
      paymentMethod: true,
    },
  });
}

// Get withdrawals by status
export async function getWithdrawalsByStatus(status: 'PENDING' | 'COMPLETED' | 'FAILED'): Promise<Withdrawal[]> {
  return prisma.withdrawal.findMany({
    where: { status },
    orderBy: { requestedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      paymentMethod: true,
    },
  });
}

// Get withdrawal statistics
export async function getWithdrawalStats(): Promise<{
  total: number;
  pending: number;
  completed: number;
  failed: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
}> {
  const [total, pending, completed, failed, amounts] = await Promise.all([
    prisma.withdrawal.count(),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.withdrawal.count({ where: { status: 'COMPLETED' } }),
    prisma.withdrawal.count({ where: { status: 'FAILED' } }),
    prisma.withdrawal.aggregate({
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ]);

  return {
    total,
    pending,
    completed,
    failed,
    totalAmount: amounts._sum.amount?.toNumber() || 0,
    pendingAmount: amounts._sum.amount?.toNumber() || 0,
    completedAmount: amounts._sum.amount?.toNumber() || 0,
  };
}

// Get recent withdrawals
export async function getRecentWithdrawals(limit: number = 10): Promise<Withdrawal[]> {
  return prisma.withdrawal.findMany({
    orderBy: { requestedAt: 'desc' },
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
      paymentMethod: true,
    },
  });
}
