import { z } from 'zod';
import { validatePasswordStrength } from './password';

// Email validation
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

// Phone validation
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if phone number is between 10-15 digits
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { valid: false, error: 'Phone number must be between 10-15 digits' };
  }
  
  return { valid: true };
}

// Name validation
export function validateName(name: string): { valid: boolean; error?: string } {
  if (name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { valid: false, error: 'Name must be less than 50 characters' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { valid: true };
}

// Role validation
export function validateRole(role: string): { valid: boolean; error?: string } {
  const validRoles = ['CLIENT', 'PROFESSIONAL', 'ADMIN'];
  if (!validRoles.includes(role)) {
    return { valid: false, error: 'Invalid role. Must be CLIENT, PROFESSIONAL, or ADMIN' };
  }
  return { valid: true };
}

// User registration validation
export function validateUserRegistration(data: {
  email: string;
  password: string;
  name: string;
  role?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error!);
  }

  // Validate password
  const passwordValidation = validatePasswordStrength(data.password);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }

  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) {
    errors.push(nameValidation.error!);
  }

  // Validate role if provided
  if (data.role) {
    const roleValidation = validateRole(data.role);
    if (!roleValidation.valid) {
      errors.push(roleValidation.error!);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// User login validation
export function validateUserLogin(data: {
  email?: string;
  phone?: string;
  password: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that either email or phone is provided
  if (!data.email && !data.phone) {
    errors.push('Either email or phone must be provided');
  }

  // Validate email if provided
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
      errors.push(emailValidation.error!);
    }
  }

  // Validate phone if provided
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) {
      errors.push(phoneValidation.error!);
    }
  }

  // Validate password (basic check)
  if (!data.password || data.password.length < 1) {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Password reset validation
export function validatePasswordReset(data: {
  token: string;
  newPassword: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate token
  if (!data.token || data.token.length < 1) {
    errors.push('Reset token is required');
  }

  // Validate new password
  const passwordValidation = validatePasswordStrength(data.newPassword);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Email verification validation
export function validateEmailVerification(data: {
  token: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate token
  if (!data.token || data.token.length < 1) {
    errors.push('Verification token is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Forgot password validation
export function validateForgotPassword(data: {
  email: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error!);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// JWT token validation
export function validateJWTToken(token: string): { valid: boolean; error?: string } {
  if (!token || token.length < 1) {
    return { valid: false, error: 'Token is required' };
  }

  // Basic JWT format validation (3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token format' };
  }

  return { valid: true };
}

// Refresh token validation
export function validateRefreshToken(token: string): { valid: boolean; error?: string } {
  return validateJWTToken(token);
}

// User ID validation
export function validateUserId(userId: string): { valid: boolean; error?: string } {
  if (!userId || userId.length < 1) {
    return { valid: false, error: 'User ID is required' };
  }

  // Basic ID format validation (should be a valid string)
  if (typeof userId !== 'string') {
    return { valid: false, error: 'User ID must be a string' };
  }

  return { valid: true };
}
