import { prisma } from '../prisma';
import { Offer, Prisma } from '@prisma/client';
import { GetOffersQuerySchema } from '@/lib/schemas/offer';
import { z } from 'zod';

// Create offer
export async function createOffer(data: {
  postingId: string;
  professionalId: string;
  price: number;
  message?: string;
  proposedPrice?: number;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}): Promise<Offer> {
  return prisma.offer.create({
    data: {
      postingId: data.postingId,
      professionalId: data.professionalId,
      price: data.price,
      message: data.message,
      proposedPrice: data.proposedPrice,
      status: data.status || 'PENDING',
    },
  });
}

// Get offer by ID
export async function getOfferById(id: string): Promise<Offer | null> {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      posting: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
      professional: {
        include: {
          professionalProfile: {
            select: {
              id: true,
              rating: true,
              ratingCount: true,
              bio: true,
            },
          },
        },
      },
      transactions: true,
    },
  });
}

// Update offer
export async function updateOffer(id: string, data: {
  price?: number;
  message?: string;
  proposedPrice?: number;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}): Promise<Offer> {
  return prisma.offer.update({
    where: { id },
    data,
  });
}

// Get offers with filters and pagination
export async function getOffers(query: z.infer<typeof GetOffersQuerySchema>): Promise<{
  offers: Offer[];
  total: number;
}> {
  const { page, limit, postingId, professionalId, status, minPrice, maxPrice } = query;
  
  const where: Prisma.OfferWhereInput = {};

  // Posting filter
  if (postingId) {
    where.postingId = postingId;
  }

  // Professional filter
  if (professionalId) {
    where.professionalId = professionalId;
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Price filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  const [offers, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        posting: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            category: true,
          },
        },
        professional: {
          include: {
            professionalProfile: {
              select: {
                id: true,
                rating: true,
                ratingCount: true,
                bio: true,
              },
            },
          },
        },
        transactions: true,
      },
    }),
    prisma.offer.count({ where }),
  ]);

  return { offers, total };
}

// Get offers by posting
export async function getOffersByPosting(postingId: string): Promise<Offer[]> {
  return prisma.offer.findMany({
    where: { postingId },
    orderBy: { createdAt: 'desc' },
    include: {
      professional: {
        include: {
          professionalProfile: {
            select: {
              id: true,
              rating: true,
              ratingCount: true,
              bio: true,
            },
          },
        },
      },
    },
  });
}

// Get offers by professional
export async function getOffersByProfessional(professionalId: string): Promise<Offer[]> {
  return prisma.offer.findMany({
    where: { professionalId },
    orderBy: { createdAt: 'desc' },
    include: {
      posting: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
    },
  });
}

// Get offers by status
export async function getOffersByStatus(status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): Promise<Offer[]> {
  return prisma.offer.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
    include: {
      posting: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
      professional: {
        include: {
          professionalProfile: {
            select: {
              id: true,
              rating: true,
              ratingCount: true,
              bio: true,
            },
          },
        },
      },
    },
  });
}

// Get offer statistics
export async function getOfferStats(): Promise<{
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  averagePrice: number;
  totalValue: number;
}> {
  const [total, pending, accepted, rejected, priceStats] = await Promise.all([
    prisma.offer.count(),
    prisma.offer.count({ where: { status: 'PENDING' } }),
    prisma.offer.count({ where: { status: 'ACCEPTED' } }),
    prisma.offer.count({ where: { status: 'REJECTED' } }),
    prisma.offer.aggregate({
      _avg: { price: true },
      _sum: { price: true },
    }),
  ]);

  return {
    total,
    pending,
    accepted,
    rejected,
    averagePrice: priceStats._avg.price?.toNumber() || 0,
    totalValue: priceStats._sum.price?.toNumber() || 0,
  };
}

// Get recent offers
export async function getRecentOffers(limit: number = 10): Promise<Offer[]> {
  return prisma.offer.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      posting: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          category: true,
        },
      },
      professional: {
        include: {
          professionalProfile: {
            select: {
              id: true,
              rating: true,
              ratingCount: true,
              bio: true,
            },
          },
        },
      },
    },
  });
}

// Update offer status
export async function updateOfferStatus(id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED'): Promise<Offer> {
  return prisma.offer.update({
    where: { id },
    data: { status },
  });
}
