import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { prisma } from '@/lib/db/prisma';

// Knowledge base type
interface KnowledgeBase {
  categories: Array<{
    name: string;
    topics: Array<{
      question: string;
      answer: string;
      keywords: string[];
    }>;
  }>;
}

// Default knowledge base
const defaultKnowledgeBase: KnowledgeBase = {
  categories: [
    {
      name: 'General',
      topics: [
        {
          question: '¿Cómo funciona el servicio?',
          answer: 'Nuestro servicio conecta clientes con profesionales calificados para diversos trabajos y servicios.',
          keywords: ['servicio', 'funcionamiento', 'cómo funciona']
        },
        {
          question: '¿Cuáles son los horarios de atención?',
          answer: 'Estamos disponibles 24/7 a través de nuestra plataforma online.',
          keywords: ['horarios', 'atención', 'disponibilidad']
        }
      ]
    },
    {
      name: 'Pagos',
      topics: [
        {
          question: '¿Cómo puedo pagar?',
          answer: 'Aceptamos pagos con tarjeta de crédito, débito y transferencias bancarias.',
          keywords: ['pago', 'tarjeta', 'transferencia']
        },
        {
          question: '¿Es seguro el pago?',
          answer: 'Sí, utilizamos encriptación de grado bancario para proteger tus datos de pago.',
          keywords: ['seguro', 'seguridad', 'encriptación']
        }
      ]
    }
  ]
};

export class ChatbotService {
  private model: ChatGoogleGenerativeAI;
  private knowledgeBase: KnowledgeBase;
  private failedAttempts: Map<string, number> = new Map();

