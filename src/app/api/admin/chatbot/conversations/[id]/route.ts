import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * PUT /api/admin/chatbot/conversations/[id]
 * Update a conversation (for last message, status, etc.)
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { lastMessage, messageCount, status } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (lastMessage) {
      updateData.title = lastMessage.length > 50 
        ? lastMessage.substring(0, 50) + '...' 
        : lastMessage;
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });

    // If there's a support ticket, update its status
    if (status && status !== 'ACTIVE') {
      await prisma.supportTicket.updateMany({
        where: { conversationId: id },
        data: { status: status as any }
      });
    }

    const transformedConversation = {
      id: updatedConversation.id,
      title: updatedConversation.title || 'Conversación sin título',
      lastMessage: lastMessage || 'Sin mensajes',
      lastMessageAt: new Date(),
      messageCount: updatedConversation._count.messages,
      status: status || 'ACTIVE',
      createdAt: updatedConversation.createdAt,
      updatedAt: updatedConversation.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: transformedConversation,
    });

  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Error updating conversation' },
      { status: 500 }
    );
  }
}
