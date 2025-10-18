# Zod Schemas for API Endpoints

## Base Schemas

### Common Response Schemas
```typescript
import { z } from 'zod';

// Base response schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number().min(0),
  totalPages: z.number().min(0),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

// Success response with data
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseResponseSchema.extend({
    success: z.literal(true),
    data: dataSchema,
    pagination: PaginationSchema.optional(),
  });
```

### Enum Schemas
```typescript
// Role enum
export const RoleSchema = z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']);

// Posting status enum
export const PostingStatusSchema = z.enum(['OPEN', 'CLOSED', 'EXPIRED']);

// Service status enum
export const ServiceStatusSchema = z.enum([
  'PENDING_SOLICITUD',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELED',
]);

// Offer status enum
export const OfferStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);

// Payment status enum
export const PaymentStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);

// Payment method enum
export const PaymentMethodSchema = z.enum([
  'CASHEA',
  'BALANCE',
  'TRANSFER',
  'PAY_MOBILE',
  'CARD',
  'OTHER',
]);

// Media type enum
export const MediaTypeSchema = z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']);

// Discount type enum
export const DiscountTypeSchema = z.enum(['PERCENTAGE', 'FIXED_AMOUNT']);

// Ad segment enum
export const AdSegmentSchema = z.enum(['CLIENT', 'PROFESSIONAL', 'ALL']);

// Withdrawal status enum
export const WithdrawalStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED']);
```

## 1. Authentication Schemas

### Register Request
```typescript
export const RegisterRequestSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: RoleSchema.default('CLIENT'),
}).refine(
  (data) => data.email || data.phone,
  { message: "Either email or phone must be provided" }
);

export const RegisterResponseSchema = SuccessResponseSchema(z.object({
  user: UserSchema,
  token: z.string(),
}));
```

### Login Request
```typescript
export const LoginRequestSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string(),
}).refine(
  (data) => data.email || data.phone,
  { message: "Either email or phone must be provided" }
);

export const LoginResponseSchema = SuccessResponseSchema(z.object({
  user: UserSchema,
  token: z.string(),
}));
```

### Refresh Token Request
```typescript
export const RefreshTokenRequestSchema = z.object({
  token: z.string(),
});

export const RefreshTokenResponseSchema = SuccessResponseSchema(z.object({
  token: z.string(),
}));
```

### Forgot Password Request
```typescript
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordResponseSchema = SuccessResponseSchema(z.object({
  message: z.string(),
}));
```

### Reset Password Request
```typescript
export const ResetPasswordRequestSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const ResetPasswordResponseSchema = SuccessResponseSchema(z.object({
  message: z.string(),
}));
```

## 2. User Schemas

### User Schema
```typescript
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  role: RoleSchema,
  isVerified: z.boolean(),
  isIDVerified: z.boolean(),
  balance: z.number(),
  isSuspended: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
  locationLat: z.number().nullable(),
  locationLng: z.number().nullable(),
  locationAddress: z.string().nullable(),
});
```

### Update User Profile Request
```typescript
export const UpdateUserProfileRequestSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  locationAddress: z.string().optional(),
});
```

### Get Users Query
```typescript
export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  role: RoleSchema.optional(),
  isVerified: z.coerce.boolean().optional(),
  search: z.string().optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
});
```

### Verify User Request
```typescript
export const VerifyUserRequestSchema = z.object({
  isVerified: z.boolean(),
  isIDVerified: z.boolean(),
});
```

### Suspend User Request
```typescript
export const SuspendUserRequestSchema = z.object({
  isSuspended: z.boolean(),
  reason: z.string().optional(),
});
```

## 3. Professional Profile Schemas

