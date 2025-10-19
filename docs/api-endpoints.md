# API Endpoints - Chatbot de Atención al Cliente

Esta documentación describe los endpoints disponibles para que los usuarios finales interactúen con el chatbot de atención al cliente.

## Base URL
```
http://localhost:3000/api/chatbot
```

## Autenticación
El sistema opera sin autenticación requerida para facilitar la integración. Los usuarios se crean automáticamente.

---

## 1. Gestión de Conversaciones

### 1.1 Iniciar Nueva Conversación
**POST** `/conversations`

Inicia una nueva conversación con el chatbot de atención al cliente.

**Request Body:**
```json
{
  "title": "Consulta sobre servicios"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "conversation": {
    "id": "conv-123",
    "title": "Consulta sobre servicios",
    "createdAt": "2024-01-15T10:30:00Z",
    "status": "ACTIVE"
  }
}
```

### 1.2 Obtener Historial de Conversación
**GET** `/conversations/{id}/messages`

Obtiene todos los mensajes de una conversación específica.

**Path Parameters:**
- `id`: ID de la conversación

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv-123",
    "messages": [
      {
        "id": "msg-1",
        "content": "Hola, necesito información sobre sus servicios",
        "senderId": "user-123",
        "senderName": "Usuario",
        "senderType": "USER",
        "createdAt": "2024-01-15T10:30:00Z",
        "messageType": "TEXT"
      },
      {
        "id": "msg-2",
        "content": "¡Hola! Con gusto te ayudo con información sobre nuestros servicios. ¿Qué te gustaría saber específicamente?",
        "senderId": "bot-123",
        "senderName": "Asistente IA",
        "senderType": "BOT",
        "createdAt": "2024-01-15T10:30:15Z",
        "messageType": "TEXT"
      }
    ],
    "total": 2
  }
}
```

---

## 2. Interacción con el Chatbot

### 2.1 Enviar Mensaje al Chatbot
**POST** `/message`

Envía un mensaje al chatbot y recibe una respuesta inteligente. El chatbot puede escalar automáticamente a un agente humano si es necesario.

**Request Body:**
```json
{
  "conversationId": "conv-123",
  "message": "¿Cuáles son sus horarios de atención?"
}
```

**Response (200 OK) - Respuesta del chatbot:**
```json
{
  "success": true,
  "message": {
    "id": "msg-456",
    "content": "Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM. ¿Hay algo más en lo que pueda ayudarte?",
    "senderId": "bot-123",
    "messageType": "TEXT",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "escalated": false
}
```

**Response (400 Bad Request) - Cuando se escala a agente humano:**
```json
{
  "error": "Tu consulta ha sido transferida a un agente humano. Un especialista se pondrá en contacto contigo pronto.",
  "escalated": true,
  "ticketId": "ticket-789",
  "status": "PENDING_HUMAN_ASSIGNMENT"
}
```

### 2.2 Obtener Base de Conocimiento
**GET** `/knowledge`

Obtiene la base de conocimiento del chatbot con preguntas frecuentes y respuestas.

**Response (200 OK):**
```json
{
  "success": true,
  "knowledgeBase": {
    "categories": [
      {
        "name": "Horarios y Contacto",
        "questions": [
          {
            "question": "¿Cuáles son sus horarios de atención?",
            "answer": "Nuestros horarios son de lunes a viernes de 9:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM.",
            "keywords": ["horarios", "atención", "contacto"]
          },
          {
            "question": "¿Cómo puedo contactar soporte?",
            "answer": "Puedes contactarnos por teléfono al +1-800-123-4567 o por email a soporte@empresa.com",
            "keywords": ["contacto", "soporte", "teléfono", "email"]
          }
        ]
      },
      {
        "name": "Servicios",
        "questions": [
          {
            "question": "¿Qué servicios ofrecen?",
            "answer": "Ofrecemos servicios de consultoría, desarrollo web, marketing digital y análisis de datos.",
            "keywords": ["servicios", "consultoría", "desarrollo", "marketing"]
          }
        ]
      }
    ]
  }
}
```

---

## 3. Estados de Conversación

### Estados Posibles:
- **`ACTIVE`**: Conversación activa con el chatbot
- **`ESCALATED`**: Escalada a agente humano
- **`RESOLVED`**: Conversación resuelta
- **`CLOSED`**: Conversación cerrada

### Flujo de Escalación:
1. **Usuario inicia conversación** → Estado: `ACTIVE`
2. **Chatbot responde automáticamente** → Continúa en `ACTIVE`
3. **Si necesita agente humano** → Estado: `ESCALATED`
4. **Agente resuelve consulta** → Estado: `RESOLVED`
5. **Conversación finalizada** → Estado: `CLOSED`

---

## 4. Tipos de Mensaje

### Tipos Disponibles:
- **`TEXT`**: Mensaje de texto normal
- **`SYSTEM`**: Mensaje del sistema (notificaciones)
- **`FILE`**: Archivo adjunto (futuro)
- **`IMAGE`**: Imagen (futuro)

---

## Códigos de Error Comunes

### 400 Bad Request
```json
{
  "error": "conversationId y message son requeridos"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Conversación no encontrada"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error interno del servidor"
}
```

---

## Ejemplos de Uso

### Flujo Básico de Conversación:

1. **Iniciar conversación:**
```bash
POST /api/chatbot/conversations
{
  "title": "Consulta sobre productos"
}
```

2. **Enviar mensaje:**
```bash
POST /api/chatbot/message
{
  "conversationId": "conv-123",
  "message": "¿Tienen productos para empresas?"
}
```

3. **Obtener historial:**
```bash
GET /api/chatbot/conversations/conv-123/messages
```

### Integración en Frontend:

```javascript
// Iniciar conversación
const startConversation = async (title) => {
  const response = await fetch('/api/chatbot/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return response.json();
};

// Enviar mensaje
const sendMessage = async (conversationId, message) => {
  const response = await fetch('/api/chatbot/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, message })
  });
  return response.json();
};

// Obtener mensajes
const getMessages = async (conversationId) => {
  const response = await fetch(`/api/chatbot/conversations/${conversationId}/messages`);
  return response.json();
};
```

---

## Notas Importantes

1. **Sin Autenticación**: Los endpoints están diseñados para ser públicos y fáciles de integrar.

2. **Escalación Automática**: El chatbot puede transferir automáticamente conversaciones a agentes humanos cuando detecta que es necesario.

3. **Base de Conocimiento**: El chatbot utiliza una base de conocimiento estructurada para responder preguntas frecuentes.

4. **Persistencia**: Todas las conversaciones se guardan en la base de datos para seguimiento.

5. **Respuestas Inteligentes**: El chatbot utiliza IA para generar respuestas contextuales y relevantes.

6. **Escalación Inteligente**: El sistema detecta automáticamente cuándo una consulta requiere atención humana.

7. **Historial Completo**: Todas las conversaciones mantienen un historial completo de mensajes.
