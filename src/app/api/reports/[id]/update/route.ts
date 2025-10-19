import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating report status
const UpdateReportStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED']),
  adminNotes: z.string().optional(),
});

/**
 * Update report status
 * @description Update report status and admin notes
 * @body UpdateReportStatusSchema
 * @response 200:Report updated successfully
 * @response 404:Report not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(
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

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateReportStatusSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Datos de solicitud inválidos',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    // Get report
    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Reporte no encontrado'
        ),
        { status: 404 }
      );
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status: validation.data.status,
        adminNotes: validation.data.adminNotes,
      },
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
        transaction: {
          select: {
            id: true,
            currentStatus: true,
            priceAgreed: true,
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
    });

    // Map report data
    const reportData = {
      id: updatedReport.id,
      reporterId: updatedReport.reporterId,
      reportedUserId: updatedReport.reportedUserId,
      transactionId: updatedReport.transactionId,
      reason: updatedReport.reason,
      description: updatedReport.description,
      status: updatedReport.status,
      adminNotes: updatedReport.adminNotes,
      createdAt: updatedReport.createdAt.toISOString(),
      updatedAt: updatedReport.updatedAt.toISOString(),
      reporter: updatedReport.reporter,
      reportedUser: updatedReport.reportedUser,
      transaction: updatedReport.transaction,
      media: updatedReport.media,
    };

    return NextResponse.json(
      createSuccessResponse(reportData, 'Reporte actualizado exitosamente')
    );

  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar reporte'
      ),
      { status: 500 }
    );
  }
}
