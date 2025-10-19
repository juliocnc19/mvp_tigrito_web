import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Toggle service active status
 * @description Toggle the active status of a professional service
 * @response 200:Service status updated successfully
 * @response 404:Service not found
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
          'ID de servicio inválido'
        ),
        { status: 422 }
      );
    }

    // Get service
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

    // Toggle active status
    const updatedService = await prisma.professionalService.update({
      where: { id },
      data: {
        isActive: !existingService.isActive,
      },
      include: {
        professional: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Map service data for response
    const serviceData = {
      id: updatedService.id,
      professionalId: updatedService.professionalId,
      title: updatedService.title,
      slug: updatedService.slug,
      description: updatedService.description,
      price: updatedService.price.toNumber(),
      categoryId: updatedService.categoryId,
      serviceLocations: updatedService.serviceLocations,
      isActive: updatedService.isActive,
      createdAt: updatedService.createdAt.toISOString(),
      updatedAt: updatedService.updatedAt.toISOString(),
      professionalProfileId: updatedService.professionalProfileId,
      professional: updatedService.professional,
      category: updatedService.category,
    };

    return NextResponse.json(
      createSuccessResponse(
        serviceData, 
        `Servicio ${updatedService.isActive ? 'activado' : 'desactivado'} exitosamente`
      )
    );

  } catch (error) {
    console.error('Toggle service active status error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al cambiar estado del servicio'
      ),
      { status: 500 }
    );
  }
}
