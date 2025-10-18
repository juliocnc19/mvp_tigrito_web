import { prisma } from '../prisma';
import { Notification, Prisma } from '@prisma/client';
import { GetNotificationsQuerySchema } from '@/lib/schemas/notification';
import { z } from 'zod';

// Create notification
export async function createNotification(data: {
  userId: string;
  title: string;
  body: string;
  data?: any;
}): Promise<Notification> {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      body: data.body,
      data: data.data,
    },
  });
}

// Get notification by ID
export async function getNotificationById(id: string): Promise<Notification | null> {
  return prisma.notification.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

// Update notification
export async function updateNotification(id: string, data: {
  read?: boolean;
  title?: string;
  body?: string;
  data?: any;
}): Promise<Notification> {
  return prisma.notification.update({
    where: { id },
    data,
  });
}

// Mark notification as read
export async function markNotificationAsRead(id: string): Promise<Notification> {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

// Mark all notifications as read for user
export async function markAllNotificationsAsRead(userId: string): Promise<{ count: number }> {
  const result = await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return { count: result.count };
}

// Get notifications with filters and pagination
export async function getNotifications(query: z.infer<typeof GetNotificationsQuerySchema>): Promise<{
  notifications: Notification[];
  total: number;
}> {
  const { page, limit, userId, read, title } = query;
  
  const where: Prisma.NotificationWhereInput = {};

  // User filter
  if (userId) {
    where.userId = userId;
  }

  // Read filter
  if (read !== undefined) {
    where.read = read;
  }

  // Title filter
  if (title) {
    where.title = { contains: title, mode: 'insensitive' };
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, total };
}

// Get notifications by user
export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get unread notifications by user
export async function getUnreadNotificationsByUser(userId: string): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: { userId, read: false },
    orderBy: { createdAt: 'desc' },
  });
}

// Get notification statistics
export async function getNotificationStats(): Promise<{
  total: number;
  read: number;
  unread: number;
  byUser: { userId: string; count: number }[];
  recentActivity: number;
}> {
  const [total, read, unread, byUser, recentActivity] = await Promise.all([
    prisma.notification.count(),
    prisma.notification.count({ where: { read: true } }),
    prisma.notification.count({ where: { read: false } }),
    prisma.notification.groupBy({
      by: ['userId'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 10,
    }),
    prisma.notification.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    }),
  ]);

  return {
    total,
    read,
    unread,
    byUser: byUser.map(item => ({
      userId: item.userId,
      count: item._count.userId,
    })),
    recentActivity,
  };
}

// Get recent notifications
export async function getRecentNotifications(limit: number = 10): Promise<Notification[]> {
  return prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

// Delete notification
export async function deleteNotification(id: string): Promise<Notification> {
  return prisma.notification.delete({
    where: { id },
  });
}

// Delete all notifications for user
export async function deleteAllNotificationsForUser(userId: string): Promise<{ count: number }> {
  const result = await prisma.notification.deleteMany({
    where: { userId },
  });
  return { count: result.count };
}

// Get notifications by date range
export async function getNotificationsByDateRange(startDate: Date, endDate: Date): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
