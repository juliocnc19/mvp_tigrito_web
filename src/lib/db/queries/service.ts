import { prisma } from '../prisma';
import { ServicePosting, Offer, ServiceTransaction, Prisma, ServiceStatus } from '@prisma/client';
import { GetServicePostingsQuerySchema, GetServiceOffersQuerySchema } from '@/lib/schemas/service';
import { z } from 'zod';

// ==================== SERVICE POSTING QUERIES ====================

// Create service posting
export async function createServicePosting(data: {
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline?: Date;
  location?: string;
  locationLat?: number;
  locationLng?: number;
}): Promise<ServicePosting> {
  return prisma.servicePosting.create({
    data: {
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      categoryId: data.category,
      budget: data.budget,
      requiredTo: data.deadline,
      address: data.location,
      locationLat: data.locationLat,
      locationLng: data.locationLng,
      status: 'OPEN',
    },
  });
}

// Get service posting by ID
export async function getServicePostingById(id: string): Promise<any> {
  return prisma.servicePosting.findUnique({
    where: { id },
    include: {
      client: true,
      offers: { include: { professional: true } },
      transaction: true,
    },
  });
}

// Get service postings by client
export async function getServicePostingsByClient(clientId: string): Promise<ServicePosting[]> {
  return prisma.servicePosting.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
  });
}

// Update service posting
export async function updateServicePosting(
  id: string,
  data: Partial<ServicePosting>
): Promise<ServicePosting> {
  return prisma.servicePosting.update({
    where: { id },
    data,
  });
}

// Get service postings with filters and pagination
export async function getServicePostings(
  query: z.infer<typeof GetServicePostingsQuerySchema>
): Promise<{ postings: any[]; total: number }> {
  const {
    page,
    limit,
    status,
    category,
    minBudget,
    maxBudget,
    search,
    locationLat,
    locationLng,
    radius,
    sortBy = 'recent',
    sortDirection = 'desc',
  } = query;

  const where: Prisma.ServicePostingWhereInput = {};

  if (status) {
    where.status = status as any;
  }
  if (category) where.categoryId = category;
  
  if (minBudget !== undefined || maxBudget !== undefined) {
    where.budget = {};
    if (minBudget !== undefined) where.budget.gte = minBudget;
    if (maxBudget !== undefined) where.budget.lte = maxBudget;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (locationLat && locationLng && radius) {
    where.AND = [
      { lat: { gte: locationLat - (radius / 111), lte: locationLat + (radius / 111) } },
      { lng: { gte: locationLng - (radius / 111), lte: locationLng + (radius / 111) } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'budget') orderBy = { budget: sortDirection };
  else if (sortBy === 'deadline') orderBy = { requiredTo: sortDirection };

  const [postings, total] = await Promise.all([
    prisma.servicePosting.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        client: true,
        offers: true,
      },
    }),
    prisma.servicePosting.count({ where }),
  ]);

  return { postings, total };
}

// Delete service posting (soft delete)
export async function deleteServicePosting(id: string): Promise<ServicePosting> {
  return prisma.servicePosting.update({
    where: { id },
    data: { status: 'CLOSED' },
  });
}

// ==================== SERVICE OFFER QUERIES ====================

// Create service offer
export async function createServiceOffer(data: {
  postingId: string;
  professionalId: string;
  proposedPrice: number;
  description: string;
  estimatedDuration: number;
}): Promise<Offer> {
  return prisma.offer.create({
    data: {
      postingId: data.postingId,
      professionalId: data.professionalId,
      price: data.proposedPrice,
      message: data.description,
      status: 'PENDING',
    },
  });
}

// Get service offer by ID
export async function getServiceOfferById(id: string): Promise<any> {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      posting: true,
      professional: true,
    },
  });
}

// Get service offers by posting
export async function getServiceOffersByPosting(postingId: string): Promise<Offer[]> {
  return prisma.offer.findMany({
    where: { postingId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get service offers by professional
export async function getServiceOffersByProfessional(professionalId: string): Promise<any[]> {
  return prisma.offer.findMany({
    where: { professionalId },
    include: { posting: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Update service offer
export async function updateServiceOffer(
  id: string,
  data: Partial<Offer>
): Promise<Offer> {
  return prisma.offer.update({
    where: { id },
    data,
  });
}

// Get service offers with pagination
export async function getServiceOffers(
  postingId: string,
  query: z.infer<typeof GetServiceOffersQuerySchema>
): Promise<{ offers: any[]; total: number }> {
  const { page, limit, status, sortBy = 'recent', sortDirection = 'desc' } = query;

  const where: Prisma.OfferWhereInput = { postingId };
  if (status) where.status = status as any;

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'price') orderBy = { price: sortDirection };
  else if (sortBy === 'duration') orderBy = { createdAt: sortDirection };

  const [offers, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        professional: true,
      },
    }),
    prisma.offer.count({ where }),
  ]);

  return { offers, total };
}

// ==================== SERVICE TRANSACTION QUERIES ====================

// Create service transaction
export async function createServiceTransaction(data: {
  postingId: string;
  offerId: string;
  clientId: string;
  professionalId: string;
  agreedPrice: number;
}): Promise<ServiceTransaction> {
  return prisma.serviceTransaction.create({
    data: {
      postingId: data.postingId,
      clientId: data.clientId,
      professionalId: data.professionalId,
      priceAgreed: data.agreedPrice,
      currentStatus: 'PENDING_SOLICITUD',
    },
  });
}

// Get service transaction by ID
export async function getServiceTransactionById(id: string): Promise<any> {
  return prisma.serviceTransaction.findUnique({
    where: { id },
    include: {
      posting: true,
      client: true,
      professional: true,
    },
  });
}

// Get service transactions by client
export async function getServiceTransactionsByClient(clientId: string): Promise<any[]> {
  return prisma.serviceTransaction.findMany({
    where: { clientId },
    include: {
      posting: true,
      professional: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get service transactions by professional
export async function getServiceTransactionsByProfessional(professionalId: string): Promise<any[]> {
  return prisma.serviceTransaction.findMany({
    where: { professionalId },
    include: {
      posting: true,
      client: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Update service transaction
export async function updateServiceTransaction(
  id: string,
  data: {
    currentStatus?: ServiceStatus;
    scheduledDate?: Date;
    notes?: string;
    priceAgreed?: number;
    discountAmount?: number;
    platformFee?: number;
    escrowAmount?: number;
  }
): Promise<ServiceTransaction> {
  return prisma.serviceTransaction.update({
    where: { id },
    data,
  });
}

// Get service transaction statistics
export async function getServiceTransactionStats(userId: string): Promise<{
  totalTransactions: number;
  completedTransactions: number;
  totalValue: number;
  averageValue: number;
}> {
  const transactions = await prisma.serviceTransaction.findMany({
    where: {
      OR: [
        { clientId: userId },
        { professionalId: userId },
      ],
    },
  });

  const completedTransactions = transactions.filter(t => t.currentStatus === 'COMPLETED');
  const totalValue = transactions.reduce((sum, t) => sum + Number(t.priceAgreed), 0);

  return {
    totalTransactions: transactions.length,
    completedTransactions: completedTransactions.length,
    totalValue,
    averageValue: transactions.length > 0 ? totalValue / transactions.length : 0,
  };
}
