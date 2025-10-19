import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for creating a promo code
const CreatePromoCodeSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().min(0, 'El valor de descuento debe ser mayor o igual a 0'),
  maxUses: z.number().min(1, 'El máximo de usos debe ser mayor a 0').optional(),
  maxUsesPerUser: z.number().min(1, 'El máximo de usos por usuario debe ser mayor a 0').optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  targetCategory: z.string().optional(),
  isActive: z.boolean().default(true),
});

/**
 * Create a new promo code
 * @description Create a new promo code in the system
 * @body CreatePromoCodeSchema
 * @response 201:Promo code created successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 [POST /api/promo-codes/create] Request body:', body);
    
    // Validate request body
    const validation = CreatePromoCodeSchema.safeParse(body);
    
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

    // Check if code already exists
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

    // Validate discount value based on type
    if (validation.data.discountType === 'PERCENTAGE' && validation.data.discountValue > 100) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'El descuento porcentual no puede ser mayor al 100%'
        ),
        { status: 400 }
      );
    }

    // Validate dates
    const validFrom = validation.data.validFrom ? new Date(validation.data.validFrom) : new Date();
    const validUntil = validation.data.validUntil ? new Date(validation.data.validUntil) : null;

    if (validUntil && validUntil <= validFrom) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'La fecha de vencimiento debe ser posterior a la fecha de inicio'
        ),
        { status: 400 }
      );
    }

    // Create promo code
    const newPromoCode = await prisma.promoCode.create({
      data: {
        code: validation.data.code,
        discountType: validation.data.discountType,
        discountValue: validation.data.discountValue,
        maxUses: validation.data.maxUses,
        maxUsesPerUser: validation.data.maxUsesPerUser,
        validFrom,
        validUntil,
        targetCategory: validation.data.targetCategory,
        isActive: validation.data.isActive,
      },
    });

    // Map promo code data for response
    const promoCodeData = {
      id: newPromoCode.id,
      code: newPromoCode.code,
      discountType: newPromoCode.discountType,
      discountValue: newPromoCode.discountValue.toNumber(),
      maxUses: newPromoCode.maxUses,
      usesCount: newPromoCode.usesCount,
      maxUsesPerUser: newPromoCode.maxUsesPerUser,
      validFrom: newPromoCode.validFrom.toISOString(),
      validUntil: newPromoCode.validUntil?.toISOString() || null,
      targetCategory: newPromoCode.targetCategory,
      isActive: newPromoCode.isActive,
      createdAt: newPromoCode.createdAt.toISOString(),
    };

    return NextResponse.json(
      createSuccessResponse(
        promoCodeData,
        'Código de promoción creado exitosamente'
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create promo code error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al crear código de promoción'
      ),
      { status: 500 }
    );
  }
}
