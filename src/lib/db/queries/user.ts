import { prisma } from '../prisma';
import { User, Prisma } from '@prisma/client';
import { GetUsersQuerySchema } from '@/lib/schemas/user';
import { z } from 'zod';

// Create user
export async function createUser(data: {
  email?: string;
  phone?: string;
  password: string;
  name: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  isVerified?: boolean;
  isIDVerified?: boolean;
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      password: data.password,
      name: data.name,
      role: data.role,
      isVerified: data.isVerified || false,
      isIDVerified: data.isIDVerified || false,
      locationLat: data.locationLat,
      locationLng: data.locationLng,
      locationAddress: data.locationAddress,
    },
  });
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      professionalProfile: true,
      postings: true,
      offers: true,
      proactiveServices: true,
      servicesAsClient: true,
      servicesAsPro: true,
      reviewsGiven: true,
      reviewsReceived: true,
      payments: true,
      reportsSent: true,
      reportsReceived: true,
      promoUses: true,
      devices: true,
      notifications: true,
      media: true,
      conversationsAsParticipant: true,
      messages: true,
      auditLogs: true,
      conversationsCreated: true,
      paymentMethods: true,
      withdrawals: true,
    },
  });
}

// Get user by ID (basic info only)
export async function getUserByIdBasic(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Get user by phone
export async function getUserByPhone(phone: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { phone },
  });
}

// Get user by email or phone
export async function getUserByEmailOrPhone(identifier: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier },
      ],
    },
  });
}

