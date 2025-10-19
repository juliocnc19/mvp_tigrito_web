import { NextRequest, NextResponse } from 'next/server';

/**
 * PUT /api/admin/chatbot/tickets/[id]/status
 * Update ticket status (DEMO MODE - No Database)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      'OPEN_AI_HANDLING',
      'PENDING_HUMAN_ASSIGNMENT',
      'ACTIVE_HUMAN_CHAT',
      'CLOSED_RESOLVED',
      'CLOSED_BY_CLIENT',
    ];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado válido requerido' },
        { status: 400 }
      );
    }

    // Mock ticket update
    const updatedTicket = {
      id: ticketId,
      status: status,
      closedAt: status === 'CLOSED_RESOLVED' || status === 'CLOSED_BY_CLIENT' 
        ? new Date().toISOString() 
        : null,
    };

    return NextResponse.json({
      success: true,
      ticket: updatedTicket,
      mode: 'demo'
    });

  } catch (error) {
    console.error('Error updating ticket status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estado del ticket' },
      { status: 500 }
    );
  }
}