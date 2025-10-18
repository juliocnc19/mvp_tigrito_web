import { prisma } from '../prisma';
import { ServiceTransaction, Prisma } from '@prisma/client';
import { GetTransactionsQuerySchema } from '@/lib/schemas/transaction';
import { z } from 'zod';

export async function getServiceTransactionById(id: string): Promise<(ServiceTransaction & { reviews: any[] }) | null> {
  return prisma.serviceTransaction.findUnique({
    where: { id },
    include: {
      reviews: true,
    },
  });
}

// Get service transactions with filters and pagination
export async function getServiceTransactions(query: z.infer<typeof GetTransactionsQuerySchema>): Promise<{
  transactions: ServiceTransaction[];
  total: number;
}> {
  const { page, limit, clientId, professionalId, status, dateFrom, dateTo } = query;

  const where: Prisma.ServiceTransactionWhereInput = {};

  if (clientId) where.clientId = clientId;
  if (professionalId) where.professionalId = professionalId;
  if (status) where.currentStatus = status;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  const [transactions, total] = await Promise.all([
    prisma.serviceTransaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, name: true, email: true }},
        professional: { select: { id: true, name: true, email: true }},
        reviews: true,
      }
    }),
    prisma.serviceTransaction.count({ where }),
  ]);

  return { transactions, total };
}
