# API Endpoints System Specification

## Overview

**Project**: Tigrito MVP - Marketplace for Professional Services  
**Feature**: Complete API endpoints system using Next.js API Routes  
**Date**: 2025-01-17  
**Version**: 1.0.0

## Executive Summary

This specification defines a comprehensive API endpoints system for the Tigrito MVP marketplace platform. The system provides 200+ RESTful endpoints covering all aspects of the platform including user management, service transactions, payments, reviews, real-time communication, and administrative functions. All endpoints are built using Next.js API Routes with Zod validation and auto-generated OpenAPI documentation.

## Business Context

Tigrito is a marketplace platform connecting clients with professional service providers. The API system must support:

- **Client Management**: Registration, authentication, profile management
- **Professional Management**: Professional profiles, service offerings, verification
- **Service Transactions**: Posting requests, offers, agreements, execution
- **Payment Processing**: Secure payments, escrow, withdrawals
- **Communication**: Real-time chat between clients and professionals
- **Reviews & Ratings**: Service feedback and reputation system
- **Administration**: Platform management, analytics, reporting

## Technical Architecture

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **API Routes**: Next.js API Routes
- **Validation**: Zod schemas
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Bearer tokens
- **Documentation**: next-openapi-gen
- **File Storage**: Local/Cloud storage for media
- **Real-time**: WebSocket for chat

### Database Schema
The system is built on a comprehensive Prisma schema with 20+ models:

#### Core Models
- **User**: Multi-role users (CLIENT, PROFESSIONAL, ADMIN)
- **ProfessionalProfile**: Professional user profiles
- **Profession**: Service categories and specializations
- **ServicePosting**: Client service requests
- **Offer**: Professional offers on postings
- **ProfessionalService**: Proactive professional services
- **ServiceTransaction**: Service agreements and execution

#### Supporting Models
- **Payment**: Payment processing and tracking
- **Review**: Service reviews and ratings
- **Media**: File uploads and media management
- **Conversation/Message**: Real-time chat system
- **PromoCode**: Promotional codes and discounts
- **Report**: User and service reports
- **AdCampaign**: Advertising and marketing
- **UserPaymentMethod**: Payment method management
- **Withdrawal**: Professional earnings withdrawal
- **Notification**: Push notifications
- **AuditLog**: System audit trail

## API Design Principles

### RESTful Design
- Consistent HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- Proper HTTP status codes
- Stateless operations

### Authentication & Authorization
- JWT Bearer token authentication
- Role-based access control
- Secure password handling
- Email verification system

### Data Validation
- Zod schema validation for all requests/responses
- Type safety with TypeScript
- Input sanitization
- Comprehensive error handling

### Performance
- Pagination for all list endpoints
- Efficient database queries
- Proper indexing
- Response caching where appropriate

## Endpoint Categories

### 1. Authentication System (7 endpoints)

#### POST /auth/register
**Purpose**: Register new users  
**Roles**: Public  
**Body**: email/phone, password, name, role  
**Response**: User object + JWT token

#### POST /auth/login
**Purpose**: User authentication  
**Roles**: Public  
**Body**: email/phone, password  
**Response**: User object + JWT token

#### POST /auth/refresh
**Purpose**: Refresh JWT token  
**Roles**: Authenticated  
**Response**: New JWT token

#### POST /auth/logout
**Purpose**: User logout  
**Roles**: Authenticated  
**Response**: Success message

#### POST /auth/verify-email
**Purpose**: Email verification  
**Roles**: Public  
**Body**: verification token  
**Response**: Success message

#### POST /auth/forgot-password
**Purpose**: Password reset request  
**Roles**: Public  
**Body**: email  
**Response**: Success message

#### POST /auth/reset-password
**Purpose**: Password reset with token  
**Roles**: Public  
**Body**: token, newPassword  
**Response**: Success message

### 2. User Management (6 endpoints)

#### GET /users/profile
**Purpose**: Get current user profile  
**Roles**: Authenticated  
**Response**: Complete user object with relations

#### PUT /users/profile
**Purpose**: Update user profile  
**Roles**: Authenticated  
**Body**: Partial user data  
**Response**: Updated user object

#### GET /users
**Purpose**: List users with filters  
**Roles**: Admin  
**Query**: page, limit, role, search, location, verified  
**Response**: Paginated user list

#### GET /users/:id
**Purpose**: Get user by ID  
**Roles**: Authenticated  
**Response**: User object with relations

#### PUT /users/:id/verify
**Purpose**: Verify user account  
**Roles**: Admin  
**Body**: verification flags  
**Response**: Updated user object

