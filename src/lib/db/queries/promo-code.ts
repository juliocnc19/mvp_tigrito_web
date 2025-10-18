import { prisma } from '../prisma';
import { PromoCode, Prisma } from '@prisma/client';
import { GetPromoCodesQuerySchema } from '@/lib/schemas/promo-code';
import { z } from 'zod';

// Create promo code
export async function createPromoCode(data: {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  targetCategory?: string;
  isActive?: boolean;
}): Promise<PromoCode> {
  return prisma.promoCode.create({
    data: {
      code: data.code,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxUses: data.maxUses,
      maxUsesPerUser: data.maxUsesPerUser,
      validFrom: data.validFrom || new Date(),
      validUntil: data.validUntil,
      targetCategory: data.targetCategory,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
}

// Get promo code by ID
export async function getPromoCodeById(id: string): Promise<PromoCode | null> {
  return prisma.promoCode.findUnique({
    where: { id },
    include: {
      usageHistory: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      transactions: true,
    },
  });
}

// Get promo code by code
export async function getPromoCodeByCode(code: string): Promise<PromoCode | null> {
  return prisma.promoCode.findUnique({
    where: { code },
    include: {
      usageHistory: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      transactions: true,
    },
  });
}

// Update promo code
export async function updatePromoCode(id: string, data: {
  code?: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  targetCategory?: string;
  isActive?: boolean;
}): Promise<PromoCode> {
  return prisma.promoCode.update({
    where: { id },
    data,
  });
}

// Delete promo code
export async function deletePromoCode(id: string): Promise<PromoCode> {
  return prisma.promoCode.delete({
    where: { id },
  });
}

// Get promo codes with filters and pagination
export async function getPromoCodes(query: z.infer<typeof GetPromoCodesQuerySchema>): Promise<{
  promoCodes: PromoCode[];
  total: number;
}> {
  const { page, limit, code, isActive, targetCategory } = query;
  
  const where: Prisma.PromoCodeWhereInput = {};

  // Code filter
  if (code) {
    where.code = { contains: code, mode: 'insensitive' };
  }

  // Active filter
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  // Target category filter
  if (targetCategory) {
    where.targetCategory = targetCategory;
  }

  const [promoCodes, total] = await Promise.all([
    prisma.promoCode.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        usageHistory: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        transactions: true,
      },
    }),
    prisma.promoCode.count({ where }),
  ]);

  return { promoCodes, total };
}

// Get active promo codes
export async function getActivePromoCodes(): Promise<PromoCode[]> {
  return prisma.promoCode.findMany({
    where: { 
      isActive: true,
      validFrom: { lte: new Date() },
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get promo code statistics
export async function getPromoCodeStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  totalUses: number;
  totalDiscount: number;
  mostUsed: { code: string; uses: number }[];
}> {
  const [total, active, inactive, totalUses, totalDiscount, mostUsed] = await Promise.all([
    prisma.promoCode.count(),
    prisma.promoCode.count({ where: { isActive: true } }),
    prisma.promoCode.count({ where: { isActive: false } }),
    prisma.promoCodeUsage.count(),
    prisma.promoCodeUsage.count(),
    prisma.promoCode.findMany({
      select: {
        code: true,
        usesCount: true,
      },
      orderBy: { usesCount: 'desc' },
      take: 5,
    }),
  ]);

  return {
    total,
    active,
    inactive,
    totalUses,
    totalDiscount: 0, // This would need to be calculated based on actual usage
    mostUsed: mostUsed.map(item => ({
      code: item.code,
      uses: item.usesCount,
    })),
  };
}

// Get recent promo codes
export async function getRecentPromoCodes(limit: number = 10): Promise<PromoCode[]> {
  return prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      usageHistory: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

// Validate promo code
export async function validatePromoCode(code: string, userId: string): Promise<{
  valid: boolean;
  promoCode?: PromoCode;
  error?: string;
}> {
  const promoCode = await getPromoCodeByCode(code);
  
  if (!promoCode) {
    return { valid: false, error: 'Promo code not found' };
  }

  if (!promoCode.isActive) {
    return { valid: false, error: 'Promo code is inactive' };
  }

  if (promoCode.validFrom && promoCode.validFrom > new Date()) {
    return { valid: false, error: 'Promo code is not yet valid' };
  }

  if (promoCode.validUntil && promoCode.validUntil < new Date()) {
    return { valid: false, error: 'Promo code has expired' };
  }

  if (promoCode.maxUses && promoCode.usesCount >= promoCode.maxUses) {
    return { valid: false, error: 'Promo code has reached maximum uses' };
  }

  if (promoCode.maxUsesPerUser) {
    const userUses = await prisma.promoCodeUsage.count({
      where: {
        codeId: promoCode.id,
        userId: userId,
      },
    });

    if (userUses >= promoCode.maxUsesPerUser) {
      return { valid: false, error: 'You have reached the maximum uses for this promo code' };
    }
  }

  return { valid: true, promoCode };
}
