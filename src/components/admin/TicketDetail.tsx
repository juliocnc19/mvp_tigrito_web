'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Bot, User, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender?: {
    name: string;
    email: string;
  };
  messageType?: string;
}

interface Ticket {
  id: string;
  status: string;
  escalationReason: string;
  initialSummary: string;
  openedAt: string;
  assignedAt?: string;
  closedAt?: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  conversation: {
    id: string;
    title: string;
    createdAt: string;
    messages: Message[];
  };
}

interface TicketDetailProps {
  ticketId: string;
  onStatusUpdate?: () => void;
}

export function TicketDetail({ ticketId, onStatusUpdate }: TicketDetailProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTicket = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/chatbot/tickets/${ticketId}`);
      const data = await response.json();

      if (data.success) {
        setTicket(data.ticket);
        setSelectedStatus(data.ticket.status);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.conversation.messages]);

  const handleRespond = async () => {
    if (!responseText.trim() || isResponding) return;

    setIsResponding(true);
    try {
      const response = await fetch(`/api/admin/chatbot/tickets/${ticketId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: responseText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al responder');
      }

      setResponseText('');
      await fetchTicket(); // Refresh ticket data
    } catch (error) {
      console.error('Error responding:', error);
      alert('Error al enviar respuesta');
    } finally {
      setIsResponding(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === ticket?.status) return;

    try {
      const response = await fetch(`/api/admin/chatbot/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar estado');
      }

      await fetchTicket(); // Refresh ticket data
      onStatusUpdate?.();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar estado');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Ticket no encontrado
        </CardContent>
      </Card>
    );
  }

  const isClosed = ticket.status === 'CLOSED_RESOLVED' || ticket.status === 'CLOSED_BY_CLIENT';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chat Area */}
      <div className="lg:col-span-2">
        <Card className="flex flex-col h-[700px]">
          <CardHeader className="border-b">
            <CardTitle>{ticket.conversation.title}</CardTitle>
            <p className="text-sm text-gray-500">Ticket ID: {ticket.id}</p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {ticket.conversation.messages.map((message) => {
                const isBot = message.senderId === 'system' || message.senderId === 'bot';
                const isSystem = message.messageType === 'SYSTEM';

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <Badge variant="outline" className="text-xs">
                        {message.content}
                      </Badge>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      isBot ? 'justify-start' : 'justify-end'
                    )}
                  >
                    {isBot && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    )}

                    <div
                      className={cn(
                        'max-w-[70%] rounded-lg px-4 py-2',
                        isBot
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-600 text-white'
                      )}
                    >
                      {message.sender && (
                        <p className={cn('text-xs font-medium mb-1', isBot ? 'text-gray-600' : 'text-blue-100')}>
                          {message.sender.name}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          isBot ? 'text-gray-500' : 'text-blue-100'
                        )}
                      >
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!isBot && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Response Area */}
            <div className="border-t p-4">
              {isClosed ? (
                <div className="text-center text-gray-500 py-4">
                  Este ticket está cerrado. No se pueden enviar más mensajes.
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    disabled={isResponding}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleRespond}
                      disabled={isResponding || !responseText.trim()}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Enviar Respuesta
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Ticket Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN_AI_HANDLING">IA Respondiendo</SelectItem>
                  <SelectItem value="PENDING_HUMAN_ASSIGNMENT">Pendiente Asignación</SelectItem>
                  <SelectItem value="ACTIVE_HUMAN_CHAT">Chat Activo</SelectItem>
                  <SelectItem value="CLOSED_RESOLVED">Resuelto</SelectItem>
                  <SelectItem value="CLOSED_BY_CLIENT">Cerrado por Cliente</SelectItem>
                </SelectContent>
              </Select>
              {selectedStatus !== ticket.status && (
                <Button
                  onClick={handleStatusUpdate}
                  size="sm"
                  className="w-full mt-2"
                >
                  Actualizar Estado
                </Button>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Razón de Escalación</p>
              <p className="text-sm mt-1">{ticket.escalationReason || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Resumen Inicial</p>
              <p className="text-sm mt-1">{ticket.initialSummary || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Abierto</p>
              <p className="text-sm mt-1">
                {new Date(ticket.openedAt).toLocaleString()}
              </p>
            </div>

            {ticket.assignedAt && (
              <div>
                <p className="text-sm font-medium text-gray-500">Asignado</p>
                <p className="text-sm mt-1">
                  {new Date(ticket.assignedAt).toLocaleString()}
                </p>
              </div>
            )}

            {ticket.closedAt && (
              <div>
                <p className="text-sm font-medium text-gray-500">Cerrado</p>
                <p className="text-sm mt-1">
                  {new Date(ticket.closedAt).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-sm mt-1">{ticket.client.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm mt-1">{ticket.client.email}</p>
            </div>
            {ticket.client.phone && (
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-sm mt-1">{ticket.client.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Agent Info */}
        {ticket.assignedTo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agente Asignado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-sm mt-1">{ticket.assignedTo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm mt-1">{ticket.assignedTo.email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

