import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for updating a promo code
const UpdatePromoCodeSchema = z.object({
  code: z.string().min(1, 'El código es requerido').optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
  discountValue: z.number().min(0, 'El valor de descuento debe ser mayor o igual a 0').optional(),
  maxUses: z.number().min(1, 'El máximo de usos debe ser mayor a 0').optional(),
  maxUsesPerUser: z.number().min(1, 'El máximo de usos por usuario debe ser mayor a 0').optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  targetCategory: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Update promo code
 * @description Update a promo code by ID
 * @body UpdatePromoCodeSchema
 * @response 200:Promo code updated successfully
 * @response 404:Promo code not found
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
          'ID de código de promoción inválido'
        ),
        { status: 422 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = UpdatePromoCodeSchema.safeParse(body);
    
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

    // Check if promo code exists
    const existingPromoCode = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!existingPromoCode) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Código de promoción no encontrado'
        ),
        { status: 404 }
      );
    }

    // Check if new code is unique (if provided and different)
    if (validation.data.code && validation.data.code !== existingPromoCode.code) {
      const existingCode = await prisma.promoCode.findUnique({
        where: { code: validation.data.code },
      });

      if (existingCode) {
        return NextResponse.json(
          createErrorResponse(
            COMMON_ERROR_CODES.VALIDATION_ERROR,
            'Ya existe un código de promoción con este código'
          ),
          { status: 409 }
        );
      }
    }

    // Validate discount value based on type
    const discountType = validation.data.discountType || existingPromoCode.discountType;
    const discountValue = validation.data.discountValue !== undefined ? validation.data.discountValue : existingPromoCode.discountValue.toNumber();

    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'El descuento porcentual no puede ser mayor al 100%'
        ),
        { status: 400 }
      );
    }

    // Validate dates
    const validFrom = validation.data.validFrom ? new Date(validation.data.validFrom) : existingPromoCode.validFrom;
    const validUntil = validation.data.validUntil ? new Date(validation.data.validUntil) : existingPromoCode.validUntil;

    if (validUntil && validUntil <= validFrom) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'La fecha de vencimiento debe ser posterior a la fecha de inicio'
        ),
        { status: 400 }
      );
    }

    // Update promo code
    const updatedPromoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(validation.data.code && { code: validation.data.code }),
        ...(validation.data.discountType && { discountType: validation.data.discountType }),
        ...(validation.data.discountValue !== undefined && { discountValue: validation.data.discountValue }),
        ...(validation.data.maxUses !== undefined && { maxUses: validation.data.maxUses }),
        ...(validation.data.maxUsesPerUser !== undefined && { maxUsesPerUser: validation.data.maxUsesPerUser }),
        ...(validation.data.validFrom && { validFrom }),
        ...(validation.data.validUntil !== undefined && { validUntil }),
        ...(validation.data.targetCategory !== undefined && { targetCategory: validation.data.targetCategory }),
        ...(validation.data.isActive !== undefined && { isActive: validation.data.isActive }),
      },
    });

    // Map promo code data for response
    const promoCodeData = {
      id: updatedPromoCode.id,
      code: updatedPromoCode.code,
      discountType: updatedPromoCode.discountType,
      discountValue: updatedPromoCode.discountValue.toNumber(),
      maxUses: updatedPromoCode.maxUses,
      usesCount: updatedPromoCode.usesCount,
      maxUsesPerUser: updatedPromoCode.maxUsesPerUser,
      validFrom: updatedPromoCode.validFrom.toISOString(),
      validUntil: updatedPromoCode.validUntil?.toISOString() || null,
      targetCategory: updatedPromoCode.targetCategory,
      isActive: updatedPromoCode.isActive,
      createdAt: updatedPromoCode.createdAt.toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(promoCodeData, 'Código de promoción actualizado exitosamente')
    );

  } catch (error) {
    console.error('Update promo code error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al actualizar código de promoción'
      ),
      { status: 500 }
    );
  }
}
