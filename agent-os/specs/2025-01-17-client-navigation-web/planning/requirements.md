# Client Navigation Web Feature - Requirements

## Overview
Web-based client navigation flow for the MVP Tigrito professional services marketplace, converting the mobile app experience to a responsive web application.

## Feature Description
A comprehensive client-side web interface that allows users to:
- Browse and search for professional services
- Create and manage service requests (postings)
- Review and respond to offers from professionals
- Track service transactions and payments
- Manage account balance and payment methods

## Technical Context
- **Platform**: Next.js 14+ with React Server Components
- **UI Framework**: shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication (existing)
- **Styling**: Tailwind CSS with responsive design

## Core User Flows

### 1. Home Dashboard
- Display user balance with recharge/withdrawal options
- Show promotional banners and categories
- List top-rated professionals
- Quick access to create service requests
- Display nearby/relevant services

### 2. Service Discovery
- Search services and professionals
- Filter by categories and location
- View service details and professional profiles
- Browse proactive services offered by professionals

### 3. Service Request Management
- Create detailed service requests with:
  - Title, description, category
  - Location and urgency settings
  - Date/time requirements
  - Price range preferences
  - Media attachments
- Edit and delete existing requests
- Track request status (Open, In Progress, Completed)

### 4. Offer Management
- Review offers received for open requests
- Accept or reject offers
- Negotiate pricing when needed
- Communicate with professionals

### 5. Transaction Tracking
- Monitor active service transactions
- Update transaction status
- Complete or cancel services
- View transaction history

### 6. Account Management
- View and update profile information
- Manage payment methods
- Recharge account balance
- Withdraw funds
- View payment history

## Database Analysis Results

### ✅ Existing Tables (No Changes Needed)
- `User` - Complete with balance, location, roles
- `ServicePosting` - Service requests (client postings)
- `Offer` - Professional responses to postings
- `ServiceTransaction` - Service execution tracking
- `Payment` - Payment processing
- `UserPaymentMethod` - Payment method management
- `Withdrawal` - Fund withdrawal tracking
- `Review` - Service reviews and ratings
- `Media` - File attachments
- `Notification` - User notifications
- `Profession` - Service categories
- `ProfessionalProfile` - Professional profiles
- `ProfessionalService` - Proactive services

### ❌ Missing API Endpoints (Need Implementation)

#### Service Postings
- `GET /api/services/postings/[id]` - Get single posting
- `PUT /api/services/postings/[id]` - Update posting
- `DELETE /api/services/postings/[id]` - Delete posting
- `GET /api/services/postings/my` - User's postings

#### Offers Management
- `GET /api/services/offers` - List offers with filters
- `GET /api/services/offers/[id]` - Get single offer
- `PUT /api/services/offers/[id]` - Update offer status

#### Service Transactions
- `GET /api/services/transactions` - List user transactions
- `GET /api/services/transactions/[id]` - Get transaction details
- `PUT /api/services/transactions/[id]` - Update transaction status

#### Categories & Search
- `GET /api/professions` - List all categories
- `GET /api/professions/[id]` - Get category details
- `GET /api/services/search` - Search services and professionals
- `GET /api/professionals/top-rated` - Top-rated professionals

#### User Balance & Payments
- `GET /api/users/balance` - Get user balance
- `POST /api/payments/recharge` - Recharge balance
- `GET /api/payments/history` - Payment history

## UI/UX Requirements

### Design System
- Use shadcn/ui components exclusively
- Follow "new-york" style configuration
- Responsive design for mobile, tablet, and desktop
- Consistent with existing project styling

### Navigation Structure
- Top navigation bar with user info and notifications
- Sidebar navigation for main sections
- Breadcrumb navigation for deep pages
- Mobile-responsive hamburger menu

### Key Pages
1. **Dashboard** - Home with balance, categories, top professionals
2. **Services** - Browse and search services/professionals
3. **My Requests** - Manage service requests and offers
4. **Transactions** - Track active and completed services
5. **Profile** - Account management and settings

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## Technical Requirements

### Frontend Architecture
- Next.js App Router with React Server Components
- TypeScript for type safety
- Zod schemas for validation
- React Hook Form for form management
- TanStack Query for data fetching

### State Management
- React Context for global state
- Local state for component-specific data
- URL state for filters and pagination

### Performance
- Server-side rendering for initial page loads
- Client-side navigation for smooth UX
- Image optimization for media uploads
- Lazy loading for large lists

### Security
- JWT authentication on all protected routes
- Input validation and sanitization
- CSRF protection
- Rate limiting on API endpoints

## Integration Points

### Existing Systems
- Authentication system (JWT)
- User management
- Professional profiles
- Payment processing
- Notification system

### External Services
- Payment gateways (Venezuela-specific)
- File storage for media uploads
- Maps integration for location services
- Email/SMS notifications

## Success Criteria

### Functional Requirements
- Users can create and manage service requests
- Users can browse and search for services
- Users can manage offers and transactions
- Users can handle payments and withdrawals
- All features work on mobile and desktop

### Performance Requirements
- Page load times < 2 seconds
- API response times < 500ms
- 99.9% uptime for critical features
- Support for 1000+ concurrent users

### User Experience
- Intuitive navigation and workflows
- Consistent design language
- Accessible interface (WCAG 2.1 AA)
- Mobile-first responsive design

## Constraints

### Technical Constraints
- Must use existing database schema
- Must integrate with current authentication
- Must follow project coding standards
- Must use shadcn/ui components only

### Business Constraints
- Focus on Venezuelan market
- Support Bs currency
- Spanish language interface
- Local payment methods

### Timeline Constraints
- Phase 1: Core navigation and service browsing (2 weeks)
- Phase 2: Request management and offers (2 weeks)
- Phase 3: Transactions and payments (2 weeks)
- Phase 4: Polish and optimization (1 week)
