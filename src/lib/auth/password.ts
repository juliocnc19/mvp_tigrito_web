import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;
const PASSWORD_RESET_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Password verification
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Generate password reset token
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate password reset token with expiry
export function generatePasswordResetTokenWithExpiry(): { token: string; expiresAt: Date } {
  const token = generatePasswordResetToken();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY);
  
  return { token, expiresAt };
}

// Hash password reset token for storage
export function hashPasswordResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Verify password reset token
export function verifyPasswordResetToken(token: string, hashedToken: string): boolean {
  const hashedInput = hashPasswordResetToken(token);
  return hashedInput === hashedToken;
}

// Generate email verification token
export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate email verification token with expiry
export function generateEmailVerificationTokenWithExpiry(): { token: string; expiresAt: Date } {
  const token = generateEmailVerificationToken();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY); // Same expiry as password reset
  
  return { token, expiresAt };
}

// Hash email verification token for storage
export function hashEmailVerificationToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Verify email verification token
export function verifyEmailVerificationToken(token: string, hashedToken: string): boolean {
  const hashedInput = hashEmailVerificationToken(token);
  return hashedInput === hashedToken;
}

// Check if token is expired
export function isTokenExpired(expiresAt: Date): boolean {
  return Date.now() > expiresAt.getTime();
}

// Generate secure random string
export function generateSecureRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Generate API key
export function generateApiKey(): string {
  const prefix = 'tigrito_';
  const randomPart = crypto.randomBytes(16).toString('hex');
  return `${prefix}${randomPart}`;
}

// Hash API key for storage
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// Verify API key
export function verifyApiKey(apiKey: string, hashedApiKey: string): boolean {
  const hashedInput = hashApiKey(apiKey);
  return hashedInput === hashedApiKey;
}
