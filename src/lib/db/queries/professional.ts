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
  return prisma.professionalProfile.findFirst({
    where: { userId },
    include: {
      user: true,
      servicesOffered: true,
      reviews: true,
    },
  });
}

// Update professional profile
export async function updateProfessionalProfile(
  id: string,
  data: {
    bio?: string | null;
    yearsOfExperience?: number | null;
    certifications?: string | null;
    specialties?: string[];
    hourlyRate?: number | null;
    bankAccount?: string | null;
    taxId?: string | null;
    isVerified?: boolean;
    rating?: number | null;
    responseTime?: number | null;
    completionRate?: number | null;
  }
): Promise<ProfessionalProfile> {
  return prisma.professionalProfile.update({
    where: { id },
    data,
  });
}

// Verify professional
export async function verifyProfessional(id: string, isVerified: boolean): Promise<ProfessionalProfile> {
  return prisma.professionalProfile.update({
    where: { id },
    data: { isVerified },
  });
}

// Get professionals with filters and pagination
export async function getProfessionals(query: z.infer<typeof GetProfessionalsQuerySchema>): Promise<{
  professionals: any[];
  total: number;
}> {
  const {
    page,
    limit,
    specialty,
    minRating,
    maxHourlyRate,
    minExperience,
    isVerified,
    search,
    locationLat,
    locationLng,
    radius,
    sortBy = 'recent',
    sortDirection = 'desc',
  } = query;

  const where: Prisma.ProfessionalProfileWhereInput = {};

  // Specialty filter
  if (specialty) {
    where.specialties = { has: specialty };
  }

  // Rating filter
  if (minRating !== undefined) {
    where.ratingAvg = { gte: minRating };
  }

  // Hourly rate filter
  if (maxHourlyRate !== undefined) {
    where.hourlyRate = { lte: maxHourlyRate };
  }

  // Experience filter
  if (minExperience !== undefined) {
    where.yearsOfExperience = { gte: minExperience };
  }

  // Verification filter
  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  // Search filter
  const userWhere: Prisma.UserWhereInput = {};
  if (search) {
    userWhere.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Location filter
  if (locationLat && locationLng && radius) {
    const latOffset = radius / 111.0;
    const lngOffset = radius / (111.0 * Math.cos(locationLat * Math.PI / 180.0));
    
    userWhere.locationLat = { 
      gte: locationLat - latOffset,
      lte: locationLat + latOffset,
    };
    userWhere.locationLng = {
      gte: locationLng - lngOffset,
      lte: locationLng + lngOffset,
    };
  }
  
  if (Object.keys(userWhere).length > 0) {
    where.user = userWhere;
  }

  // Sort
  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'rating') {
    orderBy = { ratingAvg: sortDirection };
  } else if (sortBy === 'experience') {
    orderBy = { yearsOfExperience: sortDirection };
  } else if (sortBy === 'hourlyRate') {
    orderBy = { hourlyRate: sortDirection };
  } else if (sortBy === 'recent') {
    orderBy = { createdAt: sortDirection };
  }

  const professionals = await prisma.professionalProfile.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy === 'quality' ? undefined : orderBy,
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
      reviews: true,
    },
  });
  
  const total = await prisma.professionalProfile.count({ where });
  
  if (sortBy === 'quality' && locationLat && locationLng) {
    professionals.sort((a, b) => {
      const scoreA = calculateQualityScore(a, locationLat, locationLng);
      const scoreB = calculateQualityScore(b, locationLat, locationLng);
      return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    });
  }

  return { professionals, total };
}

function calculateQualityScore(professional: any, clientLat: number, clientLng: number): number {
  const { ratingAvg, yearsOfExperience, user } = professional;
  
  const rating = ratingAvg ?? 0;
  const experience = yearsOfExperience ?? 0;
  
  let distance = Infinity;
  if (user?.locationLat && user?.locationLng) {
    distance = getDistance(clientLat, clientLng, user.locationLat, user.locationLng);
  }

  // Weights can be adjusted
  const ratingWeight = 0.5;
  const experienceWeight = 0.2;
  const distanceWeight = 0.3;

  // Normalize distance: closer is better. Assuming max distance of 100km for normalization.
  const normalizedDistance = Math.max(0, 1 - (distance / 100));

  // Rating is 0-5, experience can be anything, so we can cap it or normalize it.
  // For simplicity, let's use them directly but this can be improved.
  const score = (rating * ratingWeight) + (experience * experienceWeight) + (normalizedDistance * distanceWeight);
  
  return score;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}


// Get top-rated professionals
export async function getTopRatedProfessionals(limit: number = 10): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: { isVerified: true },
    take: limit,
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      reviews: true,
    },
  });
}

// Get professionals by specialty
export async function getProfessionalsBySpecialty(specialty: string): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: {
      specialties: { has: specialty },
      isVerified: true,
    },
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      reviews: true,
    },
  });
}

// Get professionals by location
export async function getProfessionalsByLocation(lat: number, lng: number, radius: number): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: {
      isVerified: true,
      user: {
        locationLat: { gte: lat - (radius / 111), lte: lat + (radius / 111) },
        locationLng: { gte: lng - (radius / 111), lte: lng + (radius / 111) },
      },
    },
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      reviews: true,
    },
  });
}

// Search professionals
export async function searchProfessionals(searchTerm: string): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: {
      isVerified: true,
      user: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    },
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      reviews: true,
    },
  });
}

// Get professional statistics
export async function getProfessionalStats(professionalId: string): Promise<{
  totalClients: number;
  totalCompletedServices: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  successRate: number;
}> {
  const [transactions, reviews, payments] = await Promise.all([
    prisma.serviceTransaction.findMany({
      where: { professionalId },
    }),
    prisma.review.findMany({
      where: { reviewedId: (await prisma.professionalProfile.findUnique({ where: { id: professionalId } }))?.userId },
    }),
    prisma.payment.findMany({
      where: { recipientId: (await prisma.professionalProfile.findUnique({ where: { id: professionalId } }))?.userId },
    }),
  ]);

  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');
  const totalClients = new Set(transactions.map(t => t.clientId)).size;
  const totalEarnings = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const successRate = transactions.length > 0
    ? (completedTransactions.length / transactions.length) * 100
    : 0;

  return {
    totalClients,
    totalCompletedServices: completedTransactions.length,
    totalEarnings,
    averageRating,
    totalReviews: reviews.length,
    successRate,
  };
}

// Delete professional (soft delete)
export async function deleteProfessional(id: string): Promise<ProfessionalProfile> {
  return prisma.professionalProfile.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// Get professional count
export async function getProfessionalCount(): Promise<number> {
  return prisma.professionalProfile.count({ where: { isVerified: true } });
}

// Get verified professionals
export async function getVerifiedProfessionals(): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: { isVerified: true },
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      reviews: true,
    },
  });
}

// Get professionals with low response time
export async function getFastResponseProfessionals(maxResponseTime: number = 24): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: {
      isVerified: true,
      responseTime: { lte: maxResponseTime },
    },
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      reviews: true,
    },
  });
}

// Get professionals available for booking
export async function getAvailableProfessionals(): Promise<any[]> {
  return prisma.professionalProfile.findMany({
    where: { isVerified: true },
    orderBy: { rating: 'desc' },
    include: {
      user: true,
      servicesOffered: true,
      reviews: true,
    },
  });
}

// Get professional by email or phone
export async function getProfessionalByIdentifier(identifier: string): Promise<any> {
  return prisma.professionalProfile.findFirst({
    where: {
      user: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    },
    include: {
      user: true,
      servicesOffered: true,
      reviews: true,
    },
  });
}
