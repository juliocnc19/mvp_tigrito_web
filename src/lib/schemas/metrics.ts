import { z } from 'zod';

// Overview Metrics Response Schema
export const OverviewMetricsResponseSchema = z.object({
  totalUsers: z.number(),
  totalProfessionals: z.number(),
  totalTransactions: z.number(),
  totalRevenue: z.number(),
  activePostings: z.number(),
  pendingReports: z.number(),
});

// User Metrics Query Schema
export const UserMetricsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Transaction Metrics Query Schema
export const TransactionMetricsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  status: z.string().optional(),
});

// Revenue Metrics Query Schema
export const RevenueMetricsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
});
