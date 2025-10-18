# API Endpoints Specification

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

## Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 24 hours (configurable)

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": any
  }
}
```

---

## 1. AUTHENTICATION ENDPOINTS

### POST /auth/register
**Description**: Register new user
**Body**:
```json
{
  "email": string,
  "phone": string,
  "password": string,
  "name": string,
  "role": "CLIENT" | "PROFESSIONAL"
}
```
**Response**: User object + JWT token

### POST /auth/login
**Description**: Login user
**Body**:
```json
{
  "email": string,
  "password": string
}
```
**Response**: User object + JWT token

### POST /auth/refresh
**Description**: Refresh JWT token
**Headers**: Authorization required
**Response**: New JWT token

### POST /auth/logout
**Description**: Logout user (invalidate token)
**Headers**: Authorization required

### POST /auth/verify-email
**Description**: Verify email address
**Body**:
```json
{
  "token": string
}
```

### POST /auth/forgot-password
**Description**: Request password reset
**Body**:
```json
{
  "email": string
}
```

### POST /auth/reset-password
**Description**: Reset password with token
**Body**:
```json
{
  "token": string,
  "newPassword": string
}
```

---

## 2. USER ENDPOINTS

### GET /users/profile
**Description**: Get current user profile
**Headers**: Authorization required
**Response**: User object with relations

### PUT /users/profile
**Description**: Update user profile
**Headers**: Authorization required
**Body**: Partial User object

### GET /users
**Description**: Get users with filters and pagination
**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `role`: "CLIENT" | "PROFESSIONAL" | "ADMIN"
- `isVerified`: boolean
- `search`: string (name, email, phone)
- `locationLat`: number
- `locationLng`: number
- `radius`: number (km)

### GET /users/:id
**Description**: Get user by ID
**Response**: User object with relations

### PUT /users/:id/verify
**Description**: Verify user (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "isVerified": boolean,
  "isIDVerified": boolean
}
```

### PUT /users/:id/suspend
**Description**: Suspend/unsuspend user (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "isSuspended": boolean,
  "reason": string
}
```

---

## 3. PROFESSIONAL PROFILE ENDPOINTS

### GET /professionals/profile
**Description**: Get current professional profile
**Headers**: Authorization required (Professional)

### POST /professionals/profile
**Description**: Create professional profile
**Headers**: Authorization required (Professional)
**Body**:
```json
{
  "bio": string,
  "portfolio": object,
  "professions": string[] // Profession IDs
}
```

### PUT /professionals/profile
**Description**: Update professional profile
**Headers**: Authorization required (Professional)
**Body**: Partial ProfessionalProfile object

### GET /professionals
**Description**: Get professionals with filters
**Query Parameters**:
- `page`, `limit`, `search`
- `professionId`: string
- `ratingMin`: number
- `locationLat`, `locationLng`, `radius`
- `isVerified`: boolean

### GET /professionals/:id
**Description**: Get professional by ID
**Response**: ProfessionalProfile with User and Professions

### POST /professionals/:id/verify
**Description**: Verify professional (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "professionId`: string,
  "verified`: boolean,
  "documents`: object
}
```

---

## 4. PROFESSION ENDPOINTS

### GET /professions
**Description**: Get all professions
**Query Parameters**:
- `search`: string
- `page`, `limit`

### GET /professions/:id
**Description**: Get profession by ID

### POST /professions
**Description**: Create profession (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "name": string,
  "slug": string,
  "description": string
}
```

### PUT /professions/:id
**Description**: Update profession (Admin only)
**Headers**: Authorization required (Admin)

### DELETE /professions/:id
**Description**: Delete profession (Admin only)
**Headers**: Authorization required (Admin)

---

## 5. SERVICE POSTING ENDPOINTS

### GET /postings
**Description**: Get service postings with filters
**Query Parameters**:
- `page`, `limit`, `search`
- `categoryId`: string
- `status`: "OPEN" | "CLOSED" | "EXPIRED"
- `clientId`: string
- `priceMin`, `priceMax`: number
- `locationLat`, `locationLng`, `radius`
- `dateFrom`, `dateTo`: string (ISO date)

### GET /postings/:id
**Description**: Get posting by ID
**Response**: ServicePosting with relations

