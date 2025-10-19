'use client';

import { Button } from '@/components/ui/button';
import { TicketDetail } from '@/components/admin/TicketDetail';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/chatbot/tickets">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Detalles del Ticket
          </h1>
          <p className="text-gray-500 mt-1">
            Conversa con el cliente y gestiona el estado del ticket
          </p>
        </div>
      </div>

      <TicketDetail ticketId={ticketId} />
    </div>
  );
}

