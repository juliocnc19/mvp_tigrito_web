import { prisma } from '../prisma';
import { Conversation, Message, Prisma } from '@prisma/client';
import { GetConversationsQuerySchema, GetMessagesQuerySchema } from '@/lib/schemas/conversation';
import { z } from 'zod';

// Create conversation
export async function createConversation(data: {
  createdById: string;
  jobId?: string;
  title?: string;
  type?: 'CLIENT_PROFESSIONAL' | 'SUPPORT';
  participantIds: string[];
}): Promise<Conversation> {
  return prisma.conversation.create({
    data: {
      createdById: data.createdById,
      jobId: data.jobId,
      title: data.title,
      type: data.type,
      updatedAt: new Date(),
      participants: {
        create: data.participantIds.map(userId => ({
          userId,
        })),
      },
    },
  });
}

// Get conversation by ID
export async function getConversationById(id: string): Promise<Conversation | null> {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

// Update conversation
export async function updateConversation(id: string, data: {
  title?: string;
  type?: 'CLIENT_PROFESSIONAL' | 'SUPPORT';
}): Promise<Conversation> {
  return prisma.conversation.update({
    where: { id },
    data: {
      title: data.title,
      type: data.type,
    },
  });
}

// Get conversations with filters and pagination
export async function getConversations(query: z.infer<typeof GetConversationsQuerySchema>): Promise<{
  conversations: Conversation[];
  total: number;
}> {
  const { page, limit, createdById, jobId, type, title } = query;
  
  const where: Prisma.ConversationWhereInput = {};

  // Created by filter
  if (createdById) {
    where.createdById = createdById;
  }

  // Job filter
  if (jobId) {
    where.jobId = jobId;
  }

  // Type filter
  if (type) {
    where.type = type;
  }

  // Title filter
  if (title) {
    where.title = { contains: title, mode: 'insensitive' };
  }

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job_postings: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.conversation.count({ where }),
  ]);

  return { conversations, total };
}

// Get conversations by user
export async function getConversationsByUser(userId: string): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    where: {
      OR: [
        { createdById: userId },
        { participants: { some: { userId } } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

// Get conversations by job
export async function getConversationsByJob(jobId: string): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

// Create message
export async function createMessage(data: {
  conversationId: string;
  senderId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  mediaIds?: string[];
}): Promise<Message> {
  return prisma.message.create({
    data: {
      conversationId: data.conversationId,
      senderId: data.senderId,
      content: data.content,
      messageType: data.messageType || 'TEXT',
      mediaIds: data.mediaIds ? JSON.stringify(data.mediaIds) : null,
    },
  });
}

// Get messages with filters and pagination
export async function getMessages(query: z.infer<typeof GetMessagesQuerySchema>): Promise<{
  messages: Message[];
  total: number;
}> {
  const { page, limit, conversationId, senderId, messageType, isRead } = query;
  
  const where: Prisma.MessageWhereInput = {
    conversationId,
  };

  // Sender filter
  if (senderId) {
    where.senderId = senderId;
  }

  // Message type filter
  if (messageType) {
    where.messageType = messageType;
  }

  // Read filter
  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        conversation: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);

  return { messages, total };
}

// Mark message as read
export async function markMessageAsRead(messageId: string, userId: string): Promise<Message> {
  return prisma.message.update({
    where: { id: messageId },
    data: { 
      isRead: true,
      readBy: userId,
    },
  });
}

// Mark all messages as read in conversation
export async function markAllMessagesAsReadInConversation(conversationId: string, userId: string): Promise<{ count: number }> {
  const result = await prisma.message.updateMany({
    where: { 
      conversationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { 
      isRead: true,
      readBy: userId,
    },
  });
  return { count: result.count };
}

// Get conversation statistics
export async function getConversationStats(): Promise<{
  total: number;
  byType: { type: string; count: number }[];
  totalMessages: number;
  recentActivity: number;
}> {
  const [total, totalMessages, recentActivity] = await Promise.all([
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.conversation.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    }),
  ]);

  return {
    total,
    byType: [],
    totalMessages,
    recentActivity,
  };
}

// Get recent conversations
export async function getRecentConversations(limit: number = 10): Promise<Conversation[]> {
  return prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

// Delete conversation
export async function deleteConversation(id: string): Promise<Conversation> {
  return prisma.conversation.delete({
    where: { id },
  });
}

// Add participant to conversation
export async function addParticipantToConversation(conversationId: string, userId: string): Promise<void> {
  await prisma.conversationParticipant.create({
    data: {
      conversationId,
      userId,
    },
  });
}

// Remove participant from conversation
export async function removeParticipantFromConversation(conversationId: string, userId: string): Promise<void> {
  await prisma.conversationParticipant.delete({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });
}
