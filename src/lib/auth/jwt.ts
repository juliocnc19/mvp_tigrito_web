import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// JWT Payload Schema
export const JWTPayloadSchema = z.object({
  userId: z.string(),
  role: z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  iat: z.number(),
  exp: z.number(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

// Token Generation
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
}

// Token Validation
export function validateToken(token: string): { success: true; payload: JWTPayload } | { success: false; error: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const validatedPayload = JWTPayloadSchema.parse(decoded);
    return { success: true, payload: validatedPayload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'Token expired' };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'Invalid token' };
    } else {
      return { success: false, error: 'Token validation failed' };
    }
  }
}

// Token Refresh
export function refreshToken(refreshToken: string): { success: true; accessToken: string } | { success: false; error: string } {
  const validation = validateToken(refreshToken);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const { userId, role, email, phone } = validation.payload;
  const newAccessToken = generateAccessToken({ userId, role, email, phone });
  
  return { success: true, accessToken: newAccessToken };
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

// Get token expiration time
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}