### Professional Profile Schema
```typescript
export const ProfessionalProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable(),
  earningsSummary: z.any().nullable(),
  portfolio: z.any().nullable(),
  ratingAvg: z.number().nullable(),
  ratingCount: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Create Professional Profile Request
```typescript
export const CreateProfessionalProfileRequestSchema = z.object({
  bio: z.string().optional(),
  portfolio: z.any().optional(),
  professions: z.array(z.string()),
});
```

### Update Professional Profile Request
```typescript
export const UpdateProfessionalProfileRequestSchema = z.object({
  bio: z.string().optional(),
  earningsSummary: z.any().optional(),
  portfolio: z.any().optional(),
});
```

### Get Professionals Query
```typescript
export const GetProfessionalsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  professionId: z.string().optional(),
  ratingMin: z.coerce.number().min(0).max(5).optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
  isVerified: z.coerce.boolean().optional(),
});
```

### Verify Professional Request
```typescript
export const VerifyProfessionalRequestSchema = z.object({
  professionId: z.string(),
  verified: z.boolean(),
  documents: z.any().optional(),
});
```

## 4. Profession Schemas

### Profession Schema
```typescript
export const ProfessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
});
```

### Create Profession Request
```typescript
export const CreateProfessionRequestSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});
```

### Update Profession Request
```typescript
export const UpdateProfessionRequestSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
});
```

### Get Professions Query
```typescript
export const GetProfessionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});
```

## 5. Service Posting Schemas

### Service Posting Schema
```typescript
export const ServicePostingSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  address: z.string().nullable(),
  requiredFrom: z.string().datetime().nullable(),
  requiredTo: z.string().datetime().nullable(),
  priceMin: z.number().nullable(),
  priceMax: z.number().nullable(),
  status: PostingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
});
```

### Create Service Posting Request
```typescript
export const CreateServicePostingRequestSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  categoryId: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
  requiredFrom: z.string().datetime().optional(),
  requiredTo: z.string().datetime().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  mediaIds: z.array(z.string()).optional(),
});
```

### Update Service Posting Request
```typescript
export const UpdateServicePostingRequestSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().optional(),
  requiredFrom: z.string().datetime().optional(),
  requiredTo: z.string().datetime().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  mediaIds: z.array(z.string()).optional(),
});
```

### Update Posting Status Request
```typescript
export const UpdatePostingStatusRequestSchema = z.object({
  status: PostingStatusSchema,
});
```

### Get Postings Query
```typescript
export const GetPostingsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: PostingStatusSchema.optional(),
  clientId: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  locationLat: z.coerce.number().optional(),
  locationLng: z.coerce.number().optional(),
  radius: z.coerce.number().min(0).default(10),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
