import { prisma } from '../prisma';
import { ProfessionalProfile, Prisma } from '@prisma/client';
import { GetProfessionalsQuerySchema } from '@/lib/schemas/professional';
import { z } from 'zod';

// Create professional profile
export async function createProfessionalProfile(data: {
  userId: string;
  bio?: string;
  yearsOfExperience?: number;
  certifications?: string;
  specialties?: string[];
  hourlyRate?: number;
  bankAccount?: string;
  taxId?: string;
}): Promise<ProfessionalProfile> {
  return prisma.professionalProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      yearsOfExperience: data.yearsOfExperience,
      certifications: data.certifications,
      hourlyRate: data.hourlyRate,
      bankAccount: data.bankAccount,
      taxId: data.taxId,
    },
  });
}

// Get professional by ID
export async function getProfessionalById(id: string): Promise<any> {
  return prisma.professionalProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          role: true,
          isVerified: true,
          createdAt: true,
          locationLat: true,
          locationLng: true,
          locationAddress: true,
        },
      },
      servicesOffered: true,
      reviews: true,
    },
  });
}

// Get professional by user ID
export async function getProfessionalByUserId(userId: string): Promise<any> {
  return prisma.professionalProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          role: true,
          isVerified: true,
          createdAt: true,
          locationLat: true,
          locationLng: true,
          locationAddress: true,
        },
      },
      servicesOffered: true,
      reviews: true,
    },
  });
}

