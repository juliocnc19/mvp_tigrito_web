import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for creating a professional service
const CreateProfessionalServiceSchema = z.object({
  professionalId: z.string().min(1, 'ID del profesional es requerido'),
  title: z.string().min(1, 'El título es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  serviceLocations: z.any().optional(),
  isActive: z.boolean().default(true),
});

/**
 * Create a new professional service
 * @description Create a new professional service in the system
 * @body CreateProfessionalServiceSchema
 * @response 201:Service created successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 [POST /api/services/professional-services/create] Request body:', body);
    
    // Validate request body
    const validation = CreateProfessionalServiceSchema.safeParse(body);
    
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

    // Check if professional exists
    const professional = await prisma.user.findUnique({
      where: { id: validation.data.professionalId },
      select: { id: true, role: true },
    });

    if (!professional || professional.role !== 'PROFESSIONAL') {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Profesional no encontrado o no válido'
        ),
        { status: 400 }
      );
    }

    // Check if category exists
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

    // Check if slug is unique
    const existingService = await prisma.professionalService.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existingService) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Ya existe un servicio con este slug'
        ),
        { status: 409 }
      );
    }

    // Create service
    const newService = await prisma.professionalService.create({
      data: {
        professionalId: validation.data.professionalId,
        title: validation.data.title,
        slug: validation.data.slug,
        description: validation.data.description,
        price: validation.data.price,
        categoryId: validation.data.categoryId,
        serviceLocations: validation.data.serviceLocations || null,
        isActive: validation.data.isActive,
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
      id: newService.id,
      professionalId: newService.professionalId,
      title: newService.title,
      slug: newService.slug,
      description: newService.description,
      price: newService.price.toNumber(),
      categoryId: newService.categoryId,
      serviceLocations: newService.serviceLocations,
      isActive: newService.isActive,
      createdAt: newService.createdAt.toISOString(),
      updatedAt: newService.updatedAt.toISOString(),
      professionalProfileId: newService.professionalProfileId,
      professional: newService.professional,
      category: newService.category,
    };

    return NextResponse.json(
      createSuccessResponse(
        serviceData,
        'Servicio creado exitosamente'
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create professional service error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al crear servicio'
      ),
      { status: 500 }
    );
  }
}
