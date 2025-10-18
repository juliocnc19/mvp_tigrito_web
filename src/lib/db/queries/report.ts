import { prisma } from '../prisma';
import { Report, Prisma } from '@prisma/client';
import { GetReportsQuerySchema } from '@/lib/schemas/report';
import { z } from 'zod';

// Create report
export async function createReport(data: {
  reporterId: string;
  reportedId?: string;
  serviceId?: string;
  reason: string;
  proofMedia?: any;
  status?: string;
  adminNotes?: string;
}): Promise<Report> {
  return prisma.report.create({
    data: {
      reporterId: data.reporterId,
      reportedId: data.reportedId,
      serviceId: data.serviceId,
      reason: data.reason,
      proofMedia: data.proofMedia,
      status: data.status || 'PENDING',
      adminNotes: data.adminNotes,
    },
  });
}

// Get report by ID
export async function getReportById(id: string): Promise<Report | null> {
  return prisma.report.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      media: true,
    },
  });
}

// Update report
export async function updateReport(id: string, data: {
  status?: string;
  adminNotes?: string;
}): Promise<Report> {
  return prisma.report.update({
    where: { id },
    data,
  });
}

// Delete report
export async function deleteReport(id: string): Promise<Report> {
  return prisma.report.delete({
    where: { id },
  });
}

// Get reports with filters and pagination
export async function getReports(query: z.infer<typeof GetReportsQuerySchema>): Promise<{
  reports: Report[];
  total: number;
}> {
  const { page, limit, reporterId, reportedId, serviceId, status } = query;
  
  const where: Prisma.ReportWhereInput = {};

  // Reporter filter
  if (reporterId) {
    where.reporterId = reporterId;
  }

  // Reported user filter
  if (reportedId) {
    where.reportedId = reportedId;
  }

  // Service filter
  if (serviceId) {
    where.serviceId = serviceId;
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: true,
        media: true,
      },
    }),
    prisma.report.count({ where }),
  ]);

  return { reports, total };
}

// Get reports by reporter
export async function getReportsByReporter(reporterId: string): Promise<Report[]> {
  return prisma.report.findMany({
    where: { reporterId },
    orderBy: { createdAt: 'desc' },
    include: {
      reportedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      media: true,
    },
  });
}

// Get reports by reported user
export async function getReportsByReportedUser(reportedId: string): Promise<Report[]> {
  return prisma.report.findMany({
    where: { reportedId },
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      media: true,
    },
  });
}

// Get reports by status
export async function getReportsByStatus(status: string): Promise<Report[]> {
  return prisma.report.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      media: true,
    },
  });
}

// Get report statistics
export async function getReportStats(): Promise<{
  total: number;
  pending: number;
  resolved: number;
  rejected: number;
  byReason: { reason: string; count: number }[];
}> {
  const [total, pending, resolved, rejected, byReason] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.report.count({ where: { status: 'RESOLVED' } }),
    prisma.report.count({ where: { status: 'REJECTED' } }),
    prisma.report.groupBy({
      by: ['reason'],
      _count: { reason: true },
      orderBy: { _count: { reason: 'desc' } },
    }),
  ]);

  return {
    total,
    pending,
    resolved,
    rejected,
    byReason: byReason.map(item => ({
      reason: item.reason,
      count: item._count.reason,
    })),
  };
}

// Get recent reports
export async function getRecentReports(limit: number = 10): Promise<Report[]> {
  return prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: true,
      media: true,
    },
  });
}