// Get professionals with filters and pagination
export async function getProfessionals(query: z.infer<typeof GetProfessionalsQuerySchema>): Promise<{
  professionals: any[];
  total: number;
}> {
  const { page, limit, specialty, minRating, maxHourlyRate, minExperience, isVerified, search, locationLat, locationLng, radius, sortBy, sortDirection } = query;

  const where: Prisma.ProfessionalProfileWhereInput = {};

  if (specialty) {
    where.specialties = { has: specialty };
  }

  if (minRating !== undefined) {
    where.reviews = {
      some: {
        rating: { gte: minRating }
      }
    };
  }

  if (maxHourlyRate !== undefined) {
    where.hourlyRate = { lte: maxHourlyRate };
  }

  if (minExperience !== undefined) {
    where.yearsOfExperience = { gte: minExperience };
  }

  if (isVerified !== undefined) {
    where.user = {
      isVerified: isVerified
    };
  }

  if (search) {
    where.OR = [
      { bio: { contains: search, mode: 'insensitive' } },
      { specialties: { has: search } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (locationLat !== undefined && locationLng !== undefined && radius !== undefined) {
    // This would need a more complex query for geospatial search
    // For now, we'll just include all professionals
  }

  const orderBy: Prisma.ProfessionalProfileOrderByWithRelationInput = {};
  if (sortBy === 'rating') {
    orderBy.reviews = { _count: sortDirection || 'desc' };
  } else if (sortBy === 'experience') {
    orderBy.yearsOfExperience = sortDirection || 'desc';
  } else if (sortBy === 'hourlyRate') {
    orderBy.hourlyRate = sortDirection || 'asc';
  } else {
    orderBy.createdAt = sortDirection || 'desc';
  }

  const [professionals, total] = await Promise.all([
    prisma.professionalProfile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            role: true,
            isVerified: true,
            createdAt: true,
            locationLat: true,
            locationLng: true,
            locationAddress: true,
          },
        },
        servicesOffered: true,
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.professionalProfile.count({ where }),
  ]);

  return { professionals, total };
}

// Update professional profile
export async function updateProfessionalProfile(id: string, data: {
  bio?: string;
  yearsOfExperience?: number;
  certifications?: string;
  specialties?: string[];
  hourlyRate?: number;
  bankAccount?: string;
  taxId?: string;
}): Promise<ProfessionalProfile> {
  return prisma.professionalProfile.update({
    where: { id },
    data,
  });
}

// Delete professional profile
export async function deleteProfessionalProfile(id: string): Promise<ProfessionalProfile> {
  return prisma.professionalProfile.delete({
    where: { id },
  });
}

// Professional Portfolio Functions (Placeholder - models not available)
export async function getProfessionalPortfolios(professionalId: string) {
  return [];
}

export async function getProfessionalPortfolioById(id: string) {
  return null;
}

export async function createProfessionalPortfolio(data: {
  professionalId: string;
  title: string;
  description?: string;
  category: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
}) {
  return null;
}

export async function updateProfessionalPortfolio(id: string, data: {
  title?: string;
  description?: string;
  category?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
}) {
  return null;
}

export async function deleteProfessionalPortfolio(id: string) {
  return null;
}

// Professional Notification Functions (Placeholder - using general Notification model)
export async function getProfessionalNotifications(professionalId: string, limit?: number) {
  return prisma.notification.findMany({
    where: { userId: professionalId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getProfessionalUnreadNotificationsCount(professionalId: string) {
  return prisma.notification.count({
    where: { 
      userId: professionalId,
      read: false 
    },
  });
}

export async function markProfessionalNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllProfessionalNotificationsAsRead(professionalId: string) {
  return prisma.notification.updateMany({
    where: { 
      userId: professionalId,
      read: false 
    },
    data: { read: true },
  });
}

export async function createProfessionalNotification(data: {
  professionalId: string;
  title: string;
  message: string;
  type: string;
  metadata?: any;
}) {
  return prisma.notification.create({
    data: {
      userId: data.professionalId,
      title: data.title,
      body: data.message,
      data: data.metadata,
    },
  });
}

// Professional Stats Functions
export async function getProfessionalDashboardStats(professionalId: string) {
  const [
    totalJobs,
    completedJobs,
    pendingJobs,
    totalEarnings,
    averageRating,
    portfolioItems,
    reviews,
  ] = await Promise.all([
    prisma.job_postings.count({
      where: { clientId: professionalId },
    }),
    prisma.job_postings.count({
      where: { 
        clientId: professionalId,
        status: 'COMPLETED'
      },
    }),
    prisma.job_postings.count({
      where: { 
        clientId: professionalId,
        status: 'OPEN'
      },
    }),
    prisma.job_postings.aggregate({
      where: { 
        clientId: professionalId,
        status: 'COMPLETED'
      },
      _sum: { budget: true },
    }),
    prisma.review.aggregate({
      where: { professionalProfileId: professionalId },
      _avg: { rating: true },
    }),
    0, // Portfolio items count - placeholder
    prisma.review.count({
      where: { professionalProfileId: professionalId },
    }),
  ]);

  return {
    totalJobs,
    completedJobs,
    pendingJobs,
    totalEarnings: totalEarnings._sum?.budget || 0,
    averageRating: averageRating._avg?.rating || 0,
    totalReviews: reviews,
    portfolioItems,
  };
}

export async function getProfessionalCalendarStats(professionalId: string, month?: string) {
  // Simplified implementation - in a real app, you'd query actual job schedules
  return {
    upcomingJobs: [],
    completedJobs: [],
    totalJobs: 0,
    completionRate: 0,
  };
}

export async function getProfessionalEarningsStats(professionalId: string, period?: string) {
  const [monthlyEarnings, totalEarnings] = await Promise.all([
    prisma.job_postings.aggregate({
      where: { 
        clientId: professionalId,
        status: 'COMPLETED'
      },
      _sum: { budget: true },
    }),
    prisma.job_postings.aggregate({
      where: { 
        clientId: professionalId,
        status: 'COMPLETED'
      },
      _sum: { budget: true },
    }),
  ]);

  return {
    monthlyEarnings: monthlyEarnings._sum?.budget || 0,
    totalEarnings: totalEarnings._sum?.budget || 0,
    earningsByMonth: [],
  };
}

export async function getProfessionalReviewsStats(professionalId: string) {
  const [reviews, averageRating, ratingDistribution] = await Promise.all([
    prisma.review.findMany({
      where: { professionalProfileId: professionalId },
      include: {
        reviewer: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.aggregate({
      where: { professionalProfileId: professionalId },
      _avg: { rating: true },
    }),
    prisma.review.groupBy({
      by: ['rating'],
      where: { professionalProfileId: professionalId },
      _count: { rating: true },
      orderBy: { rating: 'asc' },
    }),
  ]);

  return {
    reviews: reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      clientName: review.reviewer.name || 'Cliente',
      createdAt: review.createdAt.toISOString(),
    })),
    averageRating: averageRating._avg?.rating || 0,
    totalReviews: reviews.length,
    ratingDistribution: ratingDistribution.map(item => ({
      rating: item.rating,
      count: item._count,
    })),
  };
}

// Professional Settings Functions
export async function getProfessionalSettings(professionalId: string) {
  return prisma.professionalProfile.findUnique({
    where: { id: professionalId },
    select: {
      id: true,
      userId: true,
      bio: true,
      yearsOfExperience: true,
      certifications: true,
      specialties: true,
      hourlyRate: true,
      bankAccount: true,
      taxId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateProfessionalSettings(professionalId: string, data: {
  bio?: string;
  yearsOfExperience?: number;
  certifications?: string;
  specialties?: string[];
  hourlyRate?: number;
  bankAccount?: string;
  taxId?: string;
}) {
  return prisma.professionalProfile.update({
    where: { id: professionalId },
    data,
  });
}

// Search professionals function
export async function searchProfessionals(query: string) {
  return prisma.professionalProfile.findMany({
    where: {
      OR: [
        { bio: { contains: query, mode: 'insensitive' } },
        { specialties: { has: query } },
        { user: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          role: true,
          isVerified: true,
          createdAt: true,
          locationLat: true,
          locationLng: true,
          locationAddress: true,
        },
      },
      servicesOffered: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    },
  });
}

// Get professional stats function
export async function getProfessionalStats(professionalId: string) {
  return getProfessionalDashboardStats(professionalId);
}