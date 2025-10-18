import { prisma } from '../prisma';
import { ProfessionalService, Prisma } from '@prisma/client';
import { GetProfessionalServicesQuerySchema } from '@/lib/schemas/professional-service';
import { z } from 'zod';

// Create professional service
export async function createProfessionalService(data: {
  professionalId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  serviceLocations?: any;
  professionalProfileId?: string;
}): Promise<ProfessionalService> {
  return prisma.professionalService.create({
    data: {
      professionalId: data.professionalId,
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      serviceLocations: data.serviceLocations,
      professionalProfileId: data.professionalProfileId,
    },
  });
}

// Get professional service by ID
export async function getProfessionalServiceById(id: string): Promise<any> {
  return prisma.professionalService.findUnique({
    where: { id },
    include: {
      professional: { select: { id: true, name: true, email: true, phone: true } },
      category: { select: { id: true, name: true, slug: true } },
      ProfessionalProfile: { select: { id: true, bio: true, rating: true, ratingCount: true } },
      media: true,
    },
  });
}

// Get professional services with filters and pagination
export async function getProfessionalServices(query: z.infer<typeof GetProfessionalServicesQuerySchema>): Promise<{
  services: any[];
  total: number;
}> {
  const { page, limit, professionalId, categoryId, search, isActive, minPrice, maxPrice } = query;

  const where: Prisma.ProfessionalServiceWhereInput = {};

  if (professionalId) where.professionalId = professionalId;
  if (categoryId) where.categoryId = categoryId;
  if (isActive !== undefined) where.isActive = isActive;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [services, total] = await Promise.all([
    prisma.professionalService.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        professional: { select: { id: true, name: true, email: true, phone: true } },
        category: { select: { id: true, name: true, slug: true } },
        ProfessionalProfile: { select: { id: true, bio: true, rating: true, ratingCount: true } },
        media: true,
      },
    }),
    prisma.professionalService.count({ where }),
  ]);

  return { services, total };
}

// Update professional service
export async function updateProfessionalService(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    serviceLocations?: any;
    isActive?: boolean;
  }
): Promise<ProfessionalService> {
  return prisma.professionalService.update({
    where: { id },
    data,
  });
}

// Delete professional service
export async function deleteProfessionalService(id: string): Promise<ProfessionalService> {
  return prisma.professionalService.delete({
    where: { id },
  });
}

// Get professional services by professional
export async function getProfessionalServicesByProfessional(
  professionalId: string,
  query: { page: number; limit: number; isActive?: boolean }
): Promise<{ services: any[]; total: number }> {
  const { page, limit, isActive } = query;

  const where: Prisma.ProfessionalServiceWhereInput = {
    professionalId,
  };

  if (isActive !== undefined) where.isActive = isActive;

  const [services, total] = await Promise.all([
    prisma.professionalService.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        media: true,
        _count: { select: { transactions: true } },
      },
    }),
    prisma.professionalService.count({ where }),
  ]);

  return { services, total };
}
