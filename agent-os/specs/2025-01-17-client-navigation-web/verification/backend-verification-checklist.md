# Backend Verification Checklist

## Overview
This checklist guides the backend-verifier through verification of all API endpoints and backend implementations for the Client Navigation Web Feature.

## API.1: Service Postings Endpoints Verification

### GET /api/services/postings/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Optional (public with auth header support)
- [ ] **Response format**: Valid ServicePosting with relations
- [ ] **Includes relations**: client, offers, media, category
- [ ] **Error handling**: 404 when not found
- [ ] **Response code**: 200 OK
- [ ] **Performance**: < 500ms response time

### PUT /api/services/postings/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Authorization**: Only posting owner can update
- [ ] **Request validation**: UpdateServicePostingRequestSchema
- [ ] **Updates fields**: title, description, category, location, prices
- [ ] **Status validation**: Cannot change expired/completed postings
- [ ] **Response code**: 200 OK
- [ ] **Error handling**: 401 unauthorized, 403 forbidden, 404 not found

### DELETE /api/services/postings/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Authorization**: Only posting owner can delete
- [ ] **Soft delete**: Sets deletedAt timestamp
- [ ] **Validation**: No active transactions
- [ ] **Response code**: 204 No Content
- [ ] **Error handling**: Cannot delete with active transactions

### GET /api/services/postings/my
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Filters by clientId**: User's own postings only
- [ ] **Supports pagination**: page, limit parameters
- [ ] **Supports filtering**: status, search, sortBy
- [ ] **Includes offer counts**: Each posting shows offer count
- [ ] **Response format**: Paginated list
- [ ] **Response code**: 200 OK

## API.2: Offers Management Endpoints Verification

### GET /api/services/offers
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Query parameters**: page, limit, postingId, professionalId, status
- [ ] **Filtering**: Works correctly on all parameters
- [ ] **Response includes**: Professional name, rating, etc.
- [ ] **Pagination**: Correct offset/limit
- [ ] **Response code**: 200 OK
- [ ] **Performance**: < 500ms

### GET /api/services/offers/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Authorization**: Only involved parties can view
- [ ] **Includes**: Professional info, posting info
- [ ] **Error handling**: 404 not found, 403 forbidden
- [ ] **Response code**: 200 OK

### PUT /api/services/offers/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Authorization**: Only posting owner can accept/reject
- [ ] **Request validation**: status field required (ACCEPTED/REJECTED)
- [ ] **On accept**: Creates ServiceTransaction
- [ ] **On reject**: Updates status to REJECTED
- [ ] **Notifications**: Professional notified of decision
- [ ] **Response code**: 200 OK
- [ ] **Error handling**: Proper error codes

## API.3: Service Transactions Endpoints Verification

### GET /api/services/transactions
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Returns**: Transactions where user is client OR professional
- [ ] **Query parameters**: page, limit, status, role, dateFrom, dateTo
- [ ] **Filtering**: Works on all parameters
- [ ] **Includes**: Related service and professional info
- [ ] **Response code**: 200 OK
- [ ] **Performance**: < 500ms

### GET /api/services/transactions/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Authorization**: Only involved parties can view
- [ ] **Full relations**: Posting, professional, reviews, payments
- [ ] **Timeline**: Includes status history
- [ ] **Error handling**: 404 not found, 403 forbidden
- [ ] **Response code**: 200 OK

### PUT /api/services/transactions/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Authorization**: Only involved parties can update
- [ ] **Request validation**: status field required
- [ ] **Status transitions**: Valid state changes only
- [ ] **Status-specific logic**: Different handling for IN_PROGRESS, COMPLETED, CANCELED
- [ ] **Payment updates**: Reflects in payment status
- [ ] **Response code**: 200 OK

## API.4: Categories & Search Endpoints Verification

### GET /api/professions
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Optional
- [ ] **Returns**: All active professions
- [ ] **Pagination**: page, limit supported
- [ ] **Search**: search parameter filters professions
- [ ] **Includes counts**: Postings/services count
- [ ] **Response code**: 200 OK
- [ ] **Caching**: Response cached for performance

### GET /api/professions/[id]
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Optional
- [ ] **Returns**: Single profession with stats
- [ ] **Includes**: Related postings count, services count, avg ratings
- [ ] **Error handling**: 404 not found
- [ ] **Response code**: 200 OK
- [ ] **Caching**: Response cached

### GET /api/services/search
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Optional
- [ ] **Query parameters**: q, type, category, location, priceMin, priceMax, rating, page, limit
- [ ] **Full-text search**: Works on title, description
- [ ] **Category filtering**: Works correctly
- [ ] **Location filtering**: Geospatial queries work
- [ ] **Price filtering**: Min/max working
- [ ] **Rating filtering**: Filters by rating
- [ ] **Response includes**: Mixed services and professionals
- [ ] **Response code**: 200 OK
- [ ] **Performance**: < 500ms on typical queries

### GET /api/professionals/top-rated
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Optional
- [ ] **Ordering**: By rating and review count
- [ ] **Query parameters**: limit, category, location
- [ ] **Category filtering**: Works correctly
- [ ] **Location filtering**: Works correctly
- [ ] **Includes**: Avatar, rating, review count, stats
- [ ] **Response code**: 200 OK
- [ ] **Caching**: Results cached

## API.5: User Balance & Payments Endpoints Verification

