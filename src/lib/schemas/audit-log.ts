import { z } from 'zod';

// Audit Log Schema
export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string().nullable(),
  action: z.string(),
  meta: z.any().nullable(),
  createdAt: z.string().datetime(),
});

// Get Audit Logs Query Schema
export const GetAuditLogsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  actorId: z.string().optional(),
  action: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Audit Log with Relations Schema
export const AuditLogWithRelationsSchema = AuditLogSchema.extend({
  actor: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    role: z.string(),
  }).nullable().optional(),
});

// Audit Logs List Response Schema
export const AuditLogsListResponseSchema = z.object({
  auditLogs: z.array(AuditLogWithRelationsSchema),
  total: z.number(),
});