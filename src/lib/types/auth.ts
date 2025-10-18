import { z } from 'zod';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  GoogleAuthRequestSchema,
  UserSchema,
  AuthResponseSchema,
} from '@/lib/schemas/auth';

// Authentication Request Types
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type GoogleAuthRequest = z.infer<typeof GoogleAuthRequestSchema>;

// User Type
export type User = z.infer<typeof UserSchema>;

// Auth Response Type
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

// Verification Status Type
export interface VerificationStatus {
  isIDVerified: boolean;
  isPhoneVerified: boolean;
  completedAt?: Date;
}
