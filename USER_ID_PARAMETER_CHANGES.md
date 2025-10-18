# User ID Parameter Changes - API Endpoints

## Overview
This document describes the changes made to all API endpoints to use `userId` as a parameter instead of reading it from JWT authentication. This change was made to support testing scenarios where JWT authentication is disabled.

## Changes Made

### 1. Schema Updates
Updated all Zod schemas to include `userId` as a required field in request bodies:

#### User Schemas (`src/lib/schemas/user.ts`)
- `UpdateUserProfileRequestSchema`: Added `userId: z.string().min(1, 'userId is required')`

#### Professional Schemas (`src/lib/schemas/professional.ts`)
- `CreateProfessionalProfileRequestSchema`: Added `userId` and optional `role`
- `UpdateProfessionalProfileRequestSchema`: Added `userId`

#### Service Schemas (`src/lib/schemas/service.ts`)
- `CreateServicePostingRequestSchema`: Added `userId`
- `CreateServiceOfferRequestSchema`: Added `userId`

#### Review Schemas (`src/lib/schemas/review.ts`)
- `CreateReviewRequestSchema`: Added `userId`
- `UpdateReviewRequestSchema`: Added `userId`

#### Verification Schemas (`src/lib/schemas/verification.ts`)
- `IDVerificationRequestSchema`: Added `userId`

#### OTP Schemas (`src/lib/schemas/otp.ts`)
- `OTPVerifyRequestSchema`: Added `userId`

### 2. Endpoint Modifications

#### GET Endpoints (Query Parameters)
These endpoints now require `userId` as a query parameter:

- `GET /api/users/profile?userId={userId}`
- `GET /api/professionals/profile?userId={userId}`
- `GET /api/services/transactions/list?userId={userId}&role={role}`
- `GET /api/services/transactions/{id}?userId={userId}&role={role}`

**Example Usage:**
```bash
# Get user profile
GET /api/users/profile?userId=user123

# Get professional profile
GET /api/professionals/profile?userId=user123

# Get transactions
GET /api/services/transactions/list?userId=user123&role=CLIENT
```

#### POST/PUT/DELETE Endpoints (Request Body)
These endpoints now require `userId` in the request body:

**User Management:**
- `PUT /api/users/profile/update`
- `POST /api/user/verify-id`
- `POST /api/user/verify-otp`

**Professional Management:**
- `POST /api/professionals/profile/create`
- `PUT /api/professionals/profile/update`

**Service Management:**
- `POST /api/services/postings/create`
- `POST /api/services/offers/create`
- `POST /api/services/reviews/create`
- `PUT /api/services/reviews/{id}/update`

**Example Usage:**
```bash
# Update user profile
PUT /api/users/profile/update
{
  "userId": "user123",
  "name": "John Doe",
  "phone": "04123456789"
}

# Create professional profile
POST /api/professionals/profile/create
{
  "userId": "user123",
  "role": "PROFESSIONAL",
  "bio": "Experienced professional",
  "hourlyRate": 50
}

# Create service posting
POST /api/services/postings/create
{
  "userId": "user123",
  "title": "Need a plumber",
  "description": "Fix leaky faucet",
  "category": "plumbing",
  "budget": 100
}
```

### 3. Code Changes Summary

#### Before (JWT-based)
```typescript
// Authentication required
const auth = requireAuth(request);
if (!auth.success) {
  return auth.response;
}
const { userId, role } = auth.user;

// Use userId from JWT
const user = await getUserById(userId);
```

#### After (Parameter-based)
```typescript
// GET endpoints - Query parameters
const userId = request.nextUrl.searchParams.get('userId');
if (!userId) {
  return NextResponse.json(
    createErrorResponse(COMMON_ERROR_CODES.VALIDATION_ERROR, 'userId query parameter is required'),
    { status: 400 }
  );
}

// POST/PUT/DELETE endpoints - Request body
const validation = await validateRequest(request, RequestSchema);
if (!validation.success) {
  return NextResponse.json(validation.error, { status: 400 });
}
const { userId, ...otherData } = validation.data;

// Use userId from parameter
const user = await getUserById(userId);
```

### 4. Validation Changes

All request schemas now include `userId` validation:
```typescript
export const CreateRequestSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  // ... other fields
});
```

### 5. Error Handling

Added proper validation for missing `userId`:
- **GET endpoints**: Return 400 error if `userId` query parameter is missing
- **POST/PUT/DELETE endpoints**: Return 400 error if `userId` is not in request body or is invalid

### 6. Files Modified

#### Schema Files
- `src/lib/schemas/user.ts`
- `src/lib/schemas/professional.ts`
- `src/lib/schemas/service.ts`
- `src/lib/schemas/review.ts`
- `src/lib/schemas/verification.ts`
- `src/lib/schemas/otp.ts`

#### Endpoint Files
- `src/app/api/users/profile/route.ts` (GET)
- `src/app/api/users/profile/update/route.ts` (PUT)
- `src/app/api/professionals/profile/route.ts` (GET)
- `src/app/api/professionals/profile/create/route.ts` (POST)
- `src/app/api/professionals/profile/update/route.ts` (PUT)
- `src/app/api/services/transactions/list/route.ts` (GET)
- `src/app/api/services/transactions/[id]/route.ts` (GET)
- `src/app/api/services/postings/create/route.ts` (POST)
- `src/app/api/services/offers/create/route.ts` (POST)
- `src/app/api/services/reviews/create/route.ts` (POST)
- `src/app/api/services/reviews/[id]/update/route.ts` (PUT)
- `src/app/api/user/verify-id/route.ts` (POST)
- `src/app/api/user/verify-otp/route.ts` (POST)

### 7. Testing Examples

#### Test User Profile Update
```bash
curl -X PUT http://localhost:3000/api/users/profile/update \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "name": "John Doe",
    "phone": "04123456789"
  }'
```

#### Test Get Professional Profile
```bash
curl "http://localhost:3000/api/professionals/profile?userId=user123"
```

#### Test Create Service Posting
```bash
curl -X POST http://localhost:3000/api/services/postings/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Need a plumber",
    "description": "Fix leaky faucet in kitchen",
    "category": "plumbing",
    "budget": 150
  }'
```

### 8. Backward Compatibility

These changes are **NOT backward compatible** with the previous JWT-based authentication system. To revert:

1. Remove `userId` from all request schemas
2. Restore JWT authentication logic in all endpoints
3. Update client code to send JWT tokens instead of `userId` parameters

### 9. Security Considerations

⚠️ **IMPORTANT**: This configuration should ONLY be used for testing purposes. The current setup:

- **Removes authentication requirements** - Any client can access any user's data by providing their `userId`
- **No authorization checks** - No verification that the client has permission to access the specified user's data
- **Potential data exposure** - Sensitive user information could be accessed by unauthorized clients

### 10. Migration Notes

When implementing this in production:

1. **Add proper authorization** - Verify that the client has permission to access the specified `userId`
2. **Implement rate limiting** - Prevent abuse of the parameter-based system
3. **Add audit logging** - Track all requests with `userId` parameters
4. **Consider hybrid approach** - Use JWT for authentication and `userId` parameter for specific operations

## Date Created
2025-01-17

## Status
Active - All endpoints modified to use userId parameters