```

## 6. Offer Schemas

### Offer Schema
```typescript
export const OfferSchema = z.object({
  id: z.string(),
  postingId: z.string(),
  professionalId: z.string(),
  price: z.number(),
  message: z.string().nullable(),
  status: OfferStatusSchema,
  createdAt: z.string().datetime(),
});
```

### Create Offer Request
```typescript
export const CreateOfferRequestSchema = z.object({
  postingId: z.string(),
  price: z.number().min(0),
  message: z.string().optional(),
});
```

### Update Offer Status Request
```typescript
export const UpdateOfferStatusRequestSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
});
```

### Get Offers Query
```typescript
export const GetOffersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  postingId: z.string().optional(),
  professionalId: z.string().optional(),
  status: OfferStatusSchema.optional(),
});
```

## 7. Professional Service Schemas

### Professional Service Schema
```typescript
export const ProfessionalServiceSchema = z.object({
  id: z.string(),
  professionalId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string(),
  serviceLocations: z.any().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Create Professional Service Request
```typescript
export const CreateProfessionalServiceRequestSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(0),
  categoryId: z.string(),
  serviceLocations: z.any().optional(),
  mediaIds: z.array(z.string()).optional(),
});
```

### Update Professional Service Request
```typescript
export const UpdateProfessionalServiceRequestSchema = z.object({
  title: z.string().min(5).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  serviceLocations: z.any().optional(),
  mediaIds: z.array(z.string()).optional(),
});
```

### Get Professional Services Query
```typescript
export const GetProfessionalServicesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  professionalId: z.string().optional(),
  categoryId: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});
```

## 8. Service Transaction Schemas

### Service Transaction Schema
```typescript
export const ServiceTransactionSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  professionalId: z.string(),
  priceAgreed: z.number(),
  discountAmount: z.number(),
  platformFee: z.number(),
  escrowAmount: z.number(),
  currentStatus: ServiceStatusSchema,
  scheduledDate: z.string().datetime().nullable(),
  postingId: z.string().nullable(),
  proServiceId: z.string().nullable(),
  promoCodeId: z.string().nullable(),
  yummyLogistics: z.any().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});
```

### Create Transaction Request
```typescript
export const CreateTransactionRequestSchema = z.object({
  offerId: z.string(),
  scheduledDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});
```

### Update Transaction Status Request
```typescript
export const UpdateTransactionStatusRequestSchema = z.object({
  status: ServiceStatusSchema,
  notes: z.string().optional(),
});
```

### Get Transactions Query
```typescript
export const GetTransactionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  clientId: z.string().optional(),
  professionalId: z.string().optional(),
  status: ServiceStatusSchema.optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
```

## 9. Payment Schemas

### Payment Schema
```typescript
export const PaymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  transactionId: z.string().nullable(),
  amount: z.number(),
  fee: z.number(),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema,
  details: z.any().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Create Payment Request
```typescript
export const CreatePaymentRequestSchema = z.object({
  transactionId: z.string(),
  amount: z.number().min(0),
  method: PaymentMethodSchema,
  details: z.any().optional(),
});
```

### Process Payment Request
```typescript
export const ProcessPaymentRequestSchema = z.object({
  paymentDetails: z.any(),
});
```

### Refund Payment Request
```typescript
export const RefundPaymentRequestSchema = z.object({
  reason: z.string().optional(),
  amount: z.number().min(0).optional(),
});
```

### Get Payments Query
```typescript
export const GetPaymentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  userId: z.string().optional(),
  status: PaymentStatusSchema.optional(),
  method: PaymentMethodSchema.optional(),
});
```

## 10. Review Schemas

### Review Schema
```typescript
export const ReviewSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  reviewerId: z.string(),
  reviewedId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  isProReview: z.boolean(),
  createdAt: z.string().datetime(),
});
```

### Create Review Request
```typescript
export const CreateReviewRequestSchema = z.object({
  transactionId: z.string(),
  reviewedId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isProReview: z.boolean(),
});
```

### Update Review Request
```typescript
export const UpdateReviewRequestSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});
```

### Get Reviews Query
```typescript
export const GetReviewsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  reviewerId: z.string().optional(),
  reviewedId: z.string().optional(),
  transactionId: z.string().optional(),
  isProReview: z.coerce.boolean().optional(),
});
```

## 11. Media Schemas

### Media Schema
```typescript
export const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  type: MediaTypeSchema,
  filename: z.string().nullable(),
  sizeBytes: z.number().nullable(),
  uploadedById: z.string().nullable(),
  postingId: z.string().nullable(),
  proServiceId: z.string().nullable(),
  transactionId: z.string().nullable(),
  reportId: z.string().nullable(),
  createdAt: z.string().datetime(),
});
```

### Upload Media Request
```typescript
export const UploadMediaRequestSchema = z.object({
  files: z.array(z.instanceof(File)),
  type: MediaTypeSchema.optional(),
});
```

### Get Media Query
```typescript
export const GetMediaQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  uploadedById: z.string().optional(),
  type: MediaTypeSchema.optional(),
  postingId: z.string().optional(),
  proServiceId: z.string().optional(),
  transactionId: z.string().optional(),
});
```

## 12. Conversation Schemas

### Conversation Schema
```typescript
export const ConversationSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  createdAt: z.string().datetime(),
});
```

### Create Conversation Request
```typescript
export const CreateConversationRequestSchema = z.object({
  participantIds: z.array(z.string()).min(1),
});
```

### Message Schema
```typescript
export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  text: z.string().nullable(),
  mediaIds: z.string().nullable(),
  readBy: z.string().nullable(),
  createdAt: z.string().datetime(),
});
```

### Send Message Request
```typescript
export const SendMessageRequestSchema = z.object({
  text: z.string().optional(),
  mediaIds: z.array(z.string()).optional(),
}).refine(
  (data) => data.text || data.mediaIds?.length,
  { message: "Either text or media must be provided" }
);
```

### Get Messages Query
```typescript
export const GetMessagesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  before: z.string().optional(),
});
```

## 13. Promo Code Schemas

### Promo Code Schema
```typescript
export const PromoCodeSchema = z.object({
  id: z.string(),
  code: z.string(),
  discountType: DiscountTypeSchema,
  discountValue: z.number(),
  maxUses: z.number().nullable(),
  usesCount: z.number(),
  maxUsesPerUser: z.number().nullable(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime().nullable(),
  targetCategory: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});
```

### Create Promo Code Request
```typescript
export const CreatePromoCodeRequestSchema = z.object({
  code: z.string().min(3),
  discountType: DiscountTypeSchema,
  discountValue: z.number().min(0),
  maxUses: z.number().min(1).optional(),
  maxUsesPerUser: z.number().min(1).optional(),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  targetCategory: z.string().optional(),
});
```

### Validate Promo Code Request
```typescript
export const ValidatePromoCodeRequestSchema = z.object({
  code: z.string(),
  userId: z.string(),
  transactionId: z.string(),
});
```

### Use Promo Code Request
```typescript
export const UsePromoCodeRequestSchema = z.object({
  transactionId: z.string(),
});
```

### Get Promo Codes Query
```typescript
export const GetPromoCodesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  code: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  targetCategory: z.string().optional(),
});
```

## 14. Report Schemas

### Report Schema
```typescript
export const ReportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  reportedId: z.string().nullable(),
  serviceId: z.string().nullable(),
  reason: z.string(),
  proofMedia: z.any().nullable(),
  status: z.string(),
  adminNotes: z.string().nullable(),
  createdAt: z.string().datetime(),
});
```

### Create Report Request
```typescript
export const CreateReportRequestSchema = z.object({
  reportedId: z.string().optional(),
  serviceId: z.string().optional(),
  reason: z.string().min(10),
  proofMedia: z.any().optional(),
  mediaIds: z.array(z.string()).optional(),
}).refine(
  (data) => data.reportedId || data.serviceId,
  { message: "Either reportedId or serviceId must be provided" }
);
```

### Update Report Status Request
```typescript
export const UpdateReportStatusRequestSchema = z.object({
  status: z.string(),
  adminNotes: z.string().optional(),
});
```

### Get Reports Query
```typescript
export const GetReportsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  reporterId: z.string().optional(),
  reportedId: z.string().optional(),
  serviceId: z.string().optional(),
  status: z.string().optional(),
});
```

## 15. Dashboard Metrics Schemas

### Overview Metrics Response
```typescript
export const OverviewMetricsResponseSchema = z.object({
  totalUsers: z.number(),
  totalProfessionals: z.number(),
  totalTransactions: z.number(),
  totalRevenue: z.number(),
  activePostings: z.number(),
  pendingReports: z.number(),
});
```

### User Metrics Query
```typescript
export const UserMetricsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
```

### Transaction Metrics Query
```typescript
export const TransactionMetricsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  status: ServiceStatusSchema.optional(),
});
```

### Revenue Metrics Query
```typescript
export const RevenueMetricsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).default('month'),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
});
```

## 16. Ad Campaign Schemas

### Ad Campaign Schema
```typescript
export const AdCampaignSchema = z.object({
  id: z.string(),
  title: z.string(),
  targetSegment: AdSegmentSchema,
  location: z.string(),
  imageUrl: z.string(),
  targetUrl: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean(),
  impressions: z.number(),
  clicks: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Create Ad Campaign Request
```typescript
export const CreateAdCampaignRequestSchema = z.object({
  title: z.string().min(5),
  targetSegment: AdSegmentSchema,
  location: z.string().min(2),
  imageUrl: z.string().url(),
  targetUrl: z.string().url(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});
```

### Update Ad Campaign Request
```typescript
export const UpdateAdCampaignRequestSchema = z.object({
  title: z.string().min(5).optional(),
  targetSegment: AdSegmentSchema.optional(),
  location: z.string().min(2).optional(),
  imageUrl: z.string().url().optional(),
  targetUrl: z.string().url().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});
```

### Get Ad Campaigns Query
```typescript
export const GetAdCampaignsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  isActive: z.coerce.boolean().optional(),
  targetSegment: AdSegmentSchema.optional(),
});
```

## 17. User Payment Method Schemas

### User Payment Method Schema
```typescript
export const UserPaymentMethodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  method: PaymentMethodSchema,
  accountNumber: z.string().nullable(),
  accountAlias: z.string().nullable(),
  idNumber: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  details: z.any().nullable(),
  isVerified: z.boolean(),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

### Create Payment Method Request
```typescript
export const CreatePaymentMethodRequestSchema = z.object({
  method: PaymentMethodSchema,
  accountNumber: z.string().optional(),
  accountAlias: z.string().optional(),
  idNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  details: z.any().optional(),
  isDefault: z.boolean().default(false),
});
```

### Update Payment Method Request
```typescript
export const UpdatePaymentMethodRequestSchema = z.object({
  accountNumber: z.string().optional(),
  accountAlias: z.string().optional(),
  idNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  details: z.any().optional(),
  isDefault: z.boolean().optional(),
});
```

## 18. Withdrawal Schemas

### Withdrawal Schema
```typescript
export const WithdrawalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  paymentMethodId: z.string(),
  amount: z.number(),
  status: WithdrawalStatusSchema,
  requestedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  adminNotes: z.string().nullable(),
  rejectionReason: z.string().nullable(),
});
```

### Create Withdrawal Request
```typescript
export const CreateWithdrawalRequestSchema = z.object({
  paymentMethodId: z.string(),
  amount: z.number().min(0.01),
});
```

### Update Withdrawal Status Request
```typescript
export const UpdateWithdrawalStatusRequestSchema = z.object({
  status: z.enum(['COMPLETED', 'FAILED']),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
});
```

### Get Withdrawals Query
```typescript
export const GetWithdrawalsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  userId: z.string().optional(),
  status: WithdrawalStatusSchema.optional(),
});
```

## 19. Notification Schemas

### Notification Schema
```typescript
export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  data: z.any().nullable(),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});
```

### Create Notification Request
```typescript
export const CreateNotificationRequestSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.any().optional(),
});
```

### Get Notifications Query
```typescript
export const GetNotificationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  read: z.coerce.boolean().optional(),
});
```

## 20. Audit Log Schemas

### Audit Log Schema
```typescript
export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string().nullable(),
  action: z.string(),
  meta: z.any().nullable(),
  createdAt: z.string().datetime(),
});
```

### Create Audit Log Request
```typescript
export const CreateAuditLogRequestSchema = z.object({
  action: z.string().min(1),
  meta: z.any().optional(),
});
```

### Get Audit Logs Query
```typescript
export const GetAuditLogsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  actorId: z.string().optional(),
  action: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
```
