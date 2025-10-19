'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// // import { ScrollArea } from '@/components/ui/scroll-area'; // Removed due to import issues // Removed due to import issues
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  MessageSquare, 
  Plus, 
  Search,
  Clock,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  senderType?: 'USER' | 'BOT' | 'ADMIN';
  createdAt: string;
  messageType?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageAt: string;
  messageCount: number;
  status: 'ACTIVE' | 'ESCALATED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

interface ChatbotPlaygroundWithHistoryProps {
  onEscalation?: (ticketId: string) => void;
}

export function ChatbotPlaygroundWithHistory({ onEscalation }: ChatbotPlaygroundWithHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const response = await fetch('/api/admin/chatbot/conversations');
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.data.conversations);
        // Auto-select first conversation if none selected
        if (data.data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/admin/chatbot/conversations/${conversationId}/messages`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages);
        // Reset escalation state when loading new conversation
        setIsEscalated(false);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/admin/chatbot/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        // Reload conversations to get the new one
        await loadConversations();
        // Select the new conversation
        setSelectedConversation(data.conversationId);
        setMessages([]);
        setIsEscalated(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !selectedConversation) return;

    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle escalation blocking
        if (data.escalated) {
          setIsEscalated(true);
          setMessages(prev => [
            ...prev,
            {
              id: `escalation-${Date.now()}`,
              content: data.error,
              senderId: 'system',
              senderName: 'Sistema',
              senderType: 'BOT',
              createdAt: new Date().toISOString(),
              messageType: 'SYSTEM',
            },
          ]);
          await loadConversations();
          return;
        }
        throw new Error(data.error || 'Error al enviar mensaje');
      }

      // Add user message
      setMessages(prev => [
        ...prev,
        {
          id: data.userMessage.id,
          content: data.userMessage.content,
          senderId: data.userMessage.senderId,
          senderName: data.userMessage.senderName,
          senderType: data.userMessage.senderType,
          createdAt: data.userMessage.createdAt,
        },
      ]);

      // Add bot response
      setMessages(prev => [
        ...prev,
        {
          id: data.botMessage.id,
          content: data.botMessage.content,
          senderId: data.botMessage.senderId,
          senderName: data.botMessage.senderName,
          senderType: data.botMessage.senderType,
          createdAt: data.botMessage.createdAt,
        },
      ]);

      // Handle escalation
      if (data.escalated && data.ticket) {
        setIsEscalated(true);
        onEscalation?.(data.ticket.id);
      }

      // Reload conversations to update last message
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
          senderId: 'system',
          senderName: 'Sistema',
          senderType: 'BOT',
          createdAt: new Date().toISOString(),
          messageType: 'SYSTEM',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'ESCALATED':
        return 'bg-orange-100 text-orange-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'ESCALATED':
        return 'Escalada';
      case 'CLOSED':
        return 'Cerrada';
      default:
        return status;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[700px] gap-4">
      {/* Conversations Sidebar */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5" />
              Conversaciones
            </CardTitle>
            <Button
              onClick={createNewConversation}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <div className="h-full overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center p-4 text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay conversaciones</p>
                </div>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50',
                      selectedConversation === conversation.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'border border-transparent'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm truncate flex-1">
                        {conversation.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn('text-xs ml-2', getStatusColor(conversation.status))}
                      >
                        {getStatusText(conversation.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                      <span>{conversation.messageCount} mensajes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {selectedConversation ? 'Chat' : 'Selecciona una conversación'}
            </CardTitle>
            {isEscalated && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Escalado a Humano
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {!selectedConversation ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Selecciona una conversación para comenzar</p>
                <p className="text-sm text-gray-400 mt-1">
                  O crea una nueva conversación
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Inicia una conversación con el chatbot</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Escribe un mensaje para comenzar
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isBot = message.senderType === 'BOT' || message.senderId === 'system';
                    const isAdmin = message.senderType === 'ADMIN';
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
                          isBot || isAdmin ? 'justify-start' : 'justify-end'
                        )}
                      >
                        {(isBot || isAdmin) && (
                          <div className="flex-shrink-0">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center',
                              isAdmin ? 'bg-orange-100' : 'bg-blue-100'
                            )}>
                              {isAdmin ? (
                                <User className="h-4 w-4 text-orange-600" />
                              ) : (
                                <Bot className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        )}

                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-4 py-2',
                            isBot || isAdmin
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-blue-600 text-white'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p
                              className={cn(
                                'text-xs',
                                isBot || isAdmin ? 'text-gray-500' : 'text-blue-100'
                              )}
                            >
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                            {message.senderName && (
                              <p
                                className={cn(
                                  'text-xs ml-2',
                                  isBot || isAdmin ? 'text-gray-400' : 'text-blue-200'
                                )}
                              >
                                {message.senderName}
                              </p>
                            )}
                          </div>
                        </div>

                        {!isBot && !isAdmin && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
