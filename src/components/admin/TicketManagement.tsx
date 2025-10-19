'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Ticket {
  id: string;
  status: string;
  escalationReason: string;
  initialSummary: string;
  openedAt: string;
  client: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  } | null;
  conversationTitle: string;
}

export function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (filterStatus !== 'ALL') {
        params.append('status', filterStatus);
      }

      const response = await fetch(`/api/admin/chatbot/tickets?${params}`);
      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, filterStatus]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      OPEN_AI_HANDLING: {
        variant: 'default',
        icon: <Clock className="h-3 w-3" />,
        label: 'IA Respondiendo',
      },
      PENDING_HUMAN_ASSIGNMENT: {
        variant: 'destructive',
        icon: <AlertCircle className="h-3 w-3" />,
        label: 'Pendiente Asignación',
      },
      ACTIVE_HUMAN_CHAT: {
        variant: 'default',
        icon: <User className="h-3 w-3" />,
        label: 'Chat Activo',
      },
      CLOSED_RESOLVED: {
        variant: 'secondary',
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Resuelto',
      },
      CLOSED_BY_CLIENT: {
        variant: 'outline',
        icon: <XCircle className="h-3 w-3" />,
        label: 'Cerrado por Cliente',
      },
    };

    const config = variants[status] || variants.OPEN_AI_HANDLING;

    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.conversationTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Tickets de Soporte</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente o título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los Estados</SelectItem>
              <SelectItem value="OPEN_AI_HANDLING">IA Respondiendo</SelectItem>
              <SelectItem value="PENDING_HUMAN_ASSIGNMENT">Pendiente Asignación</SelectItem>
              <SelectItem value="ACTIVE_HUMAN_CHAT">Chat Activo</SelectItem>
              <SelectItem value="CLOSED_RESOLVED">Resuelto</SelectItem>
              <SelectItem value="CLOSED_BY_CLIENT">Cerrado por Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron tickets
          </div>
        ) : (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead>Último Mensaje</TableHead>
                    <TableHead>Abierto</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.client.name}</p>
                          <p className="text-sm text-gray-500">{ticket.client.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{ticket.conversationTitle}</p>
                          {ticket.initialSummary && (
                            <p className="text-sm text-gray-500 truncate">
                              {ticket.initialSummary}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.assignedTo ? (
                          <div>
                            <p className="text-sm font-medium">{ticket.assignedTo.name}</p>
                            <p className="text-xs text-gray-500">{ticket.assignedTo.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No asignado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ticket.lastMessage ? (
                          <div className="max-w-xs">
                            <p className="text-sm truncate">{ticket.lastMessage.content}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(ticket.lastMessage.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin mensajes</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {new Date(ticket.openedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(ticket.openedAt).toLocaleTimeString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/chatbot/tickets/${ticket.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center px-4">
                  Página {page} de {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