### POST /postings
**Description**: Create service posting
**Headers**: Authorization required (Client)
**Body**:
```json
{
  "title": string,
  "description": string,
  "categoryId": string,
  "lat": number,
  "lng": number,
  "address": string,
  "requiredFrom": string (ISO date),
  "requiredTo": string (ISO date),
  "priceMin": number,
  "priceMax": number,
  "mediaIds": string[]
}
```

### PUT /postings/:id
**Description**: Update posting
**Headers**: Authorization required (Owner)

### DELETE /postings/:id
**Description**: Delete posting
**Headers**: Authorization required (Owner)

### PUT /postings/:id/status
**Description**: Update posting status
**Headers**: Authorization required (Owner)
**Body**:
```json
{
  "status": "OPEN" | "CLOSED" | "EXPIRED"
}
```

---

## 6. OFFER ENDPOINTS

### GET /offers
**Description**: Get offers with filters
**Query Parameters**:
- `page`, `limit`
- `postingId`: string
- `professionalId`: string
- `status`: "PENDING" | "ACCEPTED" | "REJECTED"

### GET /offers/:id
**Description**: Get offer by ID

### POST /offers
**Description**: Create offer
**Headers**: Authorization required (Professional)
**Body**:
```json
{
  "postingId": string,
  "price": number,
  "message": string
}
```

### PUT /offers/:id/status
**Description**: Accept/reject offer
**Headers**: Authorization required (Posting Owner)
**Body**:
```json
{
  "status": "ACCEPTED" | "REJECTED"
}
```

---

## 7. PROFESSIONAL SERVICE ENDPOINTS

### GET /professional-services
**Description**: Get professional services with filters
**Query Parameters**:
- `page`, `limit`, `search`
- `professionalId`: string
- `categoryId`: string
- `priceMin`, `priceMax`: number
- `isActive`: boolean

### GET /professional-services/:id
**Description**: Get professional service by ID

### POST /professional-services
**Description**: Create professional service
**Headers**: Authorization required (Professional)
**Body**:
```json
{
  "title": string,
  "slug": string,
  "description": string,
  "price": number,
  "categoryId": string,
  "serviceLocations": object,
  "mediaIds": string[]
}
```

### PUT /professional-services/:id
**Description**: Update professional service
**Headers**: Authorization required (Owner)

### DELETE /professional-services/:id
**Description**: Delete professional service
**Headers**: Authorization required (Owner)

### PUT /professional-services/:id/toggle
**Description**: Toggle service active status
**Headers**: Authorization required (Owner)

---

## 8. SERVICE TRANSACTION ENDPOINTS

### GET /transactions
**Description**: Get service transactions with filters
**Query Parameters**:
- `page`, `limit`
- `clientId`: string
- `professionalId`: string
- `status`: ServiceStatus
- `dateFrom`, `dateTo`: string

### GET /transactions/:id
**Description**: Get transaction by ID

### POST /transactions
**Description**: Create transaction from offer
**Headers**: Authorization required
**Body**:
```json
{
  "offerId": string,
  "scheduledDate": string (ISO date),
  "notes": string
}
```

### PUT /transactions/:id/status
**Description**: Update transaction status
**Headers**: Authorization required (Participant)
**Body**:
```json
{
  "status": ServiceStatus,
  "notes": string
}
```

### POST /transactions/:id/complete
**Description**: Mark transaction as completed
**Headers**: Authorization required (Professional)

---

## 9. PAYMENT ENDPOINTS

### GET /payments
**Description**: Get payments with filters
**Query Parameters**:
- `page`, `limit`
- `userId`: string
- `status`: PaymentStatus
- `method`: PaymentMethod

### GET /payments/:id
**Description**: Get payment by ID

### POST /payments
**Description**: Create payment
**Headers**: Authorization required
**Body**:
```json
{
  "transactionId": string,
  "amount": number,
  "method": PaymentMethod,
  "details": object
}
```

### POST /payments/:id/process
**Description**: Process payment
**Headers**: Authorization required

### POST /payments/:id/refund
**Description**: Refund payment (Admin only)
**Headers**: Authorization required (Admin)

---