// Update user
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// Update user profile
export async function updateUserProfile(id: string, data: {
  name?: string;
  phone?: string;
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
}): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// Verify user
export async function verifyUser(id: string, data: {
  isVerified?: boolean;
  isIDVerified?: boolean;
}): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// Suspend user
export async function suspendUser(id: string, data: {
  isSuspended: boolean;
}): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// Get users with filters and pagination
export async function getUsers(query: z.infer<typeof GetUsersQuerySchema>): Promise<{
  users: User[];
  total: number;
}> {
  const { page, limit, role, isVerified, search, locationLat, locationLng, radius } = query;
  
  const where: Prisma.UserWhereInput = {
    deletedAt: null, // Only non-deleted users
  };

  // Role filter
  if (role) {
    where.role = role;
  }

  // Verification filter
  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Location filter
  if (locationLat && locationLng && radius) {
    // This is a simplified location filter - in production, you'd use PostGIS or similar
    where.AND = [
      { locationLat: { gte: locationLat - (radius / 111), lte: locationLat + (radius / 111) } },
      { locationLng: { gte: locationLng - (radius / 111), lte: locationLng + (radius / 111) } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

// Get users with relations
export async function getUsersWithRelations(query: z.infer<typeof GetUsersQuerySchema>): Promise<{
  users: any[];
  total: number;
}> {
  const { page, limit, role, isVerified, search, locationLat, locationLng, radius } = query;
  
  const where: Prisma.UserWhereInput = {
    deletedAt: null, // Only non-deleted users
  };

  // Role filter
  if (role) {
    where.role = role;
  }

  // Verification filter
  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Location filter
  if (locationLat && locationLng && radius) {
    where.AND = [
      { locationLat: { gte: locationLat - (radius / 111), lte: locationLat + (radius / 111) } },
      { locationLng: { gte: locationLng - (radius / 111), lte: locationLng + (radius / 111) } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        professionalProfile: true,
        postings: true,
        offers: true,
        proactiveServices: true,
        servicesAsClient: true,
        servicesAsPro: true,
        reviewsGiven: true,
        reviewsReceived: true,
        payments: true,
        reportsSent: true,
        reportsReceived: true,
        promoUses: true,
        devices: true,
        notifications: true,
        media: true,
        conversationsAsParticipant: true,
        messages: true,
        auditLogs: true,
        conversationsCreated: true,
        paymentMethods: true,
        withdrawals: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

// Delete user (soft delete)
export async function deleteUser(id: string): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

// Check if email exists
export async function emailExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return !!user;
}

// Check if phone exists
export async function phoneExists(phone: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { phone },
    select: { id: true },
  });
  return !!user;
}

// Get user statistics
export async function getUserStats(userId: string): Promise<{
  totalPostings: number;
  totalOffers: number;
  totalTransactions: number;
  totalReviews: number;
  averageRating: number;
}> {
  const [totalPostings, totalOffers, totalTransactions, totalReviews, reviews] = await Promise.all([
    prisma.servicePosting.count({ where: { clientId: userId } }),
    prisma.offer.count({ where: { professionalId: userId } }),
    prisma.serviceTransaction.count({
      where: {
        OR: [
          { clientId: userId },
          { professionalId: userId },
        ],
      },
    }),
    prisma.review.count({
      where: {
        OR: [
          { reviewerId: userId },
          { reviewedId: userId },
        ],
      },
    }),
    prisma.review.findMany({
      where: { reviewedId: userId },
      select: { rating: true },
    }),
  ]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    totalPostings,
    totalOffers,
    totalTransactions,
    totalReviews,
    averageRating,
  };
}

// Get user by role
export async function getUsersByRole(role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN'): Promise<User[]> {
  return prisma.user.findMany({
    where: { role, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
}

// Get verified users
export async function getVerifiedUsers(): Promise<User[]> {
  return prisma.user.findMany({
    where: { 
      isVerified: true, 
      deletedAt: null 
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get suspended users
export async function getSuspendedUsers(): Promise<User[]> {
  return prisma.user.findMany({
    where: { 
      isSuspended: true, 
      deletedAt: null 
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get users by location
export async function getUsersByLocation(lat: number, lng: number, radius: number): Promise<User[]> {
  return prisma.user.findMany({
    where: {
      deletedAt: null,
      locationLat: { gte: lat - (radius / 111), lte: lat + (radius / 111) },
      locationLng: { gte: lng - (radius / 111), lte: lng + (radius / 111) },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Search users
export async function searchUsers(searchTerm: string): Promise<User[]> {
  return prisma.user.findMany({
    where: {
      deletedAt: null,
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phone: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Get user count by role
export async function getUserCountByRole(): Promise<{
  clients: number;
  professionals: number;
  admins: number;
}> {
  const [clients, professionals, admins] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT', deletedAt: null } }),
    prisma.user.count({ where: { role: 'PROFESSIONAL', deletedAt: null } }),
    prisma.user.count({ where: { role: 'ADMIN', deletedAt: null } }),
  ]);

  return { clients, professionals, admins };
}

// Get user count by verification status
export async function getUserCountByVerification(): Promise<{
  verified: number;
  unverified: number;
}> {
  const [verified, unverified] = await Promise.all([
    prisma.user.count({ where: { isVerified: true, deletedAt: null } }),
    prisma.user.count({ where: { isVerified: false, deletedAt: null } }),
  ]);

  return { verified, unverified };
}

// Get recent users
export async function getRecentUsers(limit: number = 10): Promise<User[]> {
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// Get user activity
export async function getUserActivity(userId: string, days: number = 30): Promise<{
  postings: number;
  offers: number;
  transactions: number;
  reviews: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [postings, offers, transactions, reviews] = await Promise.all([
    prisma.servicePosting.count({
      where: {
        clientId: userId,
        createdAt: { gte: startDate },
      },
    }),
    prisma.offer.count({
      where: {
        professionalId: userId,
        createdAt: { gte: startDate },
      },
    }),
    prisma.serviceTransaction.count({
      where: {
        OR: [
          { clientId: userId },
          { professionalId: userId },
        ],
        createdAt: { gte: startDate },
      },
    }),
    prisma.review.count({
      where: {
        OR: [
          { reviewerId: userId },
          { reviewedId: userId },
        ],
        createdAt: { gte: startDate },
      },
    }),
  ]);

  return { postings, offers, transactions, reviews };
}