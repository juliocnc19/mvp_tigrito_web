import { z } from 'zod';

// Conversation Schema
export const ConversationSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  createdAt: z.string().datetime(),
});

// Create Conversation Request
export const CreateConversationRequestSchema = z.object({
  participantIds: z.array(z.string()).min(1),
});

// Message Schema
export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  text: z.string().nullable(),
  mediaIds: z.string().nullable(),
  readBy: z.string().nullable(),
  createdAt: z.string().datetime(),
});

// Send Message Request
export const SendMessageRequestSchema = z.object({
  text: z.string().optional(),
  mediaIds: z.array(z.string()).optional(),
}).refine(
  (data) => data.text || data.mediaIds?.length,
  { message: "Either text or media must be provided" }
);

// Get Messages Query Schema
export const GetMessagesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  before: z.string().optional(),
});
