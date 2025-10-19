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
        conversation: {
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
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assignedTo: {
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
    const transformedMessages = ticket.conversation.messages.map(msg => ({
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
        id: ticket.conversation.id,
        title: ticket.conversation.title,
        createdAt: ticket.conversation.createdAt,
        messages: transformedMessages,
      },
      client: ticket.client,
      assignedTo: ticket.assignedTo,
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