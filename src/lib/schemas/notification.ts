import { z } from 'zod';

// Notification Schema
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  data: z.any().nullable(),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});

// Create Notification Request
export const CreateNotificationRequestSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.any().optional(),
});

// Get Notifications Query Schema
export const GetNotificationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  read: z.coerce.boolean().optional(),
});