## 10. REVIEW ENDPOINTS

### GET /reviews
**Description**: Get reviews with filters
**Query Parameters**:
- `page`, `limit`
- `reviewerId`: string
- `reviewedId`: string
- `transactionId`: string
- `isProReview`: boolean

### GET /reviews/:id
**Description**: Get review by ID

### POST /reviews
**Description**: Create review
**Headers**: Authorization required
**Body**:
```json
{
  "transactionId": string,
  "reviewedId": string,
  "rating": number (1-5),
  "comment": string,
  "isProReview": boolean
}
```

### PUT /reviews/:id
**Description**: Update review
**Headers**: Authorization required (Reviewer)

### DELETE /reviews/:id
**Description**: Delete review
**Headers**: Authorization required (Reviewer)

---

## 11. MEDIA ENDPOINTS

### POST /media/upload
**Description**: Upload media files
**Headers**: Authorization required
**Body**: FormData with files
**Response**: Array of Media objects

### GET /media
**Description**: Get media with filters
**Query Parameters**:
- `page`, `limit`
- `uploadedById`: string
- `type`: "IMAGE" | "VIDEO" | "DOCUMENT"
- `postingId`: string
- `proServiceId`: string
- `transactionId`: string

### GET /media/:id
**Description**: Get media by ID

### DELETE /media/:id
**Description**: Delete media
**Headers**: Authorization required (Owner)

---

## 12. CONVERSATION ENDPOINTS

### GET /conversations
**Description**: Get user conversations
**Headers**: Authorization required
**Query Parameters**:
- `page`, `limit`

### POST /conversations
**Description**: Create conversation
**Headers**: Authorization required
**Body**:
```json
{
  "participantIds": string[]
}
```

### GET /conversations/:id
**Description**: Get conversation by ID
**Headers**: Authorization required (Participant)

### GET /conversations/:id/messages
**Description**: Get conversation messages
**Headers**: Authorization required (Participant)
**Query Parameters**:
- `page`, `limit`
- `before`: string (message ID)

### POST /conversations/:id/messages
**Description**: Send message
**Headers**: Authorization required (Participant)
**Body**:
```json
{
  "text": string,
  "mediaIds": string[]
}
```

---

## 13. PROMO CODE ENDPOINTS

### GET /promo-codes
**Description**: Get promo codes with filters
**Query Parameters**:
- `page`, `limit`
- `code`: string
- `isActive`: boolean
- `targetCategory`: string

### GET /promo-codes/:id
**Description**: Get promo code by ID

### POST /promo-codes
**Description**: Create promo code (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "code": string,
  "discountType": "PERCENTAGE" | "FIXED_AMOUNT",
  "discountValue": number,
  "maxUses": number,
  "maxUsesPerUser": number,
  "validFrom": string (ISO date),
  "validUntil": string (ISO date),
  "targetCategory": string
}
```

### POST /promo-codes/validate
**Description**: Validate promo code
**Body**:
```json
{
  "code": string,
  "userId": string,
  "transactionId": string
}
```

### POST /promo-codes/:id/use
**Description**: Use promo code
**Headers**: Authorization required
**Body**:
```json
{
  "transactionId": string
}
```

---

## 14. REPORT ENDPOINTS

### GET /reports
**Description**: Get reports with filters
**Query Parameters**:
- `page`, `limit`
- `reporterId`: string
- `reportedId`: string
- `serviceId`: string
- `status`: string

### GET /reports/:id
**Description**: Get report by ID

### POST /reports
**Description**: Create report
**Headers**: Authorization required
**Body**:
```json
{
  "reportedId": string,
  "serviceId": string,
  "reason": string,
  "proofMedia": object,
  "mediaIds": string[]
}
```

### PUT /reports/:id/status
**Description**: Update report status (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "status": string,
  "adminNotes": string
}
```

---

## 15. DASHBOARD METRICS ENDPOINTS

### GET /admin/metrics/overview
**Description**: Get overview metrics for admin dashboard
**Headers**: Authorization required (Admin)
**Response**:
```json
{
  "totalUsers": number,
  "totalProfessionals": number,
  "totalTransactions": number,
  "totalRevenue": number,
  "activePostings": number,
  "pendingReports": number
}
```

