import { prisma } from '../prisma';
import { AuditLog, Prisma } from '@prisma/client';
import { GetAuditLogsQuerySchema } from '@/lib/schemas/audit-log';
import { z } from 'zod';

// Create audit log
export async function createAuditLog(data: {
  actorId?: string;
  action: string;
  meta?: any;
}): Promise<AuditLog> {
  return prisma.auditLog.create({
    data: {
      actorId: data.actorId,
      action: data.action,
      meta: data.meta,
    },
  });
}

// Get audit log by ID
export async function getAuditLogById(id: string): Promise<AuditLog | null> {
  return prisma.auditLog.findUnique({
    where: { id },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

// Get audit logs with filters and pagination
export async function getAuditLogs(query: z.infer<typeof GetAuditLogsQuerySchema>): Promise<{
  auditLogs: AuditLog[];
  total: number;
}> {
  const { page, limit, actorId, action, dateFrom, dateTo } = query;
  
  const where: Prisma.AuditLogWhereInput = {};

  // Actor filter
  if (actorId) {
    where.actorId = actorId;
  }

  // Action filter
  if (action) {
    where.action = { contains: action, mode: 'insensitive' };
  }

  // Date filters
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) {
      where.createdAt.gte = new Date(dateFrom);
    }
    if (dateTo) {
      where.createdAt.lte = new Date(dateTo);
    }
  }

  const [auditLogs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { auditLogs, total };
}

// Get audit logs by actor
export async function getAuditLogsByActor(actorId: string): Promise<AuditLog[]> {
  return prisma.auditLog.findMany({
    where: { actorId },
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

// Get audit logs by action
export async function getAuditLogsByAction(action: string): Promise<AuditLog[]> {
  return prisma.auditLog.findMany({
    where: { action: { contains: action, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

// Get audit log statistics
export async function getAuditLogStats(): Promise<{
  total: number;
  byAction: { action: string; count: number }[];
  byActor: { actorId: string; count: number }[];
  recentActivity: number;
}> {
  const [total, byAction, byActor, recentActivity] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.groupBy({
      by: ['action'],
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
      take: 10,
    }),
    prisma.auditLog.groupBy({
      by: ['actorId'],
      _count: { actorId: true },
      orderBy: { _count: { actorId: 'desc' } },
      take: 10,
    }),
    prisma.auditLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    }),
  ]);

  return {
    total,
    byAction: byAction.map(item => ({
      action: item.action,
      count: item._count.action,
    })),
    byActor: byActor.map(item => ({
      actorId: item.actorId || 'system',
      count: item._count.actorId,
    })),
    recentActivity,
  };
}

// Get recent audit logs
export async function getRecentAuditLogs(limit: number = 10): Promise<AuditLog[]> {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

// Get audit logs by date range
export async function getAuditLogsByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
  return prisma.auditLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}
