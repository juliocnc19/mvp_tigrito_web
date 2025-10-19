import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/admin/chatbot/conversations
 * List playground conversations from database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Build where clause for search
    const whereClause = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { messages: { some: { content: { contains: search, mode: 'insensitive' as const } } } }
      ]
    } : {};

    // Get conversations with messages count
    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1, // Only get the last message
        },
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.conversation.count({
      where: whereClause,
    });

    // Transform data to match frontend expectations
    const transformedConversations = conversations.map(conv => ({
      id: conv.id,
      title: conv.title || 'Conversación sin título',
      lastMessage: conv.messages[0]?.content || 'Sin mensajes',
      lastMessageAt: conv.messages[0]?.createdAt || conv.createdAt,
      messageCount: conv._count.messages,
      status: 'ACTIVE', // Default status, will be updated when ticket is created
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        conversations: transformedConversations,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching conversations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/chatbot/conversations
 * Create a new conversation in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title } = body;

    // Get or create a test admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          id: 'admin-demo-user',
          email: 'admin@demo.com',
          name: 'Admin Demo',
          role: 'ADMIN',
        },
        select: { id: true }
      });
    }

    const newConversation = await prisma.conversation.create({
      data: {
        title: title || 'Nueva Conversación',
        createdById: adminUser.id,
        type: 'SUPPORT',
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });

    const transformedConversation = {
      id: newConversation.id,
      title: newConversation.title || 'Nueva Conversación',
      lastMessage: 'Conversación iniciada',
      lastMessageAt: newConversation.createdAt,
      messageCount: 0,
      status: 'ACTIVE',
      createdAt: newConversation.createdAt,
      updatedAt: newConversation.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: transformedConversation,
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Error creating conversation' },
      { status: 500 }
    );
  }
}