### GET /admin/metrics/users
**Description**: Get user metrics
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `period`: "day" | "week" | "month" | "year"
- `dateFrom`, `dateTo`: string

### GET /admin/metrics/transactions
**Description**: Get transaction metrics
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `period`, `dateFrom`, `dateTo`
- `status`: ServiceStatus

### GET /admin/metrics/revenue
**Description**: Get revenue metrics
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `period`, `dateFrom`, `dateTo`
- `groupBy`: "day" | "week" | "month"

### GET /admin/metrics/professions
**Description**: Get profession popularity metrics
**Headers**: Authorization required (Admin)

### GET /admin/metrics/locations
**Description**: Get location-based metrics
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `period`, `dateFrom`, `dateTo`

---

## 16. AD CAMPAIGN ENDPOINTS

### GET /admin/ad-campaigns
**Description**: Get ad campaigns
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `page`, `limit`
- `isActive`: boolean
- `targetSegment`: AdSegment

### POST /admin/ad-campaigns
**Description**: Create ad campaign
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "title": string,
  "targetSegment": "CLIENT" | "PROFESSIONAL" | "ALL",
  "location": string,
  "imageUrl": string,
  "targetUrl": string,
  "startDate": string (ISO date),
  "endDate": string (ISO date)
}
```

### PUT /admin/ad-campaigns/:id
**Description**: Update ad campaign
**Headers**: Authorization required (Admin)

### DELETE /admin/ad-campaigns/:id
**Description**: Delete ad campaign
**Headers**: Authorization required (Admin)

---

## 17. USER PAYMENT METHOD ENDPOINTS

### GET /users/payment-methods
**Description**: Get user payment methods
**Headers**: Authorization required

### POST /users/payment-methods
**Description**: Add payment method
**Headers**: Authorization required
**Body**:
```json
{
  "method": PaymentMethod,
  "accountNumber": string,
  "accountAlias": string,
  "idNumber": string,
  "phoneNumber": string,
  "details": object,
  "isDefault": boolean
}
```

### PUT /users/payment-methods/:id
**Description**: Update payment method
**Headers**: Authorization required (Owner)

### DELETE /users/payment-methods/:id
**Description**: Delete payment method
**Headers**: Authorization required (Owner)

---

## 18. WITHDRAWAL ENDPOINTS

### GET /users/withdrawals
**Description**: Get user withdrawals
**Headers**: Authorization required
**Query Parameters**:
- `page`, `limit`
- `status`: WithdrawalStatus

### POST /users/withdrawals
**Description**: Request withdrawal
**Headers**: Authorization required
**Body**:
```json
{
  "paymentMethodId": string,
  "amount": number
}
```

### GET /admin/withdrawals
**Description**: Get all withdrawals (Admin only)
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `page`, `limit`
- `status`: WithdrawalStatus
- `userId`: string

### PUT /admin/withdrawals/:id/status
**Description**: Update withdrawal status (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "status": "COMPLETED" | "FAILED",
  "adminNotes": string,
  "rejectionReason": string
}
```

---

## 19. NOTIFICATION ENDPOINTS

### GET /notifications
**Description**: Get user notifications
**Headers**: Authorization required
**Query Parameters**:
- `page`, `limit`
- `read`: boolean

### PUT /notifications/:id/read
**Description**: Mark notification as read
**Headers**: Authorization required

### PUT /notifications/read-all
**Description**: Mark all notifications as read
**Headers**: Authorization required

### POST /notifications
**Description**: Send notification (Admin only)
**Headers**: Authorization required (Admin)
**Body**:
```json
{
  "userId": string,
  "title": string,
  "body": string,
  "data": object
}
```

---

## 20. AUDIT LOG ENDPOINTS

### GET /admin/audit-logs
**Description**: Get audit logs (Admin only)
**Headers**: Authorization required (Admin)
**Query Parameters**:
- `page`, `limit`
- `actorId`: string
- `action`: string
- `dateFrom`, `dateTo`: string

### POST /audit-logs
**Description**: Create audit log entry
**Headers**: Authorization required
**Body**:
```json
{
  "action": string,
  "meta": object
}
```
