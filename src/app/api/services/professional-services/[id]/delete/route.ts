import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete professional service
 * @description Delete a professional service by ID
 * @response 200:Service deleted successfully
 * @response 404:Service not found
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
          'ID de servicio inválido'
        ),
        { status: 422 }
      );
    }

    // Check if service exists
    const existingService = await prisma.professionalService.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Servicio no encontrado'
        ),
        { status: 404 }
      );
    }

    // Check if service has associated transactions
    const hasTransactions = await prisma.serviceTransaction.findFirst({
      where: { proServiceId: id },
    });

    if (hasTransactions) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No se puede eliminar un servicio que tiene transacciones asociadas'
        ),
        { status: 400 }
      );
    }

    // Delete service
    await prisma.professionalService.delete({
      where: { id },
    });

    return NextResponse.json(
      createSuccessResponse(null, 'Servicio eliminado exitosamente')
    );

  } catch (error) {
    console.error('Delete professional service error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al eliminar servicio'
      ),
      { status: 500 }
    );
  }
}
