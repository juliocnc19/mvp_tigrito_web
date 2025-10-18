# Requirements for API Endpoints System

## Project Context
**Project**: Tigrito MVP - Marketplace for Professional Services  
**Date**: 2025-01-17  
**Type**: Complete API endpoints system using Next.js API Routes with Zod validation and auto-generated documentation

## Core Requirements

### 1. API Architecture
- **Framework**: Next.js API Routes (App Router)
- **Validation**: Zod schemas for all endpoints
- **Documentation**: Auto-generated using next-openapi-gen
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Bearer tokens

### 2. Database Models (from Prisma Schema)
- **User**: CLIENT, PROFESSIONAL, ADMIN roles
- **ProfessionalProfile**: Professional user profiles
- **Profession**: Available service categories
- **ServicePosting**: Client service requests
- **Offer**: Professional offers on postings
- **ProfessionalService**: Proactive professional services
- **ServiceTransaction**: Service agreements and execution
- **Payment**: Payment processing
- **Review**: Service reviews and ratings
- **Media**: File uploads (images, videos, documents)
- **Conversation/Message**: Real-time chat system
- **PromoCode**: Promotional codes
- **Report**: User and service reports
- **AdCampaign**: Advertising campaigns
- **UserPaymentMethod**: Payment methods
- **Withdrawal**: Professional earnings withdrawal
- **Notification**: Push notifications
- **AuditLog**: System audit trail

### 3. Endpoint Categories

#### Authentication (7 endpoints)
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/refresh - Token refresh
- POST /auth/logout - User logout
- POST /auth/verify-email - Email verification
- POST /auth/forgot-password - Password reset request
- POST /auth/reset-password - Password reset

#### User Management (6 endpoints)
- GET /users/profile - Get current user profile
- PUT /users/profile - Update user profile
- GET /users - List users with filters
- GET /users/:id - Get user by ID
- PUT /users/:id/verify - Verify user (Admin)
- PUT /users/:id/suspend - Suspend user (Admin)

#### Professional Management (5 endpoints)
- GET /professionals/profile - Get professional profile
- POST /professionals/profile - Create professional profile
- PUT /professionals/profile - Update professional profile
- GET /professionals - List professionals with filters
- GET /professionals/:id - Get professional by ID

#### Service Management (20+ endpoints)
- **Professions**: CRUD operations
- **Service Postings**: CRUD + status management
- **Offers**: CRUD + acceptance/rejection
- **Professional Services**: CRUD + toggle active
- **Service Transactions**: CRUD + status updates

#### Payment System (5 endpoints)
- Payment processing and management
- Refund capabilities
- Payment method management

#### Review System (4 endpoints)
- Create, read, update, delete reviews
- Rating system (1-5 stars)

#### Media Management (4 endpoints)
- File upload (images, videos, documents)
- Media CRUD operations
- File type and size validation

#### Communication (4 endpoints)
- Real-time chat system
- Message management
- Conversation management

#### Promotional System (5 endpoints)
- Promo code CRUD
- Code validation
- Usage tracking

#### Reporting System (4 endpoints)
- User and service reports
- Admin report management
- Status updates

#### Admin Dashboard (6 endpoints)
- Overview metrics
- User analytics
- Transaction analytics
- Revenue tracking
- Profession popularity
- Location-based insights

#### Additional Features (10+ endpoints)
- Ad campaign management
- Payment method management
- Withdrawal system
- Notification system
- Audit logging

### 4. Technical Requirements

#### Authentication & Authorization
- JWT token generation and validation
- Role-based access control (CLIENT, PROFESSIONAL, ADMIN)
- Password hashing and verification
- Email verification system
- Password reset functionality

#### Data Validation
- Zod schemas for all request/response validation
- Input sanitization and validation
- Type safety with TypeScript
- Error handling with standardized responses

#### File Upload System
- Support for images, videos, and documents
- File size and type validation
- Secure file storage
- Media metadata tracking

#### Search & Filtering
- Full-text search across relevant fields
- Location-based filtering with radius
- Date range filtering
- Status-based filtering
- Pagination for all list endpoints

#### Dashboard Metrics
- User statistics and analytics
- Transaction analytics
- Revenue tracking and reporting
- Profession popularity metrics
- Location-based insights

#### Real-time Features
- WebSocket support for chat
- Push notifications
- Real-time updates for transactions

#### Security Features
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting
- Comprehensive audit logging

### 5. Documentation Requirements
- Auto-generated OpenAPI documentation
- Interactive API explorer
- Schema validation documentation
- TypeScript type generation
- Authentication documentation
- Error handling documentation
- Pagination documentation
- Search and filtering documentation

### 6. Performance Requirements
- Query optimization
- Database indexing
- Connection pooling
- Caching strategies
- Response time monitoring

### 7. Error Handling
- Standardized error codes (400, 401, 403, 404, 409, 422, 500)
- Consistent error response format
- Detailed error messages
- Validation error details

### 8. Testing Requirements
- Unit tests for all functions
- Integration tests for API endpoints
- End-to-end tests for user journeys
- Authentication flow testing
- File upload testing
- Error scenario testing

## Success Criteria
1. All 200+ endpoints implemented and functional
2. Complete Zod validation for all requests/responses
3. Auto-generated API documentation accessible
4. JWT authentication working across all protected endpoints
5. File upload system functional for all media types
6. Search and filtering working on all list endpoints
7. Admin dashboard metrics providing accurate data
8. Real-time chat system functional
9. All CRUD operations working for all models
10. Comprehensive error handling and logging
