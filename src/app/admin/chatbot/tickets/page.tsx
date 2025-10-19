'use client';

import { Button } from '@/components/ui/button';
import { TicketManagement } from '@/components/admin/TicketManagement';
import { PlayCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export default function TicketsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tickets de Soporte
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona y responde a los tickets escalados de chatbot
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/chatbot/playground">
            <Button variant="outline" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Playground
            </Button>
          </Link>
          <Link href="/admin/chatbot/knowledge">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Base de Conocimiento
            </Button>
          </Link>
        </div>
      </div>

      <TicketManagement />
    </div>
  );
}

