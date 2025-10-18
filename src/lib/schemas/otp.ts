import { z } from 'zod';

// OTP Send Request Schema
export const OTPSendRequestSchema = z.object({
  phoneNumber: z.string()
    .regex(/^04\d{9}$/, 'Phone must be in format 04120386216')
    .min(11, 'Phone is required'),
});

// OTP Verify Request Schema
export const OTPVerifyRequestSchema = z.object({
  phoneNumber: z.string()
    .regex(/^04\d{9}$/, 'Phone must be in format 04120386216')
    .min(8, 'Phone is required'),
  otpCode: z.string()
});

// OTP Send Response Schema
export const OTPSendResponseSchema = z.object({
  message: z.string(),
  expiresIn: z.number(),
});

// OTP Verify Response Schema
export const OTPVerifyResponseSchema = z.object({
  message: z.string(),
  verified: z.boolean(),
});

// OTP Data Schema (for internal use)
export const OTPDataSchema = z.object({
  code: z.string().regex(/^\d{5}$/),
  phoneNumber: z.string(),
  createdAt: z.date(),
  expiresAt: z.date(),
  attempts: z.number().min(0),
  verified: z.boolean(),
});
