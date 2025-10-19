import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/admin/chatbot/conversations/[id]/messages
 * Get messages from a specific conversation from database
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;

    // Get conversation with messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true,
              }
            }
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Transform messages to match frontend expectations
    const transformedMessages = conversation.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: msg.sender?.name || (msg.senderId === 'system' ? 'Asistente IA' : 'Usuario'),
      senderType: msg.senderId === 'system' ? 'BOT' : 
                  msg.sender?.role === 'ADMIN' ? 'ADMIN' : 'USER',
      createdAt: msg.createdAt,
      messageType: msg.messageType,
    }));

    return NextResponse.json({
      success: true,
      data: {
        conversationId,
        messages: transformedMessages,
        total: transformedMessages.length,
      },
    });

  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching conversation messages' },
      { status: 500 }
    );
  }
}