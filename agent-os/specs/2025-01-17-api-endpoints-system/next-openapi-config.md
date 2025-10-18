# Next-OpenAPI-Gen Configuration

## Updated next.openapi.json

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Tigrito MVP API Documentation",
    "version": "1.0.0",
    "description": "Complete API documentation for Tigrito MVP - A marketplace for professional services"
  },
  "servers": [
    {
      "url": "http://localhost:3000/api",
      "description": "Local development server"
    },
    {
      "url": "https://api.tigrito.com/api",
      "description": "Production server"
    }
  ],
  "components": {
    "securitySchemes": {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "JWT token for authentication"
      }
    },
    "schemas": {
      "Error": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": false
          },
          "error": {
            "type": "object",
            "properties": {
              "code": {
                "type": "string",
                "example": "VALIDATION_ERROR"
              },
              "message": {
                "type": "string",
                "example": "Invalid input data"
              },
              "details": {
                "type": "object",
                "description": "Additional error details"
              }
            },
            "required": ["code", "message"]
          }
        },
        "required": ["success", "error"]
      },
      "SuccessResponse": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "example": true
          },
          "data": {
            "type": "object",
            "description": "Response data"
          },
          "message": {
            "type": "string",
            "description": "Success message"
          },
          "pagination": {
            "$ref": "#/components/schemas/Pagination"
          }
        },
        "required": ["success"]
      },
      "Pagination": {
        "type": "object",
        "properties": {
          "page": {
            "type": "integer",
            "minimum": 1,
            "example": 1
          },
          "limit": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "example": 10
          },
          "total": {
            "type": "integer",
            "minimum": 0,
            "example": 100
          },
          "totalPages": {
            "type": "integer",
            "minimum": 0,
            "example": 10
          }
        },
        "required": ["page", "limit", "total", "totalPages"]
      },
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "email": {
            "type": "string",
            "format": "email",
            "nullable": true,
            "example": "user@example.com"
          },
          "phone": {
            "type": "string",
            "nullable": true,
            "example": "+1234567890"
          },
          "name": {
            "type": "string",
            "nullable": true,
            "example": "John Doe"
          },
          "role": {
            "type": "string",
            "enum": ["CLIENT", "PROFESSIONAL", "ADMIN"],
            "example": "CLIENT"
          },
          "isVerified": {
            "type": "boolean",
            "example": false
          },
          "isIDVerified": {
            "type": "boolean",
            "example": false
          },
          "balance": {
            "type": "number",
            "format": "decimal",
            "example": 0.0
          },
          "isSuspended": {
            "type": "boolean",
            "example": false
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          },
          "locationLat": {
            "type": "number",
            "nullable": true,
            "example": 40.7128
          },
          "locationLng": {
            "type": "number",
            "nullable": true,
            "example": -74.0060
          },
          "locationAddress": {
            "type": "string",
            "nullable": true,
            "example": "123 Main St, New York, NY"
          }
        },
        "required": ["id", "role", "isVerified", "isIDVerified", "balance", "isSuspended", "createdAt", "updatedAt"]
      },
      "ServicePosting": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "clientId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "title": {
            "type": "string",
            "example": "Need a plumber for bathroom repair"
          },
          "description": {
            "type": "string",
            "example": "I need someone to fix a leaky faucet in my bathroom"
          },
          "categoryId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "lat": {
            "type": "number",
            "nullable": true,
            "example": 40.7128
          },
          "lng": {
            "type": "number",
            "nullable": true,
            "example": -74.0060
          },
          "address": {
            "type": "string",
            "nullable": true,
            "example": "123 Main St, New York, NY"
          },
          "requiredFrom": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "example": "2025-01-20T09:00:00Z"
          },
          "requiredTo": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "example": "2025-01-20T17:00:00Z"
          },
          "priceMin": {
            "type": "number",
            "format": "decimal",
            "nullable": true,
            "example": 50.00
          },
          "priceMax": {
            "type": "number",
            "format": "decimal",
            "nullable": true,
            "example": 150.00
          },
          "status": {
            "type": "string",
            "enum": ["OPEN", "CLOSED", "EXPIRED"],
            "example": "OPEN"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "clientId", "title", "description", "categoryId", "status", "createdAt", "updatedAt"]
      },
      "Offer": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "postingId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "professionalId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "price": {
            "type": "number",
            "format": "decimal",
            "example": 100.00
          },
          "message": {
            "type": "string",
            "nullable": true,
            "example": "I can help you with this repair. I have 5 years of experience."
          },
          "status": {
            "type": "string",
            "enum": ["PENDING", "ACCEPTED", "REJECTED"],
            "example": "PENDING"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "postingId", "professionalId", "price", "status", "createdAt"]
      },
      "ServiceTransaction": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "clientId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "professionalId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "priceAgreed": {
            "type": "number",
            "format": "decimal",
            "example": 100.00
          },
          "discountAmount": {
            "type": "number",
            "format": "decimal",
            "example": 0.00
          },
          "platformFee": {
            "type": "number",
            "format": "decimal",
            "example": 10.00
          },
          "escrowAmount": {
            "type": "number",
            "format": "decimal",
            "example": 90.00
          },
          "currentStatus": {
            "type": "string",
            "enum": ["PENDING_SOLICITUD", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELED"],
            "example": "PENDING_SOLICITUD"
          },
          "scheduledDate": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "example": "2025-01-20T09:00:00Z"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "clientId", "professionalId", "priceAgreed", "discountAmount", "platformFee", "escrowAmount", "currentStatus", "createdAt", "updatedAt"]
      },
      "Payment": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "userId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "transactionId": {
            "type": "string",
            "nullable": true,
            "example": "clx1234567890"
          },
          "amount": {
            "type": "number",
            "format": "decimal",
            "example": 100.00
          },
          "fee": {
            "type": "number",
            "format": "decimal",
            "example": 10.00
          },
          "method": {
            "type": "string",
            "enum": ["CASHEA", "BALANCE", "TRANSFER", "PAY_MOBILE", "CARD", "OTHER"],
            "example": "CARD"
          },
          "status": {
            "type": "string",
            "enum": ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
            "example": "PENDING"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "userId", "amount", "fee", "method", "status", "createdAt", "updatedAt"]
      },
      "Review": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "transactionId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "reviewerId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "reviewedId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "rating": {
            "type": "integer",
            "minimum": 1,
            "maximum": 5,
            "example": 5
          },
          "comment": {
            "type": "string",
            "nullable": true,
            "example": "Excellent service, very professional!"
          },
          "isProReview": {
            "type": "boolean",
            "example": false
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "transactionId", "reviewerId", "reviewedId", "rating", "isProReview", "createdAt"]
      },
      "Media": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "url": {
            "type": "string",
            "format": "uri",
            "example": "https://example.com/media/image.jpg"
          },
          "type": {
            "type": "string",
            "enum": ["IMAGE", "VIDEO", "DOCUMENT"],
            "example": "IMAGE"
          },
          "filename": {
            "type": "string",
            "nullable": true,
            "example": "image.jpg"
          },
          "sizeBytes": {
            "type": "integer",
            "nullable": true,
            "example": 1024000
          },
          "uploadedById": {
            "type": "string",
            "nullable": true,
            "example": "clx1234567890"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "url", "type", "createdAt"]
      },
      "Profession": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "name": {
            "type": "string",
            "example": "Plumber"
          },
          "slug": {
            "type": "string",
            "example": "plumber"
          },
          "description": {
            "type": "string",
            "nullable": true,
            "example": "Professional plumbing services"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "name", "slug", "createdAt"]
      },
      "ProfessionalProfile": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "clx1234567890"
          },
          "userId": {
            "type": "string",
            "example": "clx1234567890"
          },
          "bio": {
            "type": "string",
            "nullable": true,
            "example": "Experienced professional with 5+ years in the field"
          },
          "ratingAvg": {
            "type": "number",
            "nullable": true,
            "example": 4.8
          },
          "ratingCount": {
            "type": "integer",
            "example": 25
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time",
            "example": "2025-01-17T10:00:00Z"
          }
        },
        "required": ["id", "userId", "ratingCount", "createdAt", "updatedAt"]
      }
    }
  },
  "defaultResponseSet": "common",
  "responseSets": {
    "common": [
      "400",
      "500"
    ],
    "auth": [
      "400",
      "401",
      "403",
      "500"
    ],
    "public": [
      "400",
      "500"
    ],
    "admin": [
      "400",
      "401",
      "403",
      "404",
      "500"
    ]
  },
  "errorConfig": {
    "template": {
      "type": "object",
      "properties": {
        "success": {
          "type": "boolean",
          "example": false
        },
        "error": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "example": "{{ERROR_CODE}}"
            },
            "message": {
              "type": "string",
              "example": "{{ERROR_MESSAGE}}"
            },
            "details": {
              "type": "object",
              "description": "Additional error details"
            }
          },
          "required": ["code", "message"]
        }
      },
      "required": ["success", "error"]
    },
    "codes": {
      "400": {
        "description": "Bad Request",
        "variables": {
          "ERROR_MESSAGE": "Invalid request parameters",
          "ERROR_CODE": "BAD_REQUEST"
        }
      },
      "401": {
        "description": "Unauthorized",
        "variables": {
          "ERROR_MESSAGE": "Authentication required",
          "ERROR_CODE": "UNAUTHORIZED"
        }
      },
      "403": {
        "description": "Forbidden",
        "variables": {
          "ERROR_MESSAGE": "Access denied",
          "ERROR_CODE": "FORBIDDEN"
        }
      },
      "404": {
        "description": "Not Found",
        "variables": {
          "ERROR_MESSAGE": "Resource not found",
          "ERROR_CODE": "NOT_FOUND"
        }
      },
      "409": {
        "description": "Conflict",
        "variables": {
          "ERROR_MESSAGE": "Resource already exists",
          "ERROR_CODE": "CONFLICT"
        }
      },
      "422": {
        "description": "Validation Error",
        "variables": {
          "ERROR_MESSAGE": "Invalid input data",
          "ERROR_CODE": "VALIDATION_ERROR"
        }
      },
      "500": {
        "description": "Internal Server Error",
        "variables": {
          "ERROR_MESSAGE": "An unexpected error occurred",
          "ERROR_CODE": "INTERNAL_ERROR"
        }
      }
    }
  },
  "apiDir": "./src/app/api",
  "schemaDir": "./src/lib/schemas",
  "schemaType": "zod",
  "docsUrl": "api-docs",
  "ui": "scalar",
  "outputFile": "openapi.json",
  "outputDir": "./public",
  "includeOpenApiRoutes": true,
  "debug": false,
  "generateTypes": true,
  "typesOutputDir": "./src/lib/types/generated"
}
```

## Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "docs:generate": "next-openapi-gen",
    "docs:dev": "next-openapi-gen --watch",
    "docs:build": "next-openapi-gen && next build"
  }
}
```