#### PUT /users/:id/suspend
**Purpose**: Suspend/unsuspend user  
**Roles**: Admin  
**Body**: suspension status, reason  
**Response**: Updated user object

### 3. Professional Management (5 endpoints)

#### GET /professionals/profile
**Purpose**: Get professional profile  
**Roles**: Professional  
**Response**: Professional profile with relations

#### POST /professionals/profile
**Purpose**: Create professional profile  
**Roles**: Professional  
**Body**: bio, portfolio, professions  
**Response**: Created profile

#### PUT /professionals/profile
**Purpose**: Update professional profile  
**Roles**: Professional  
**Body**: Partial profile data  
**Response**: Updated profile

#### GET /professionals
**Purpose**: List professionals with filters  
**Roles**: Public  
**Query**: page, limit, profession, rating, location, verified  
**Response**: Paginated professional list

#### GET /professionals/:id
**Purpose**: Get professional by ID  
**Roles**: Public  
**Response**: Professional profile with relations

### 4. Service Management (20+ endpoints)

#### Professions (5 endpoints)
- GET /professions - List all professions
- GET /professions/:id - Get profession by ID
- POST /professions - Create profession (Admin)
- PUT /professions/:id - Update profession (Admin)
- DELETE /professions/:id - Delete profession (Admin)

#### Service Postings (6 endpoints)
- GET /postings - List postings with filters
- GET /postings/:id - Get posting by ID
- POST /postings - Create posting (Client)
- PUT /postings/:id - Update posting (Owner)
- DELETE /postings/:id - Delete posting (Owner)
- PUT /postings/:id/status - Update posting status

#### Offers (4 endpoints)
- GET /offers - List offers with filters
- GET /offers/:id - Get offer by ID
- POST /offers - Create offer (Professional)
- PUT /offers/:id/status - Accept/reject offer

#### Professional Services (6 endpoints)
- GET /professional-services - List services with filters
- GET /professional-services/:id - Get service by ID
- POST /professional-services - Create service (Professional)
- PUT /professional-services/:id - Update service (Owner)
- DELETE /professional-services/:id - Delete service (Owner)
- PUT /professional-services/:id/toggle - Toggle active status

#### Service Transactions (5 endpoints)
- GET /transactions - List transactions with filters
- GET /transactions/:id - Get transaction by ID
- POST /transactions - Create transaction from offer
- PUT /transactions/:id/status - Update transaction status
- POST /transactions/:id/complete - Mark as completed

### 5. Payment System (5 endpoints)

#### GET /payments
**Purpose**: List payments with filters  
**Roles**: Authenticated  
**Query**: page, limit, status, method  
**Response**: Paginated payment list

#### GET /payments/:id
**Purpose**: Get payment by ID  
**Roles**: Authenticated  
**Response**: Payment object

#### POST /payments
**Purpose**: Create payment  
**Roles**: Authenticated  
**Body**: transactionId, amount, method, details  
**Response**: Created payment

#### POST /payments/:id/process
**Purpose**: Process payment  
**Roles**: Authenticated  
**Body**: payment details  
**Response**: Processing result

#### POST /payments/:id/refund
**Purpose**: Refund payment  
**Roles**: Admin  
**Body**: reason, amount  
**Response**: Refund result

### 6. Review System (4 endpoints)

#### GET /reviews
**Purpose**: List reviews with filters  
**Roles**: Public  
**Query**: page, limit, reviewer, reviewed, transaction  
**Response**: Paginated review list

#### GET /reviews/:id
**Purpose**: Get review by ID  
**Roles**: Public  
**Response**: Review object

#### POST /reviews
**Purpose**: Create review  
**Roles**: Authenticated  
**Body**: transactionId, reviewedId, rating, comment  
**Response**: Created review

#### PUT /reviews/:id
**Purpose**: Update review  
**Roles**: Reviewer  
**Body**: rating, comment  
**Response**: Updated review

### 7. Media Management (4 endpoints)

#### POST /media/upload
**Purpose**: Upload media files  
**Roles**: Authenticated  
**Body**: FormData with files  
**Response**: Array of media objects

#### GET /media
**Purpose**: List media with filters  
**Roles**: Authenticated  
**Query**: page, limit, type, uploadedBy  
**Response**: Paginated media list

#### GET /media/:id
**Purpose**: Get media by ID  
**Roles**: Authenticated  
**Response**: Media object

#### DELETE /media/:id
**Purpose**: Delete media  
**Roles**: Owner  
**Response**: Success message

### 8. Communication System (4 endpoints)

#### GET /conversations
**Purpose**: List user conversations  
**Roles**: Authenticated  
**Query**: page, limit  
**Response**: Paginated conversation list

