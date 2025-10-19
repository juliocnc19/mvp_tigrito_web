'use client';

import { ChatbotPlaygroundWithHistory } from '@/components/admin/ChatbotPlaygroundWithHistory';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ChatbotPlaygroundPage() {
  const handleEscalation = (ticketId: string) => {
    // Show notification or redirect to ticket
    console.log('Ticket created:', ticketId);
    // You could add a toast notification here
    alert(`Conversación escalada a ticket: ${ticketId}`);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Playground de Chatbot
          </h1>
          <p className="text-gray-500 mt-1">
            Prueba el chatbot y el flujo de escalación a soporte humano. 
            Gestiona el historial de conversaciones y continúa chats anteriores.
          </p>
        </div>
        <Link href="/admin/chatbot/tickets">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Ver Tickets
          </Button>
        </Link>
      </div>

      <ChatbotPlaygroundWithHistory onEscalation={handleEscalation} />
    </div>
  );
}