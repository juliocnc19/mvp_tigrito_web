import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete offer
 * @description Delete an offer by ID
 * @response 200:Offer deleted successfully
 * @response 404:Offer not found
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
          'ID de oferta inválido'
        ),
        { status: 422 }
      );
    }

    // Check if offer exists
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!existingOffer) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Oferta no encontrada'
        ),
        { status: 404 }
      );
    }

    // Check if offer has associated transactions
    const hasTransactions = await prisma.serviceTransaction.findFirst({
      where: { offerId: id },
    });

    if (hasTransactions) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No se puede eliminar una oferta que tiene transacciones asociadas'
        ),
        { status: 400 }
      );
    }

    // Delete offer
    await prisma.offer.delete({
      where: { id },
    });

    return NextResponse.json(
      createSuccessResponse(null, 'Oferta eliminada exitosamente')
    );

  } catch (error) {
    console.error('Delete offer error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al eliminar oferta'
      ),
      { status: 500 }
    );
  }
}
