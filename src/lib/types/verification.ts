import { z } from 'zod';
import {
  IDVerificationRequestSchema,
  PhoneVerificationRequestSchema,
  IDVerificationResponseSchema,
  PhoneVerificationResponseSchema,
} from '@/lib/schemas/verification';
import {
  OTPSendRequestSchema,
  OTPVerifyRequestSchema,
  OTPSendResponseSchema,
  OTPVerifyResponseSchema,
} from '@/lib/schemas/otp';

// ID Verification Types
export type IDVerificationRequest = z.infer<typeof IDVerificationRequestSchema>;
export type IDVerificationResponse = z.infer<typeof IDVerificationResponseSchema>;

// Phone Verification Types
export type PhoneVerificationRequest = z.infer<typeof PhoneVerificationRequestSchema>;
export type PhoneVerificationResponse = z.infer<typeof PhoneVerificationResponseSchema>;

// OTP Types
export type OTPSendRequest = z.infer<typeof OTPSendRequestSchema>;
export type OTPVerifyRequest = z.infer<typeof OTPVerifyRequestSchema>;
export type OTPSendResponse = z.infer<typeof OTPSendResponseSchema>;
export type OTPVerifyResponse = z.infer<typeof OTPVerifyResponseSchema>;

// Verification Step Type
export type VerificationStep = 'intro' | 'id' | 'phone' | 'otp' | 'completed';

// Verification Context Type
export interface VerificationContextType {
  currentStep: VerificationStep;
  cedula: string | null;
  phoneNumber: string | null;
  isIDVerified: boolean;
  isPhoneVerified: boolean;
  isLoading: boolean;
  error: string | null;
  setCedula: (cedula: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  verifyID: (cedula: string, image: string, faceScan: string) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, code: string) => Promise<void>;
  skipVerification: () => void;
}
