import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get reports list for admin
 * @description Retrieve paginated list of reports with filters
 * @query page, limit, status, search
 * @response 200:Reports retrieved successfully
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
      where.status = status;
    }

    if (search) {
      where.OR = [
        { reporter: { name: { contains: search, mode: 'insensitive' } } },
        { reporter: { email: { contains: search, mode: 'insensitive' } } },
        { reportedUser: { name: { contains: search, mode: 'insensitive' } } },
        { reportedUser: { email: { contains: search, mode: 'insensitive' } } },
        { reason: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get reports with pagination
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
              role: true,
            },
          },
          reportedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          service: {
            select: {
              id: true,
              currentStatus: true,
              priceAgreed: true,
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              professional: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          media: {
            select: {
              id: true,
              url: true,
              type: true,
              filename: true,
            },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    // Map reports data
    const reportsData = reports.map(report => ({
      id: report.id,
      reporterId: report.reporterId,
      reportedId: report.reportedId,
      serviceId: report.serviceId,
      reason: report.reason,
      proofMedia: report.proofMedia,
      status: report.status,
      adminNotes: report.adminNotes,
      createdAt: report.createdAt.toISOString(),
      reporter: report.reporter,
      reportedUser: report.reportedUser,
      service: report.service,
      media: report.media,
    }));

    return NextResponse.json(
      createSuccessResponse(
        reportsData,
        'Reportes obtenidos exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener reportes'
      ),
      { status: 500 }
    );
  }
}
