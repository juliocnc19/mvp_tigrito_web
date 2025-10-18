import { z } from 'zod';
import { ConversationTypeSchema, MessageRoleSchema, MessageTypeSchema } from './common';

// Conversation Schema
export const ConversationSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  createdAt: z.string().datetime(),
  jobId: z.string().nullable(),
  title: z.string().nullable(),
  type: ConversationTypeSchema.nullable(),
  updatedAt: z.string().datetime(),
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
  content: z.string().nullable(),
  isRead: z.boolean(),
  messageType: MessageTypeSchema.nullable(),
});

// Create Conversation Request
export const CreateConversationRequestSchema = z.object({
  jobId: z.string().optional(),
  title: z.string().optional(),
  type: ConversationTypeSchema.optional(),
  participantIds: z.array(z.string()).min(1),
});

// Send Message Request
export const SendMessageRequestSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1),
  messageType: MessageTypeSchema.optional(),
  mediaIds: z.array(z.string()).optional(),
});

// Get Conversations Query Schema
export const GetConversationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  createdById: z.string().optional(),
  jobId: z.string().optional(),
  type: ConversationTypeSchema.optional(),
  title: z.string().optional(),
});

// Get Messages Query Schema
export const GetMessagesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  conversationId: z.string(),
  senderId: z.string().optional(),
  messageType: MessageTypeSchema.optional(),
  isRead: z.coerce.boolean().optional(),
});

// Conversation with Relations Schema
export const ConversationWithRelationsSchema = ConversationSchema.extend({
  createdBy: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
  }).optional(),
  job_postings: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
  }).nullable().optional(),
  participants: z.array(z.object({
    id: z.string(),
    userId: z.string(),
    joinedAt: z.string().datetime(),
    user: z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string().nullable(),
    }),
  })).optional(),
  messages: z.array(MessageSchema).optional(),
});

// Message with Relations Schema
export const MessageWithRelationsSchema = MessageSchema.extend({
  sender: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
  }).optional(),
  conversation: z.object({
    id: z.string(),
    title: z.string().nullable(),
  }).optional(),
});

// Conversations List Response Schema
export const ConversationsListResponseSchema = z.object({
  conversations: z.array(ConversationWithRelationsSchema),
  total: z.number(),
});

// Messages List Response Schema
export const MessagesListResponseSchema = z.object({
  messages: z.array(MessageWithRelationsSchema),
  total: z.number(),
});