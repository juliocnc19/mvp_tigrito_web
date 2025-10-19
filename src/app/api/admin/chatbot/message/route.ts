import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ChatbotService } from '@/lib/services/chatbot';

/**
 * POST /api/admin/chatbot/message
 * Send a message to the chatbot and get response (with database persistence)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, message } = body;

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'conversationId y message son requeridos' },
        { status: 400 }
      );
    }

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

    // Get or create a test client user
    let clientUser = await prisma.user.findFirst({
      where: { role: 'CLIENT' },
      select: { id: true }
    });

    if (!clientUser) {
      clientUser = await prisma.user.create({
        data: {
          id: 'client-demo-user',
          email: 'client@demo.com',
          name: 'Cliente Demo',
          role: 'CLIENT',
        },
        select: { id: true }
      });
    }

    // Get or create a system bot user
    let botUser = await prisma.user.findFirst({
      where: { id: 'system-bot-user' },
      select: { id: true }
    });

    if (!botUser) {
      botUser = await prisma.user.create({
        data: {
          id: 'system-bot-user',
          email: 'bot@system.com',
          name: 'Asistente IA',
          role: 'CLIENT', // Use CLIENT role for bot
        },
        select: { id: true }
      });
    }

    // Verify conversation exists and check if it's already escalated
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10, // Get last 10 messages for context
        },
        SupportTicket: {
          select: {
            id: true,
            status: true,
          }
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Check if conversation is already escalated
    if (conversation.SupportTicket) {
      console.log('🚫 Conversation already escalated, blocking AI response');
      return NextResponse.json(
        { 
          error: 'Esta conversación ya ha sido escalada a un agente humano. Un agente se pondrá en contacto contigo pronto.',
          escalated: true,
          ticketId: conversation.SupportTicket.id,
          status: conversation.SupportTicket.status
        },
        { status: 400 }
      );
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId: clientUser.id,
        content: message,
        messageType: 'TEXT',
      }
    });

    // Initialize chatbot service
    const chatbotService = new ChatbotService();
    
    // Generate AI response
    console.log('🤖 Generating AI response for message:', message);
    const { response: aiResponse, shouldEscalate, escalationReason } = 
      await chatbotService.generateResponse(conversationId, message, adminUser.id);
    
    console.log('🤖 AI Response generated:', {
      response: aiResponse,
      shouldEscalate,
      escalationReason
    });

    // Save bot response
    const botMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId: botUser.id, // Bot user ID
        content: aiResponse,
        messageType: 'TEXT',
      }
    });

    // Update conversation title and timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        title: message.length > 50 ? message.substring(0, 50) + '...' : message,
        updatedAt: new Date(),
      }
    });

    let ticket = null;
    if (shouldEscalate) {
      console.log('🎫 Creating support ticket for escalation...');
      try {
        // Create support ticket
        ticket = await prisma.supportTicket.create({
          data: {
            id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conversationId,
            clientId: clientUser.id,
            status: 'PENDING_HUMAN_ASSIGNMENT',
            escalationReason: escalationReason || 'Escalación automática',
            initialSummary: `Conversación escalada: ${message}`,
          }
        });
        console.log('🎫 Support ticket created successfully:', ticket.id);

        // The conversation is already linked through the conversationId in the ticket
        // No need to update the conversation separately
        console.log('🎫 Conversation updated with ticket reference');
      } catch (ticketError) {
        console.error('❌ Error creating support ticket:', ticketError);
        throw ticketError;
      }
    } else {
      console.log('ℹ️ No escalation needed for this message');
    }

    return NextResponse.json({
      success: true,
      userMessage: {
        id: userMessage.id,
        content: userMessage.content,
        senderId: userMessage.senderId,
        senderName: 'Cliente Demo',
        senderType: 'USER',
        createdAt: userMessage.createdAt,
      },
      botMessage: {
        id: botMessage.id,
        content: botMessage.content,
        senderId: botMessage.senderId,
        senderName: 'Asistente IA',
        senderType: 'BOT',
        createdAt: botMessage.createdAt,
      },
      escalated: shouldEscalate,
      ticket: ticket ? {
        id: ticket.id,
        status: ticket.status,
        escalationReason: ticket.escalationReason,
        createdAt: ticket.openedAt,
      } : null,
    });

  } catch (error) {
    console.error('Error processing chatbot message:', error);
    return NextResponse.json(
      { error: 'Error al procesar mensaje' },
      { status: 500 }
    );
  }
}