import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete report
 * @description Delete a report by ID
 * @response 200:Report deleted successfully
 * @response 404:Report not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(
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

    // Check if report exists
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

    // Delete report
    await prisma.report.delete({
      where: { id },
    });

    return NextResponse.json(
      createSuccessResponse(null, 'Reporte eliminado exitosamente')
    );

  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al eliminar reporte'
      ),
      { status: 500 }
    );
  }
}
