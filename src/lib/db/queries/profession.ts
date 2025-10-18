import { prisma } from '../prisma';
import { Profession, Prisma } from '@prisma/client';
import { GetProfessionsQuerySchema, CreateProfessionRequestSchema, UpdateProfessionRequestSchema } from '@/lib/schemas/profession';
import { z } from 'zod';

// Get professions with filters and pagination
export async function getProfessions(query: z.infer<typeof GetProfessionsQuerySchema>): Promise<{
  professions: Profession[];
  total: number;
}> {
  const { page, limit, search } = query;

  const where: Prisma.ProfessionWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [professions, total] = await Promise.all([
    prisma.profession.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.profession.count({ where }),
  ]);

  return { professions, total };
}

// Get profession by ID
export async function getProfessionById(id: string): Promise<Profession | null> {
  return prisma.profession.findUnique({
    where: { id },
  });
}

// Get profession by slug
export async function getProfessionBySlug(slug: string): Promise<Profession | null> {
  return prisma.profession.findUnique({
    where: { slug },
  });
}


// Create profession
export async function createProfession(data: z.infer<typeof CreateProfessionRequestSchema>): Promise<Profession> {
  return prisma.profession.create({
    data,
  });
}

// Update profession
export async function updateProfession(id: string, data: z.infer<typeof UpdateProfessionRequestSchema>): Promise<Profession> {
  return prisma.profession.update({
    where: { id },
    data,
  });
}

// Delete profession
export async function deleteProfession(id: string): Promise<Profession> {
  return prisma.profession.delete({
    where: { id },
  });
}
