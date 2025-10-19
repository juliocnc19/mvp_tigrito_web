import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/admin/chatbot/tickets/[id]
 * Get details of a specific support ticket (with database)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;

    // Get ticket with all related data
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        Conversation: {
          include: {
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        User_SupportTicket_clientIdToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        User_SupportTicket_assignedToIdToUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Transform messages to match frontend expectations
    const transformedMessages = ticket.Conversation.messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      messageType: msg.messageType,
      createdAt: msg.createdAt,
      isRead: true, // For now, assume all messages are read
      sender: {
        id: msg.sender?.id || msg.senderId,
        name: msg.sender?.name || (msg.senderId === 'system-bot-user' ? 'Asistente IA' : 'Usuario'),
        role: msg.sender?.role || 'CLIENT',
      }
    }));

    const transformedTicket = {
      id: ticket.id,
      status: ticket.status,
      escalationReason: ticket.escalationReason,
      initialSummary: ticket.initialSummary,
      openedAt: ticket.openedAt,
      assignedAt: ticket.assignedAt,
      closedAt: ticket.closedAt,
      conversation: {
        id: ticket.Conversation.id,
        title: ticket.Conversation.title,
        createdAt: ticket.Conversation.createdAt,
        messages: transformedMessages,
      },
      client: ticket.User_SupportTicket_clientIdToUser,
      assignedTo: ticket.User_SupportTicket_assignedToIdToUser,
    };

    return NextResponse.json({
      success: true,
      ticket: transformedTicket,
    });

  } catch (error) {
    console.error('Error fetching ticket details:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching ticket details' },
      { status: 500 }
    );
  }
}