import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'data', 'knowledge-base.json');

/**
 * GET /api/admin/chatbot/knowledge
 * Get the current knowledge base
 */
export async function GET() {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(KNOWLEDGE_BASE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Read knowledge base or return default
    if (fs.existsSync(KNOWLEDGE_BASE_PATH)) {
      const knowledgeBase = JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf8'));
      return NextResponse.json({
        success: true,
        knowledgeBase,
      });
    } else {
      // Return default knowledge base
      const defaultKnowledgeBase = {
        categories: [
          {
            name: 'General',
            topics: [
              {
                question: '¿Cómo funciona el servicio?',
                answer: 'Nuestro servicio conecta clientes con profesionales calificados para diversos trabajos y servicios.',
                keywords: ['servicio', 'funcionamiento', 'cómo funciona'],
              },
              {
                question: '¿Cuáles son los horarios de atención?',
                answer: 'Estamos disponibles 24/7 a través de nuestra plataforma online.',
                keywords: ['horarios', 'atención', 'disponibilidad'],
              },
            ],
          },
          {
            name: 'Pagos',
            topics: [
              {
                question: '¿Cómo puedo pagar?',
                answer: 'Aceptamos pagos con tarjeta de crédito, débito y transferencias bancarias.',
                keywords: ['pago', 'tarjeta', 'transferencia'],
              },
              {
                question: '¿Es seguro el pago?',
                answer: 'Sí, utilizamos encriptación de grado bancario para proteger tus datos de pago.',
                keywords: ['seguro', 'seguridad', 'encriptación'],
              },
            ],
          },
        ],
      };

      // Save default knowledge base
      fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify(defaultKnowledgeBase, null, 2));

      return NextResponse.json({
        success: true,
        knowledgeBase: defaultKnowledgeBase,
      });
    }

  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return NextResponse.json(
      { error: 'Error al leer la base de conocimiento' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/chatbot/knowledge
 * Update the knowledge base
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📝 [POST /api/admin/chatbot/knowledge] Starting request');
    
    const body = await request.json();
    console.log('📝 [POST /api/admin/chatbot/knowledge] Request body:', JSON.stringify(body, null, 2));
    
    const { knowledgeBase } = body;

    if (!knowledgeBase) {
      console.error('❌ [POST /api/admin/chatbot/knowledge] Missing knowledgeBase in request body');
      return NextResponse.json(
        { error: 'Base de conocimiento requerida' },
        { status: 400 }
      );
    }

    // Validate knowledge base structure
    if (!Array.isArray(knowledgeBase.categories)) {
      console.error('❌ [POST /api/admin/chatbot/knowledge] Invalid knowledge base structure - categories must be an array');
      return NextResponse.json(
        { error: 'Estructura de base de conocimiento inválida - categories debe ser un array' },
        { status: 400 }
      );
    }

    // Ensure data directory exists
    const dataDir = path.dirname(KNOWLEDGE_BASE_PATH);
    console.log('📁 [POST /api/admin/chatbot/knowledge] Data directory:', dataDir);
    
    if (!fs.existsSync(dataDir)) {
      console.log('📁 [POST /api/admin/chatbot/knowledge] Creating data directory');
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save updated knowledge base
    console.log('💾 [POST /api/admin/chatbot/knowledge] Saving knowledge base to:', KNOWLEDGE_BASE_PATH);
    fs.writeFileSync(KNOWLEDGE_BASE_PATH, JSON.stringify(knowledgeBase, null, 2));

    console.log('✅ [POST /api/admin/chatbot/knowledge] Knowledge base updated successfully');
    return NextResponse.json({
      success: true,
      message: 'Base de conocimiento actualizada correctamente',
    });

  } catch (error) {
    console.error('❌ [POST /api/admin/chatbot/knowledge] Error updating knowledge base:', error);
    return NextResponse.json(
      { 
        error: 'Error al actualizar la base de conocimiento',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}