## Implementation Commands

```bash
# Working directory: /home/julio/workspace/mvp_tigrito_web

# Install next-openapi-gen
cd /home/julio/workspace/mvp_tigrito_web && npm install -D next-openapi-gen

# Generate initial documentation
cd /home/julio/workspace/mvp_tigrito_web && npx next-openapi-gen

# Watch for changes during development
cd /home/julio/workspace/mvp_tigrito_web && npx next-openapi-gen --watch
```

## File Structure for Schemas

Create the following directory structure:

```
src/lib/schemas/
├── common.ts          # Base schemas, pagination, etc.
├── auth.ts           # Authentication schemas
├── user.ts           # User-related schemas
├── professional.ts   # Professional profile schemas
├── profession.ts     # Profession schemas
├── posting.ts        # Service posting schemas
├── offer.ts          # Offer schemas
├── professional-service.ts  # Professional service schemas
├── transaction.ts    # Service transaction schemas
├── payment.ts        # Payment schemas
├── review.ts         # Review schemas
├── media.ts          # Media schemas
├── conversation.ts   # Chat/conversation schemas
├── promo-code.ts     # Promo code schemas
├── report.ts         # Report schemas
├── ad-campaign.ts    # Ad campaign schemas
├── payment-method.ts # Payment method schemas
├── withdrawal.ts     # Withdrawal schemas
├── notification.ts   # Notification schemas
└── audit-log.ts      # Audit log schemas
```

