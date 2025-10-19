import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/admin/chatbot/tickets
 * List support tickets with filtering and pagination (with database)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.OR = [
        { escalationReason: { contains: search, mode: 'insensitive' as const } },
        { initialSummary: { contains: search, mode: 'insensitive' as const } },
        { Conversation: { title: { contains: search, mode: 'insensitive' as const } } },
        { User_SupportTicket_clientIdToUser: { name: { contains: search, mode: 'insensitive' as const } } },
      ];
    }

    // Get tickets with related data
    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      include: {
        Conversation: {
          select: {
            id: true,
            title: true,
            createdAt: true,
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
      },
      orderBy: { openedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count
    const total = await prisma.supportTicket.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      tickets: tickets.map(ticket => ({
        id: ticket.id,
        status: ticket.status,
        escalationReason: ticket.escalationReason,
        initialSummary: ticket.initialSummary,
        openedAt: ticket.openedAt,
        assignedAt: ticket.assignedAt,
        closedAt: ticket.closedAt,
        conversation: ticket.Conversation,
        client: ticket.User_SupportTicket_clientIdToUser,
        assignedTo: ticket.User_SupportTicket_assignedToIdToUser,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching tickets' },
      { status: 500 }
    );
  }
}