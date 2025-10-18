import { NextRequest, NextResponse } from 'next/server';
import { validateToken, extractTokenFromHeader, JWTPayload } from './jwt';
import { createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';

// Authentication middleware
export function authenticateRequest(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      )
    };
  }

  const validation = validateToken(token);
  if (!validation.success) {
    return {
      success: false,
      response: NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.UNAUTHORIZED, 'Invalid or expired token'),
        { status: 401 }
      )
    };
  }

  return { success: true, user: validation.payload };
}

// Role-based access control middleware
export function requireRole(allowedRoles: string[]) {
  return function(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
    const auth = authenticateRequest(request);
    if (!auth.success) {
      return auth;
    }

    if (!allowedRoles.includes(auth.user.role)) {
      return {
        success: false,
        response: NextResponse.json(
          createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Insufficient permissions'),
          { status: 403 }
        )
      };
    }

    return auth;
  };
}

// Admin-only middleware
export function requireAdmin(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
  return requireRole(['ADMIN'])(request);
}

// Professional or Admin middleware
export function requireProfessionalOrAdmin(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
  return requireRole(['PROFESSIONAL', 'ADMIN'])(request);
}

// Any authenticated user middleware
export function requireAuth(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
  return authenticateRequest(request);
}

// Optional authentication middleware (doesn't fail if no token)
export function optionalAuth(request: NextRequest): { user: JWTPayload | null } {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return { user: null };
  }

  const validation = validateToken(token);
  if (!validation.success) {
    return { user: null };
  }

  return { user: validation.payload };
}

// Check if user owns resource
export function requireOwnership(userId: string) {
  return function(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
    const auth = authenticateRequest(request);
    if (!auth.success) {
      return auth;
    }

    if (auth.user.userId !== userId && auth.user.role !== 'ADMIN') {
      return {
        success: false,
        response: NextResponse.json(
          createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Access denied - resource ownership required'),
          { status: 403 }
        )
      };
    }

    return auth;
  };
}

// Check if user can access resource (owner or admin)
export function requireAccess(userId: string) {
  return function(request: NextRequest): { success: true; user: JWTPayload } | { success: false; response: NextResponse } {
    const auth = authenticateRequest(request);
    if (!auth.success) {
      return auth;
    }

    if (auth.user.userId !== userId && auth.user.role !== 'ADMIN') {
      return {
        success: false,
        response: NextResponse.json(
          createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Access denied'),
          { status: 403 }
        )
      };
    }

    return auth;
  };
}