### GET /api/users/balance
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Returns**: Current balance and currency
- [ ] **Format**: Correct decimal places
- [ ] **Accuracy**: Matches database value
- [ ] **Response code**: 200 OK
- [ ] **Caching**: Minimal cache to reflect real-time balance

### POST /api/payments/recharge
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Request validation**: amount and method required
- [ ] **Amount validation**: Valid range, minimum check
- [ ] **Creates Payment**: Record in database
- [ ] **Returns**: transactionId, status, instructions
- [ ] **Method handling**: Different handling for each payment method
- [ ] **Bank transfers**: Returns account details for manual payment
- [ ] **Mobile payment**: Returns payment instructions
- [ ] **Response code**: 201 Created or 200 OK
- [ ] **Error handling**: Invalid amount, unsupported method errors

### GET /api/payments/history
- [ ] **Endpoint exists** at correct path
- [ ] **Authentication**: Required (JWT)
- [ ] **Returns**: User's payment and withdrawal history
- [ ] **Query parameters**: page, limit, type, status, dateFrom, dateTo
- [ ] **Filtering**: Works on all parameters
- [ ] **Sorting**: Chronological order
- [ ] **Includes**: Transaction details, amounts, dates, status
- [ ] **Response code**: 200 OK
- [ ] **Performance**: < 500ms even with large history

## General API Requirements Verification

### Authentication & Authorization
- [ ] **JWT validation**: All protected endpoints validate tokens
- [ ] **Token refresh**: Endpoints use valid token handling
- [ ] **Authorization checks**: Only appropriate users can access
- [ ] **Role-based access**: CLIENT vs PROFESSIONAL roles enforced

### Input Validation
- [ ] **Zod schemas**: All requests validated with schemas
- [ ] **Error responses**: 422 Unprocessable Entity for validation errors
- [ ] **Error messages**: Clear and helpful error messages
- [ ] **Type checking**: All inputs type-checked

### Response Format
- [ ] **Success responses**: Use createSuccessResponse utility
- [ ] **Error responses**: Use createErrorResponse utility
- [ ] **HTTP codes**: Correct status codes used
- [ ] **Response body**: Consistent format across endpoints

### Database Queries
- [ ] **Query optimization**: Use indexes, avoid N+1 queries
- [ ] **Transaction handling**: Proper use of database transactions
- [ ] **Error handling**: Database errors handled gracefully
- [ ] **Performance**: Queries execute in < 500ms

### Error Handling
- [ ] **404 errors**: Proper not found responses
- [ ] **401 errors**: Proper authentication required
- [ ] **403 errors**: Proper authorization denied
- [ ] **422 errors**: Proper validation errors
- [ ] **500 errors**: Server errors logged properly

### Documentation
- [ ] **OpenAPI/Swagger**: Endpoints documented
- [ ] **Request examples**: Example requests provided
- [ ] **Response examples**: Example responses provided
- [ ] **Error codes**: All error codes documented

### Testing
- [ ] **Unit tests**: Business logic tested
- [ ] **Integration tests**: Endpoints tested with database
- [ ] **Authentication tests**: Auth endpoints tested
- [ ] **Error handling tests**: Error cases tested
- [ ] **Test coverage**: >= 90% code coverage

## Integration Tests Verification

### Cross-Endpoint Integration
- [ ] **Service flow**: Create posting → Get postings → Detail → Offers flow works
- [ ] **Offer flow**: Create offer → List offers → Accept offer → Transaction created
- [ ] **Payment flow**: Get balance → Recharge → History updates
- [ ] **Search flow**: Search → Filter → Detail page works

### Database Integration
- [ ] **Foreign keys**: All relations intact
- [ ] **Cascading**: Deletes cascade properly
- [ ] **Data consistency**: No orphaned records
- [ ] **Transactions**: Multi-step operations atomic

## Performance Verification

### Response Times
- [ ] **Simple endpoints**: < 200ms (GET single item)
- [ ] **List endpoints**: < 500ms (GET paginated list)
- [ ] **Create endpoints**: < 500ms (POST new item)
- [ ] **Update endpoints**: < 500ms (PUT modify item)
- [ ] **Delete endpoints**: < 500ms (DELETE item)

### Database Performance
- [ ] **Indexes**: All queries use indexes
- [ ] **Query plans**: Checked for efficiency
- [ ] **Connection pooling**: Configured properly
- [ ] **Slow queries**: None detected

### Load Testing
- [ ] **Concurrent users**: Handles 1000+ concurrent
- [ ] **Peak load**: No degradation at peak
- [ ] **Memory usage**: Reasonable memory footprint
- [ ] **CPU usage**: Efficient CPU utilization

## Security Verification

### Authentication
- [ ] **Token validation**: All tokens validated
- [ ] **Token expiry**: Expired tokens rejected
- [ ] **Token refresh**: Refresh tokens work
- [ ] **HTTPS only**: All endpoints HTTPS

### Input Security
- [ ] **SQL injection**: No vulnerable queries
- [ ] **XSS prevention**: Input sanitized
- [ ] **CSRF protection**: CSRF tokens used
- [ ] **Rate limiting**: Endpoints rate-limited

### Data Protection
- [ ] **Sensitive data**: Not logged
- [ ] **PII**: Protected appropriately
- [ ] **Encryption**: Sensitive data encrypted
- [ ] **GDPR**: Compliance maintained

## Sign-Off

**Backend Verifier**: _______________  
**Date**: _______________  
**Status**: ⏳ Pending Implementation

---

**This checklist will be completed during implementation verification phase.**
