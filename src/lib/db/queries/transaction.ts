import { prisma } from '../prisma';
import { ServiceTransaction, Prisma } from '@prisma/client';
import { GetTransactionsQuerySchema } from '@/lib/schemas/transaction';
import { z } from 'zod';

export async function getServiceTransactionById(id: string): Promise<(ServiceTransaction & { reviews: any[]; payment: any }) | null> {
  return prisma.serviceTransaction.findUnique({
    where: { id },
    include: {
      reviews: true,
      payment: true,
    },
  });
}

// Get service transactions with filters and pagination
export async function getServiceTransactions(query: z.infer<typeof GetTransactionsQuerySchema>): Promise<{
  transactions: ServiceTransaction[];
  total: number;
}> {
  const { userId, page, limit, status, dateFrom, dateTo } = query;

  const where: Prisma.ServiceTransactionWhereInput = {};

  if (userId) where.clientId = userId;
  if (status) where.currentStatus = status;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }
  console.log('where', where);
  const [transactions, total] = await Promise.all([
    prisma.serviceTransaction.findMany({
      where,
      skip: (page - 1) * (limit ?? 10),
      take: limit ?? 10,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, name: true, email: true }},
        professional: { select: { id: true, name: true, email: true }},
        reviews: true,
      }
    }),
    prisma.serviceTransaction.count({ where }),
  ]);
  console.log('transactions', transactions);
  console.log('total', total);
  return { transactions, total };
}