  constructor() {
    // Check if API key is available
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GOOGLE_AI_API_KEY not found. Chatbot will use fallback responses.');
    }
    
    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash-exp',
      apiKey: apiKey || 'demo-key', // Use demo key if not available
      temperature: 0.7,
    });
    this.knowledgeBase = defaultKnowledgeBase;
  }

  /**
   * Load knowledge base from JSON file or database
   */
  async loadKnowledgeBase(): Promise<KnowledgeBase> {
    try {
      const fs = require('fs');
      const path = require('path');
      const knowledgeBasePath = path.join(process.cwd(), 'data', 'knowledge-base.json');
      
      if (fs.existsSync(knowledgeBasePath)) {
        const fileContent = fs.readFileSync(knowledgeBasePath, 'utf8');
        const loadedKnowledgeBase = JSON.parse(fileContent);
        this.knowledgeBase = loadedKnowledgeBase;
        return loadedKnowledgeBase;
      }
      
      return this.knowledgeBase;
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      return defaultKnowledgeBase;
    }
  }

  /**
   * Search knowledge base for relevant information
   */
  private searchKnowledgeBase(query: string): string {
    const lowerQuery = query.toLowerCase();
    const results: string[] = [];

    // Search through all categories and topics
    for (const category of this.knowledgeBase.categories) {
      const relevantTopics = category.topics.filter(topic =>
        topic.question.toLowerCase().includes(lowerQuery) ||
        topic.answer.toLowerCase().includes(lowerQuery) ||
        topic.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))
      );

      if (relevantTopics.length > 0) {
        results.push(`**${category.name}:**`);
        relevantTopics.forEach(topic => {
          results.push(`Q: ${topic.question}`);
          results.push(`A: ${topic.answer}`);
        });
        results.push(''); // Add spacing between categories
      }
    }

    return results.length > 0 
      ? results.join('\n') 
      : 'No encontré información específica sobre tu consulta.';
  }

  /**
   * Generate AI response with memory and knowledge base context
   */
  async generateResponse(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<{
    response: string;
    shouldEscalate: boolean;
    escalationReason?: string;
  }> {
    try {
      // Check if API key is available
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        // Use fallback response when no API key
        const knowledgeContext = this.searchKnowledgeBase(userMessage);
        const fallbackResponse = this.generateFallbackResponse(userMessage, knowledgeContext);
        
        return {
          response: fallbackResponse,
          shouldEscalate: this.checkEscalation(conversationId, userMessage, fallbackResponse),
          escalationReason: 'Sistema en modo demo - sin API key de Google AI',
        };
      }

      // Load conversation history from database
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 20, // Last 20 messages for context
      });

      // Search knowledge base
      const knowledgeContext = this.searchKnowledgeBase(userMessage);

      // Build prompt with context
      const systemPrompt = `Eres un asistente de servicio al cliente para Tigrito, una plataforma que conecta clientes con profesionales verificados.

**Contexto de la Base de Conocimiento:**
${knowledgeContext}

**Instrucciones:**
- Sé amable, profesional y útil
- Usa la información de la base de conocimiento cuando sea relevante
- Si no puedes responder con confianza, pregunta si el usuario quiere hablar con un agente humano
- Mantén las respuestas concisas pero informativas
- Usa un tono conversacional en español

**IMPORTANTE:** Si el usuario responde "sí", "si", "ok", "de acuerdo" o similar a tu pregunta sobre contactar un agente humano, debes confirmar que estás creando un ticket de soporte y que un agente se pondrá en contacto pronto.`;

      // Build conversation history
      const chatHistory = messages.map(msg => 
        msg.senderId === userId 
          ? new HumanMessage(msg.content || msg.text || '')
          : new AIMessage(msg.content || msg.text || '')
      );

      // Create prompt
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        ['human', userMessage],
      ]);

      // Generate response
      const chain = prompt.pipe(this.model);
      const response = await chain.invoke({
        input: userMessage,
      });

      const responseText = typeof response.content === 'string' 
        ? response.content 
        : response.content.toString();

      // Check for escalation triggers
      console.log('🔍 Checking escalation for message:', userMessage);
      console.log('🔍 AI Response:', responseText);
      
      const shouldEscalate = this.checkEscalation(
        conversationId,
        userMessage,
        responseText
      );
      
      console.log('🔍 Should escalate?', shouldEscalate);

      let escalationReason: string | undefined;
      if (shouldEscalate) {
        escalationReason = this.getEscalationReason(userMessage, responseText);
        console.log('🔍 Escalation reason:', escalationReason);
      }

      return {
        response: responseText,
        shouldEscalate,
        escalationReason,
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        response: 'Lo siento, estoy experimentando dificultades técnicas. Un agente humano te ayudará en breve.',
        shouldEscalate: true,
        escalationReason: 'Error técnico en el sistema de IA',
      };
    }
  }

  /**
   * Generate fallback response when no API key is available
   */
  private generateFallbackResponse(userMessage: string, knowledgeContext: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for common greetings
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas tardes')) {
      return '¡Hola! Soy el asistente virtual de Tigrito. Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios. ¿En qué puedo asistirte hoy?';
    }
    
    // Check for service-related questions
    if (lowerMessage.includes('servicio') || lowerMessage.includes('cómo funciona')) {
      return 'Tigrito es una plataforma que conecta clientes con profesionales verificados para diversos trabajos y servicios. Puedes publicar solicitudes de servicios y recibir ofertas de profesionales calificados.';
    }
    
    // Check for payment questions
    if (lowerMessage.includes('pago') || lowerMessage.includes('tarjeta') || lowerMessage.includes('precio')) {
      return 'Aceptamos pagos con tarjeta de crédito, débito y transferencias bancarias. Los pagos son seguros y utilizamos encriptación de grado bancario para proteger tus datos.';
    }
    
    // Check for help requests
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('problema') || lowerMessage.includes('no funciona')) {
      return 'Entiendo que necesitas ayuda. Aunque estoy en modo demo, puedo escalar tu consulta a un agente humano que te asistirá personalmente. ¿Te gustaría que te conecte con nuestro equipo de soporte?';
    }
    
    // Use knowledge base context if available
    if (knowledgeContext && knowledgeContext !== 'No encontré información específica sobre tu consulta.') {
      return `Basándome en nuestra base de conocimiento: ${knowledgeContext}\n\nSi necesitas más información específica, puedo conectarte con un agente humano.`;
    }
    
    // Default response
    return 'Gracias por tu consulta. Aunque estoy en modo demo, puedo ayudarte con información básica sobre Tigrito o conectarte con un agente humano para asistencia personalizada. ¿En qué más puedo ayudarte?';
  }

  /**
   * Check if conversation should be escalated to human
   */
  private checkEscalation(
    conversationId: string,
    userMessage: string,
    aiResponse: string
  ): boolean {
    console.log('🔍 checkEscalation called with:', { userMessage, aiResponse });
    
    // Check for explicit human request
    const humanRequestKeywords = [
      'hablar con un humano',
      'agente humano',
      'hablar con alguien',
      'necesito ayuda',
      'no me ayuda',
      'esto no funciona',
      'quiero hablar con',
    ];

    const lowerMessage = userMessage.toLowerCase();
    console.log('🔍 Checking human request keywords in:', lowerMessage);
    
    if (humanRequestKeywords.some(keyword => lowerMessage.includes(keyword))) {
      console.log('✅ Found explicit human request keyword');
      return true;
    }

    // Check for affirmative responses to escalation questions
    const affirmativeResponses = [
      'si',
      'sí',
      'yes',
      'ok',
      'okay',
      'de acuerdo',
      'perfecto',
      'claro',
      'por supuesto',
      'bueno',
    ];

    // Check if AI response contains escalation question and user responds affirmatively
    const escalationQuestionPatterns = [
      'agente',
      'humano',
      'soporte',
      'ayuda',
      'contactar',
      'conectar',
      'poner en contacto',
    ];

    const lowerAiResponse = aiResponse.toLowerCase();
    console.log('🔍 Checking escalation question patterns in AI response:', lowerAiResponse);
    
    const hasEscalationQuestion = escalationQuestionPatterns.some(pattern => 
      lowerAiResponse.includes(pattern)
    );
    console.log('🔍 Has escalation question?', hasEscalationQuestion);

    const isAffirmativeResponse = affirmativeResponses.some(response => 
      lowerMessage.includes(response)
    );
    console.log('🔍 Is affirmative response?', isAffirmativeResponse);

    if (hasEscalationQuestion && isAffirmativeResponse) {
      console.log('✅ Found affirmative response to escalation question');
      return true;
    }

    // Check AI confidence
    const lowConfidenceIndicators = [
      'no estoy seguro',
      'no puedo ayudarte',
      'contacta a un agente',
      'habla con un agente',
      'no tengo información',
    ];

    const lowerResponse = aiResponse.toLowerCase();
    if (lowConfidenceIndicators.some(indicator => lowerResponse.includes(indicator))) {
      return true;
    }

    // Check failed attempts threshold
    const attempts = this.failedAttempts.get(conversationId) || 0;
    if (attempts >= 2) {
      console.log('✅ Escalating due to multiple failed attempts');
      this.failedAttempts.delete(conversationId); // Reset
      return true;
    }

    // Increment failed attempts if response seems unhelpful
    if (aiResponse.length < 50 || lowerResponse.includes('lo siento')) {
      this.failedAttempts.set(conversationId, attempts + 1);
    }

    console.log('❌ No escalation needed');
    return false;
  }

  /**
   * Get escalation reason
   */
  private getEscalationReason(userMessage: string, aiResponse: string): string {
    const lowerMessage = userMessage.toLowerCase();
    const lowerAiResponse = aiResponse.toLowerCase();
    
    if (lowerMessage.includes('hablar con un humano') || lowerMessage.includes('agente humano')) {
      return 'Usuario solicitó explícitamente contacto humano';
    }

    // Check for affirmative response to escalation question
    const affirmativeResponses = ['si', 'sí', 'yes', 'ok', 'okay', 'de acuerdo', 'perfecto', 'claro', 'por supuesto', 'bueno'];
    const escalationQuestionPatterns = ['agente', 'humano', 'soporte', 'ayuda', 'contactar', 'conectar', 'poner en contacto'];
    
    const hasEscalationQuestion = escalationQuestionPatterns.some(pattern => 
      lowerAiResponse.includes(pattern)
    );
    const isAffirmativeResponse = affirmativeResponses.some(response => 
      lowerMessage.includes(response)
    );

    if (hasEscalationQuestion && isAffirmativeResponse) {
      return 'Usuario confirmó que desea hablar con un agente humano';
    }

    if (lowerAiResponse.includes('no puedo ayudarte')) {
      return 'IA no pudo proporcionar una solución adecuada';
    }

    const attempts = this.failedAttempts.get(userMessage) || 0;
    if (attempts >= 2) {
      return 'Múltiples intentos fallidos de resolución (>=3 intentos)';
    }

    return 'Escalación automática basada en contexto de la conversación';
  }

  /**
   * Generate ticket summary for escalation
   */
  async generateTicketSummary(conversationId: string): Promise<string> {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });

      const conversationText = messages
        .map(msg => `${msg.senderId === 'bot' ? 'Bot' : 'Usuario'}: ${msg.content || msg.text}`)
        .join('\\n');

      const summaryPrompt = `Resume la siguiente conversación de soporte al cliente en 2-3 oraciones, destacando el problema principal del usuario:

${conversationText}

Resumen:`;

      const response = await this.model.invoke(summaryPrompt);
      return typeof response.content === 'string' 
        ? response.content 
        : response.content.toString();
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Usuario requiere asistencia de un agente humano';
    }
  }

  /**
   * Update knowledge base
   */
  async updateKnowledgeBase(newKnowledgeBase: Partial<KnowledgeBase>): Promise<void> {
    this.knowledgeBase = {
      ...this.knowledgeBase,
      ...newKnowledgeBase,
    };
    
    // Save to JSON file
    try {
      const fs = require('fs');
      const path = require('path');
      const knowledgeBasePath = path.join(process.cwd(), 'data', 'knowledge-base.json');
      fs.writeFileSync(knowledgeBasePath, JSON.stringify(this.knowledgeBase, null, 2));
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }

  /**
   * Get current knowledge base
   */
  getKnowledgeBase(): KnowledgeBase {
    return this.knowledgeBase;
  }
}

// Singleton instance
export const chatbotService = new ChatbotService();

