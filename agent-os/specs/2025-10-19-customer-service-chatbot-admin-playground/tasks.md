# Task Breakdown: Customer Service Chatbot with Human Escalation - Admin Playground

## Overview
Total Tasks: 4 groups, 20 sub-tasks
Assigned roles: database-engineer, api-engineer, ui-designer, testing-engineer

## Task List

### Database Layer

#### Task Group 1: Database Models and Migrations
**Assigned implementer:** database-engineer
**Dependencies:** None

- [x] 1.0 Complete database layer
  - [x] 1.1 Write 2-8 focused tests for SupportTicket model functionality
    - Test ticket creation with valid data
    - Test ticket status transitions
    - Test conversation association
    - Test user assignment
    - Test escalation reason storage
  - [x] 1.2 Create SupportTicket model with validations
    - Fields: id, conversationId, clientId, assignedToId, status, escalationReason, initialSummary, openedAt, assignedAt, closedAt
    - Validations: required fields, status enum validation, foreign key constraints
    - Reuse pattern from: existing Conversation and Message models
  - [x] 1.3 Create migration for support_tickets table
    - Add indexes for: conversationId, clientId, assignedToId, status, openedAt
    - Foreign keys: conversationId -> conversations.id, clientId -> users.id, assignedToId -> users.id
  - [x] 1.4 Set up associations
    - SupportTicket belongs_to Conversation
    - SupportTicket belongs_to User (client)
    - SupportTicket belongs_to User (assigned admin)
    - Conversation has_one SupportTicket
    - User has_many SupportTickets (as client)
    - User has_many SupportTickets (as assigned admin)
  - [x] 1.5 Ensure database layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- SupportTicket model passes validation tests
- Migrations run successfully
- Associations work correctly

### API Layer

#### Task Group 2: API Endpoints and Services
**Assigned implementer:** api-engineer
**Dependencies:** Task Group 1

- [x] 2.0 Complete API layer
  - [x] 2.1 Write 2-8 focused tests for API endpoints
    - Test playground conversation creation
    - Test chatbot message processing
    - Test ticket listing and filtering
    - Test admin response to tickets
    - Test ticket status updates
  - [x] 2.2 Create LangChain service integration
    - Implement Google Gemini 2.5 integration
    - Create conversation memory management
    - Implement JSON knowledge base retrieval
    - Add escalation logic (2-3 failed attempts threshold)
  - [x] 2.3 Create chatbot API endpoints
    - POST /api/admin/chatbot/playground - Start new test conversation
    - POST /api/admin/chatbot/message - Send message to chatbot
    - GET /api/admin/chatbot/knowledge - Manage JSON knowledge base
  - [x] 2.4 Create ticket management API endpoints
    - GET /api/admin/chatbot/tickets - List all support tickets
    - GET /api/admin/chatbot/tickets/[id] - Get ticket details with conversation
    - POST /api/admin/chatbot/tickets/[id]/respond - Admin response to ticket
    - PUT /api/admin/chatbot/tickets/[id]/status - Update ticket status
  - [x] 2.5 Implement authentication/authorization
    - Use existing admin auth pattern
    - Add role-based access control (ADMIN only)
    - Validate user permissions for ticket operations
  - [x] 2.6 Add API response formatting
    - JSON responses with consistent structure
    - Error handling with appropriate status codes
    - Pagination for ticket listings
  - [x] 2.7 Ensure API layer tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify critical API operations work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- All API endpoints work correctly
- LangChain integration functions properly
- Proper authorization enforced
- Consistent response format

### Frontend Components

#### Task Group 3: UI Components and Pages
**Assigned implementer:** ui-designer
**Dependencies:** Task Group 2

- [x] 3.0 Complete UI components
  - [x] 3.1 Write 2-8 focused tests for UI components
    - Test ChatbotPlayground component rendering
    - Test message sending and receiving
    - Test ticket list display and filtering
    - Test ticket detail view
    - Test admin response functionality
  - [x] 3.2 Create ChatbotPlayground component
    - Reuse: existing Card components as base
    - Props: conversationId, onEscalation
    - State: messages, isLoading, inputValue
    - Features: message history, input field, send button, escalation indicator
  - [x] 3.3 Create TicketManagement component
    - Reuse: existing DataTable component as base
    - Props: tickets, onStatusUpdate, onRespond
    - State: selectedTicket, filterStatus
    - Features: ticket list, status filters, search, pagination
  - [x] 3.4 Create TicketDetail component
    - Reuse: existing Card and Button components
    - Props: ticket, conversation, onRespond, onStatusUpdate
    - State: responseText, isResponding
    - Features: conversation view, response input, status selector
  - [x] 3.5 Build admin pages
    - /admin/chatbot/playground - Main testing interface
    - /admin/chatbot/tickets - Ticket management interface
    - /admin/chatbot/tickets/[id] - Individual ticket view
    - /admin/chatbot/knowledge - JSON knowledge base editor
  - [x] 3.6 Update AdminSidebar navigation
    - Add "Chatbot Support" section with MessageSquare icon
    - Include submenu: Playground, Tickets, Knowledge
    - Follow existing navigation pattern
  - [x] 3.7 Apply responsive design
    - Mobile: 320px - 768px (stacked layout)
    - Tablet: 768px - 1024px (sidebar + main content)
    - Desktop: 1024px+ (full sidebar + main content)
  - [x] 3.8 Add interactions and animations
    - Message typing indicators
    - Loading states for API calls
    - Smooth transitions between views
    - Hover effects on interactive elements
  - [x] 3.9 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify critical component behaviors work
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Components render correctly with proper styling
- All admin pages are accessible and functional
- Responsive design works across breakpoints
- Matches existing admin design patterns

### Testing

#### Task Group 4: Test Review & Gap Analysis
**Assigned implementer:** testing-engineer
**Dependencies:** Task Groups 1-3

- [ ] 4.0 Review existing tests and fill critical gaps only
  - [ ] 4.1 Review tests from Task Groups 1-3
    - Review the 2-8 tests written by database-engineer (Task 1.1)
    - Review the 2-8 tests written by api-engineer (Task 2.1)
    - Review the 2-8 tests written by ui-designer (Task 3.1)
    - Total existing tests: approximately 6-24 tests
  - [ ] 4.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to chatbot playground and ticket management
    - Prioritize end-to-end workflows: playground → escalation → ticket management
    - Do NOT assess entire application test coverage
  - [ ] 4.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points: LangChain → database, API → frontend
    - Test complete escalation workflow: AI chat → escalation → human response
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 4.4 Run feature-specific tests only
    - Run ONLY tests related to this spec's feature (tests from 1.1, 2.1, 3.1, and 4.3)
    - Expected total: approximately 16-34 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 16-34 tests total)
- Critical user workflows for chatbot playground and ticket management are covered
- No more than 10 additional tests added by testing-engineer
- Testing focused exclusively on this spec's feature requirements

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Create SupportTicket model and migrations
2. API Layer (Task Group 2) - Implement LangChain integration and API endpoints
3. Frontend Design (Task Group 3) - Build UI components and admin pages
4. Test Review & Gap Analysis (Task Group 4) - Ensure comprehensive test coverage

## Technical Dependencies

- **LangChain Dependencies**: @langchain/core, @langchain/google-genai, @langchain/community
- **Database**: Existing Prisma setup with PostgreSQL
- **UI Framework**: Existing shadcn/ui components and Tailwind CSS
- **Authentication**: Existing admin authentication system
- **State Management**: Existing patterns for API calls and state management
