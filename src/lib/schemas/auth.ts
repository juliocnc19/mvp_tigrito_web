import { z } from 'zod';
import { RoleSchema } from './common';

// Register Request Schema
export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: RoleSchema.default('CLIENT'),
});

// Login Request Schema
export const LoginRequestSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string(),
}).refine(
  (data) => data.email || data.phone,
  { message: "Either email or phone must be provided" }
);

// Refresh Token Request Schema
export const RefreshTokenRequestSchema = z.object({
  token: z.string(),
});

// Google Auth Request Schema
export const GoogleAuthRequestSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
  idToken: z.string().optional(),
});

// Forgot Password Request Schema
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

// Reset Password Request Schema
export const ResetPasswordRequestSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

// Email Verification Request Schema
export const EmailVerificationRequestSchema = z.object({
  token: z.string(),
});

// User Schema
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

// Auth Response Schemas
export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  refreshToken: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  token: z.string(),
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});
