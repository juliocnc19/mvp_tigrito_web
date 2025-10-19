import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/chatbot/tickets/[id]/respond
 * Admin responds to an escalated ticket (DEMO MODE - No Database)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje es requerido' },
        { status: 400 }
      );
    }

    // Create mock admin message
    const adminMessage = {
      id: `msg-${Date.now()}`,
      content: message,
      createdAt: new Date().toISOString(),
      senderId: 'admin-demo',
    };

    return NextResponse.json({
      success: true,
      message: adminMessage,
      mode: 'demo'
    });

  } catch (error) {
    console.error('Error responding to ticket:', error);
    return NextResponse.json(
      { error: 'Error al responder al ticket' },
      { status: 500 }
    );
  }
}