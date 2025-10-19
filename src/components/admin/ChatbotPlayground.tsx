'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  messageType?: string;
}

interface ChatbotPlaygroundProps {
  conversationId: string;
  onEscalation?: (ticketId: string) => void;
}

export function ChatbotPlayground({ conversationId, onEscalation }: ChatbotPlaygroundProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar mensaje');
      }

      // Add user message
      setMessages(prev => [
        ...prev,
        {
          id: data.userMessage.id,
          content: data.userMessage.content,
          senderId: data.userMessage.senderId,
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
          createdAt: data.botMessage.createdAt,
        },
      ]);

      // Handle escalation
      if (data.escalated && data.ticket) {
        setIsEscalated(true);
        onEscalation?.(data.ticket.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: 'Error al procesar tu mensaje. Por favor, intenta de nuevo.',
          senderId: 'system',
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

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chatbot Playground
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
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Bot className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Inicia una conversación con el chatbot</p>
                <p className="text-sm text-gray-400 mt-1">
                  Escribe un mensaje para comenzar
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => {
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={cn(
                      'text-xs mt-1',
                      isBot ? 'text-gray-500' : 'text-blue-100'
                    )}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
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
      </CardContent>
    </Card>
  );
}

