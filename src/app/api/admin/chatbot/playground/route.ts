import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * POST /api/admin/chatbot/playground
 * Start a new test conversation in the playground (with database persistence)
 */
export async function POST(request: NextRequest) {
  try {
    // Try to parse JSON body, but handle cases where there's no body
    let title = '';
    try {
      const body = await request.json();
      title = body?.title || '';
    } catch (jsonError) {
      // No body or invalid JSON, use default title
      title = '';
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

    // Create new conversation in database
    const conversation = await prisma.conversation.create({
      data: {
        title: title || 'Nueva Conversación de Prueba',
        createdById: adminUser.id,
        type: 'SUPPORT',
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        mode: 'database'
      },
    });

  } catch (error) {
    console.error('Error creating test conversation:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}