## Usage in API Routes

Example of how to use the schemas in an API route:

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GetUsersQuerySchema, UserSchema } from '@/lib/schemas/user';
import { SuccessResponseSchema } from '@/lib/schemas/common';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = GetUsersQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      role: searchParams.get('role'),
      search: searchParams.get('search'),
      // ... other query parameters
    });

    // Your business logic here
    const users = await getUsers(query);
    const total = await getUsersCount(query);

    const response = SuccessResponseSchema(z.array(UserSchema)).parse({
      success: true,
      data: users,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    // Error handling
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
      }
    }, { status: 500 });
  }
}
```

## Documentation Features

The generated documentation will include:

1. **Interactive API Explorer** - Test endpoints directly from the browser
2. **Schema Validation** - Automatic request/response validation
3. **Type Generation** - TypeScript types generated from schemas
4. **Authentication** - JWT Bearer token authentication
5. **Error Handling** - Standardized error responses
6. **Pagination** - Consistent pagination across all list endpoints
7. **Search & Filtering** - Documented query parameters for all endpoints
8. **File Upload** - Support for multipart/form-data uploads
9. **Real-time Updates** - WebSocket documentation for chat features
10. **Admin Features** - Separate documentation for admin-only endpoints

## Next Steps

1. Update the `next.openapi.json` file with the new configuration
2. Install `next-openapi-gen` as a dev dependency
3. Create the schema files in the specified directory structure
4. Implement the API routes using the schemas
5. Generate the documentation using `npx next-openapi-gen`
6. Test the API documentation at `/api-docs`
