import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating a professional service
const UpdateProfessionalServiceSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  slug: z.string().min(1, 'El slug es requerido').optional(),
  description: z.string().min(1, 'La descripción es requerida').optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional(),
  categoryId: z.string().min(1, 'La categoría es requerida').optional(),
  serviceLocations: z.any().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Update professional service
 * @description Update a professional service by ID
 * @body UpdateProfessionalServiceSchema
 * @response 200:Service updated successfully
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

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdateProfessionalServiceSchema.safeParse(body);
    
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

    // Check if new slug is unique (if provided and different)
    if (validation.data.slug && validation.data.slug !== existingService.slug) {
      const existingSlug = await prisma.professionalService.findUnique({
        where: { slug: validation.data.slug },
      });

      if (existingSlug) {
        return NextResponse.json(
          createErrorResponse(
            COMMON_ERROR_CODES.VALIDATION_ERROR,
            'Ya existe un servicio con este slug'
          ),
          { status: 409 }
        );
      }
    }

    // Check if category exists (if provided)
    if (validation.data.categoryId) {
      const category = await prisma.profession.findUnique({
        where: { id: validation.data.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          createErrorResponse(
            COMMON_ERROR_CODES.VALIDATION_ERROR,
            'Categoría no encontrada'
          ),
          { status: 400 }
        );
      }
    }

    // Update service
    const updatedService = await prisma.professionalService.update({
      where: { id },
      data: {
        ...(validation.data.title && { title: validation.data.title }),
        ...(validation.data.slug && { slug: validation.data.slug }),
        ...(validation.data.description && { description: validation.data.description }),
        ...(validation.data.price !== undefined && { price: validation.data.price }),
        ...(validation.data.categoryId && { categoryId: validation.data.categoryId }),
        ...(validation.data.serviceLocations !== undefined && { serviceLocations: validation.data.serviceLocations }),
        ...(validation.data.isActive !== undefined && { isActive: validation.data.isActive }),
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
      createSuccessResponse(serviceData, 'Servicio actualizado exitosamente')
    );

  } catch (error) {
    console.error('Update professional service error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar servicio'
      ),
      { status: 500 }
    );
  }
}
