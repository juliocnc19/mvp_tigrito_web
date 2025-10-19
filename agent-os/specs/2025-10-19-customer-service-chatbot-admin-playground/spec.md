# Specification: Customer Service Chatbot with Human Escalation - Admin Playground

## Goal
Create an admin playground for testing a customer service chatbot with LangChain and Google Gemini 2.5, including human escalation capabilities and ticket management system for testing the full conversation flow.

## User Stories
- As an admin, I want to test the chatbot functionality in a playground environment so that I can verify the AI responses work correctly
- As an admin, I want to trigger human escalation during testing so that I can verify the ticket creation and management flow
- As an admin, I want to respond to escalated tickets as a human agent so that I can test the complete support workflow
- As an admin, I want to manage ticket statuses so that I can track and organize support requests
- As an admin, I want to view conversation history so that I can understand the context of each support interaction

## Core Requirements

### Functional Requirements
- **Admin Playground Interface**: Interactive chat interface for testing chatbot responses
- **LangChain Integration**: AI-powered responses using Google Gemini 2.5 with conversation memory
- **JSON Knowledge Base**: Simple JSON-based knowledge base for chatbot responses
- **Escalation Logic**: Automatic escalation after 2-3 failed AI attempts or explicit human requests
- **Ticket Management**: Full CRUD operations for support tickets with status tracking
- **Conversation Memory**: Persistent conversation history using existing Message model
- **Admin Sidebar Integration**: New "Chatbot Support" section in admin navigation
- **Status Management**: Complete ticket lifecycle management (Open, In Progress, Resolved, Closed)

### Non-Functional Requirements
- **Performance**: Chat responses should load within 3 seconds
- **Accessibility**: Follow WCAG 2.1 AA standards for admin interface
- **Security**: Admin-only access with role-based authentication
- **Scalability**: Support for multiple concurrent test conversations

## Visual Design
No visual assets provided - will follow existing admin design patterns using shadcn/ui components.

## Reusable Components

### Existing Code to Leverage
- **AdminSidebar**: Add new "Chatbot Support" navigation item with MessageSquare icon
- **AdminLayout**: Reuse existing admin layout structure and responsive design
- **Card Components**: Use existing Card, CardHeader, CardTitle, CardContent for UI sections
- **Button Components**: Reuse Button variants for actions and navigation
- **Badge Components**: Use Badge for ticket status indicators
- **Form Components**: Leverage existing form patterns for ticket management
- **DataTable**: Reuse existing DataTable component for ticket listing
- **Prisma Models**: Extend existing Conversation, Message, User models
- **Supabase Client**: Use existing database client for operations

### New Components Required
- **ChatbotPlayground**: Main chat interface component for testing
- **TicketManagement**: Ticket list and detail view component
- **SupportTicket Model**: New Prisma model for ticket tracking
- **LangChain Service**: AI integration service with memory management
- **Knowledge Base Service**: JSON-based knowledge management
- **Escalation Service**: Logic for determining when to escalate to human

## Technical Approach

### Database
- **New Model**: SupportTicket with fields for conversationId, clientId, assignedToId, status, escalationReason, timestamps
- **Relationships**: Link to existing Conversation, Message, and User models
- **Status Enum**: Define ticket statuses (OPEN_AI_HANDLING, PENDING_HUMAN_ASSIGNMENT, ACTIVE_HUMAN_CHAT, CLOSED_RESOLVED, CLOSED_BY_CLIENT)

### API
- **POST /api/admin/chatbot/playground**: Start new test conversation
- **POST /api/admin/chatbot/message**: Send message to chatbot
- **GET /api/admin/chatbot/tickets**: List all support tickets
- **GET /api/admin/chatbot/tickets/[id]**: Get ticket details with conversation
- **POST /api/admin/chatbot/tickets/[id]/respond**: Admin response to ticket
- **PUT /api/admin/chatbot/tickets/[id]/status**: Update ticket status
- **POST /api/admin/chatbot/knowledge**: Manage JSON knowledge base

### Frontend
- **Playground Page**: `/admin/chatbot/playground` - Main testing interface
- **Tickets Page**: `/admin/chatbot/tickets` - Ticket management interface
- **Ticket Detail**: `/admin/chatbot/tickets/[id]` - Individual ticket view
- **Knowledge Management**: `/admin/chatbot/knowledge` - JSON knowledge base editor

### Testing
- **Unit Tests**: LangChain service, escalation logic, ticket management
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Complete playground workflow, escalation flow

## Out of Scope
- Complex document management system (using simple JSON instead)
- Real-time notifications (for this phase)
- Mobile-specific implementations
- Advanced AI features beyond basic chatbot
- Separate testing environment outside admin
- Multi-language support (for this phase)

## Success Criteria
- Admin can successfully test chatbot responses in playground
- Escalation logic triggers correctly after 2-3 failed attempts
- Ticket management system handles full lifecycle
- Conversation memory persists across messages
- Admin can respond to escalated tickets as human agent
- All components integrate seamlessly with existing admin interface
