import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating posting status
const UpdatePostingStatusSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED', 'EXPIRED']),
  adminNotes: z.string().optional(),
});

/**
 * Update posting status
 * @description Update posting status and admin notes
 * @body UpdatePostingStatusSchema
 * @response 200:Posting updated successfully
 * @response 404:Posting not found
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
          'ID de solicitud inválido'
        ),
        { status: 422 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdatePostingStatusSchema.safeParse(body);
    
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

    // Get posting
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

    // Update posting
    const updatedPosting = await prisma.servicePosting.update({
      where: { id },
      data: {
        status: validation.data.status,
      },
      include: {
        client: {
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
        offers: {
          select: {
            id: true,
            price: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Map posting data
    const postingData = {
      id: updatedPosting.id,
      clientId: updatedPosting.clientId,
      title: updatedPosting.title,
      description: updatedPosting.description,
      categoryId: updatedPosting.categoryId,
      lat: updatedPosting.lat,
      lng: updatedPosting.lng,
      address: updatedPosting.address,
      requiredFrom: updatedPosting.requiredFrom?.toISOString() || null,
      requiredTo: updatedPosting.requiredTo?.toISOString() || null,
      priceMin: updatedPosting.priceMin?.toNumber() || null,
      priceMax: updatedPosting.priceMax?.toNumber() || null,
      status: updatedPosting.status,
      createdAt: updatedPosting.createdAt.toISOString(),
      updatedAt: updatedPosting.updatedAt.toISOString(),
      expiresAt: updatedPosting.expiresAt?.toISOString() || null,
      transactionId: updatedPosting.transactionId,
      budget: updatedPosting.budget?.toNumber() || null,
      deletedAt: updatedPosting.deletedAt?.toISOString() || null,
      locationLat: updatedPosting.locationLat,
      locationLng: updatedPosting.locationLng,
      client: updatedPosting.client,
      category: updatedPosting.category,
      offers: updatedPosting.offers,
    };

    return NextResponse.json(
      createSuccessResponse(postingData, 'Solicitud actualizada exitosamente')
    );

  } catch (error) {
    console.error('Update posting error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar solicitud'
      ),
      { status: 500 }
    );
  }
}
