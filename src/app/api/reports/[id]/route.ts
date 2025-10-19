import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Get report by ID
 * @description Retrieve a specific report with full details
 * @response 200:Report retrieved successfully
 * @response 404:Report not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'ID de reporte inválido'
        ),
        { status: 422 }
      );
    }

    // Get report with full details
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            isIDVerified: true,
            locationAddress: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            isIDVerified: true,
            locationAddress: true,
            professionalProfile: {
              select: {
                bio: true,
                rating: true,
                ratingCount: true,
                yearsOfExperience: true,
                specialties: true,
              },
            },
          },
        },
        service: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            professional: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
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
            reviews: {
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                reviewed: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
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
            sizeBytes: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Reporte no encontrado'
        ),
        { status: 404 }
      );
    }

    // Map report data
    const reportData = {
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
    };

    return NextResponse.json(
      createSuccessResponse(reportData, 'Reporte obtenido exitosamente')
    );

  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener reporte'
      ),
      { status: 500 }
    );
  }
}
