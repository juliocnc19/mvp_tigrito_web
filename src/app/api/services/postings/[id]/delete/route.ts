import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete posting (soft delete)
 * @description Soft delete a posting by setting deletedAt
 * @response 200:Posting deleted successfully
 * @response 404:Posting not found
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
          'ID de solicitud inválido'
        ),
        { status: 422 }
      );
    }

    // Check if posting exists
    const existingPosting = await prisma.servicePosting.findUnique({
      where: { id },
    });

    if (!existingPosting) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Solicitud no encontrada'
        ),
        { status: 404 }
      );
    }

    // Check if posting has associated transactions
    const hasTransactions = await prisma.serviceTransaction.findFirst({
      where: { postingId: id },
    });

    if (hasTransactions) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No se puede eliminar una solicitud que tiene transacciones asociadas'
        ),
        { status: 400 }
      );
    }

    // Soft delete posting
    await prisma.servicePosting.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      createSuccessResponse(null, 'Solicitud eliminada exitosamente')
    );

  } catch (error) {
    console.error('Delete posting error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al eliminar solicitud'
      ),
      { status: 500 }
    );
  }
}