#### POST /conversations
**Purpose**: Create conversation  
**Roles**: Authenticated  
**Body**: participantIds  
**Response**: Created conversation

#### GET /conversations/:id/messages
**Purpose**: Get conversation messages  
**Roles**: Participant  
**Query**: page, limit, before  
**Response**: Paginated message list

#### POST /conversations/:id/messages
**Purpose**: Send message  
**Roles**: Participant  
**Body**: text, mediaIds  
**Response**: Created message

### 9. Promotional System (5 endpoints)

#### GET /promo-codes
**Purpose**: List promo codes  
**Roles**: Admin  
**Query**: page, limit, code, active  
**Response**: Paginated promo code list

#### GET /promo-codes/:id
**Purpose**: Get promo code by ID  
**Roles**: Admin  
**Response**: Promo code object

#### POST /promo-codes
**Purpose**: Create promo code  
**Roles**: Admin  
**Body**: code, discountType, value, limits  
**Response**: Created promo code

#### POST /promo-codes/validate
**Purpose**: Validate promo code  
**Roles**: Public  
**Body**: code, userId, transactionId  
**Response**: Validation result

#### POST /promo-codes/:id/use
**Purpose**: Use promo code  
**Roles**: Authenticated  
**Body**: transactionId  
**Response**: Usage result

### 10. Reporting System (4 endpoints)

#### GET /reports
**Purpose**: List reports with filters  
**Roles**: Admin  
**Query**: page, limit, reporter, reported, status  
**Response**: Paginated report list

#### GET /reports/:id
**Purpose**: Get report by ID  
**Roles**: Admin  
**Response**: Report object

#### POST /reports
**Purpose**: Create report  
**Roles**: Authenticated  
**Body**: reportedId, serviceId, reason, proof  
**Response**: Created report

#### PUT /reports/:id/status
**Purpose**: Update report status  
**Roles**: Admin  
**Body**: status, adminNotes  
**Response**: Updated report

### 11. Admin Dashboard (6 endpoints)

#### GET /admin/metrics/overview
**Purpose**: Get platform overview metrics  
**Roles**: Admin  
**Response**: Total users, professionals, transactions, revenue

#### GET /admin/metrics/users
**Purpose**: Get user analytics  
**Roles**: Admin  
**Query**: period, dateFrom, dateTo  
**Response**: User growth and activity metrics

#### GET /admin/metrics/transactions
**Purpose**: Get transaction analytics  
**Roles**: Admin  
**Query**: period, status, dateFrom, dateTo  
**Response**: Transaction volume and value metrics

#### GET /admin/metrics/revenue
**Purpose**: Get revenue analytics  
**Roles**: Admin  
**Query**: period, groupBy, dateFrom, dateTo  
**Response**: Revenue trends and breakdowns

#### GET /admin/metrics/professions
**Purpose**: Get profession popularity  
**Roles**: Admin  
**Response**: Profession usage statistics

#### GET /admin/metrics/locations
**Purpose**: Get location-based metrics  
**Roles**: Admin  
**Query**: period, dateFrom, dateTo  
**Response**: Geographic distribution data

### 12. Additional Features (15+ endpoints)

#### Ad Campaign Management (4 endpoints)
- CRUD operations for advertising campaigns
- Campaign performance tracking
- Target audience management

#### Payment Method Management (4 endpoints)
- User payment method CRUD
- Payment method verification
- Default payment method setting

#### Withdrawal System (4 endpoints)
- Withdrawal request management
- Admin approval workflow
- Payment method integration

#### Notification System (4 endpoints)
- Notification CRUD
- Mark as read functionality
- Admin notification sending

#### Audit Logging (2 endpoints)
- Audit log retrieval
- Audit log creation

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  isVerified: boolean;
  isIDVerified: boolean;
  balance: number;
  isSuspended: boolean;
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Posting Model
```typescript
interface ServicePosting {
  id: string;
  clientId: string;
  title: string;
  description: string;
  categoryId: string;
  lat?: number;
  lng?: number;
  address?: string;
  requiredFrom?: Date;
  requiredTo?: Date;
  priceMin?: number;
  priceMax?: number;
  status: 'OPEN' | 'CLOSED' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Transaction Model
```typescript
interface ServiceTransaction {
  id: string;
  clientId: string;
  professionalId: string;
  priceAgreed: number;
  discountAmount: number;
  platformFee: number;
  escrowAmount: number;
  currentStatus: 'PENDING_SOLICITUD' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication & Authorization

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
  email?: string;
  phone?: string;
  iat: number;
  exp: number;
}
```

### Role-Based Access Control
- **CLIENT**: Can create postings, make payments, leave reviews
- **PROFESSIONAL**: Can create offers, manage services, receive payments
- **ADMIN**: Full system access, user management, analytics

### Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. JWT token generated with user info
4. Token sent to client
5. Client includes token in Authorization header
6. Server validates token on each request

## Validation & Error Handling

### Zod Schema Validation
All requests and responses are validated using Zod schemas:

```typescript
// Example: User registration validation
const RegisterSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['CLIENT', 'PROFESSIONAL']).default('CLIENT')
}).refine(data => data.email || data.phone, {
  message: "Either email or phone must be provided"
});
```

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Standard Error Codes
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **422**: Validation Error - Input validation failed
- **500**: Internal Server Error - Server error

## File Upload System

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP
- **Videos**: MP4, MOV, AVI
- **Documents**: PDF, DOC, DOCX, TXT

### File Size Limits
- **Images**: 10MB max
- **Videos**: 100MB max
- **Documents**: 25MB max

### Upload Process
1. Client sends multipart/form-data request
2. Server validates file type and size
3. File stored securely
4. Media record created in database
5. File URL returned to client

## Search & Filtering

### Search Capabilities
- Full-text search across relevant fields
- Location-based search with radius
- Date range filtering
- Status-based filtering
- Category filtering

### Pagination
All list endpoints support pagination:
```typescript
interface PaginationParams {
  page: number;      // Page number (1-based)
  limit: number;     // Items per page (1-100)
  total: number;     // Total items
  totalPages: number; // Total pages
}
```

## Real-time Features

### WebSocket Chat
- Real-time messaging between users
- Message delivery confirmation
- Typing indicators
- Online status

### Push Notifications
- Service request notifications
- Payment confirmations
- Review reminders
- System announcements

## Performance Requirements

### Response Times
- **Simple queries**: < 200ms
- **Complex queries**: < 500ms
- **File uploads**: < 2s per file
- **Real-time messages**: < 100ms

### Throughput
- **Concurrent users**: 1000+
- **Requests per second**: 500+
- **File uploads**: 50+ per minute

### Database Performance
- Proper indexing on frequently queried fields
- Query optimization
- Connection pooling
- Caching for read-heavy operations

## Security Considerations

### Input Validation
- All inputs validated with Zod schemas
- SQL injection prevention
- XSS protection
- File upload security

### Authentication Security
- JWT token expiration
- Secure password hashing (bcrypt)
- Rate limiting on auth endpoints
- Account lockout after failed attempts

### Data Protection
- Sensitive data encryption
- Secure file storage
- Audit logging
- GDPR compliance considerations

## Testing Strategy

### Unit Tests
- Individual function testing
- Schema validation testing
- Database query testing

### Integration Tests
- API endpoint testing
- Authentication flow testing
- File upload testing
- Database integration testing

### End-to-End Tests
- Complete user journey testing
- Admin workflow testing
- Error scenario testing
- Performance testing

## Deployment & Monitoring

### Environment Configuration
- Development environment
- Staging environment
- Production environment

### Monitoring
- API response time monitoring
- Error rate tracking
- Database performance monitoring
- User activity analytics

### Logging
- Request/response logging
- Error logging
- Audit trail logging
- Performance metrics logging

## Success Metrics

### Functional Metrics
- All 200+ endpoints implemented and functional
- 100% Zod validation coverage
- Complete API documentation generated
- JWT authentication working across all protected endpoints

### Performance Metrics
- API response times within requirements
- File upload success rate > 99%
- Search functionality working on all list endpoints
- Real-time chat latency < 100ms

### Quality Metrics
- Test coverage > 90%
- Error handling for all scenarios
- Security vulnerabilities addressed
- Documentation completeness

## Future Enhancements

### Phase 2 Features
- Advanced analytics dashboard
- Machine learning recommendations
- Mobile app API optimization
- Third-party integrations

### Scalability Improvements
- Microservices architecture
- Database sharding
- CDN integration
- Advanced caching strategies

## Conclusion

This specification provides a comprehensive foundation for building the Tigrito MVP API system. The 200+ endpoints cover all aspects of the marketplace platform, from user management to real-time communication. The use of modern technologies like Next.js API Routes, Zod validation, and auto-generated documentation ensures maintainability and developer experience.

The system is designed to be scalable, secure, and performant, with proper error handling, authentication, and monitoring. The comprehensive testing strategy and deployment considerations ensure reliable operation in production.

Implementation of this specification will provide a solid foundation for the Tigrito marketplace platform, enabling efficient development and maintenance of the API system.
