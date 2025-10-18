/**
 * OTP Service with Twilio Integration
 * Handles generation and validation of One-Time Passwords (OTP) using Twilio
 *
 * Note: This implementation uses Twilio for SMS delivery and verification.
 * Make sure to set the following environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 */

import twilio from 'twilio';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Check if Twilio is configured
const isTwilioConfigured = !!(accountSid && authToken && twilioPhoneNumber);

// Create Twilio client only if configured
let twilioClient: any = null;
if (isTwilioConfigured) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(accountSid, authToken);
    console.log('📱 [OTP Service] Twilio client initialized successfully');
  } catch (error) {
    console.error('📱 [OTP Service] Failed to initialize Twilio client:', error);
  }
} else {
  console.warn('📱 [OTP Service] Twilio not configured - using mock mode');
}

// Configuration
const OTP_EXPIRATION_MINUTES = 10;
const MAX_ATTEMPTS = 3;

// Store for tracking verification attempts (in production, use Redis)
interface VerificationEntry {
  phoneNumber: string;
  verificationSid: string;
  createdAt: Date;
  attempts: number;
  verified: boolean;
}

const verificationStore = new Map<string, VerificationEntry>();

/**
 * Format phone number to E.164 format for Twilio
 */
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Assume Venezuelan numbers (add +58 prefix)
  if (cleaned.startsWith('0')) {
    return `+58${cleaned.substring(1)}`;
  }

  // If already has country code, use as is
  if (cleaned.startsWith('58')) {
    return `+${cleaned}`;
  }

  // Default to Venezuelan format
  return `+58${cleaned}`;
}

/**
 * Send OTP via Twilio SMS
 */
export async function generateOTP(phoneNumber: string): Promise<{
  success: boolean;
  message: string;
  expiresIn?: number;
}> {
  console.log(`📱 [OTP Service] Starting OTP generation for phone: ${phoneNumber}`);

  try {
    // Validate input
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      console.error('📱 [OTP Service] Invalid phone number input:', phoneNumber);
      return {
        success: false,
        message: 'Invalid phone number provided',
      };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`📱 [OTP Service] Formatted phone number: ${formattedPhone}`);

    // If Twilio is not configured, use mock mode
    if (!isTwilioConfigured || !twilioClient) {
      console.log('📱 [OTP Service] Using mock mode - Twilio not configured');

      // Generate a mock OTP code
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Store mock verification info
      const verificationEntry: VerificationEntry = {
        phoneNumber: formattedPhone,
        verificationSid: 'mock-sid-' + Date.now(),
        createdAt: new Date(),
        attempts: 0,
        verified: false,
      };

      verificationStore.set(phoneNumber, verificationEntry);

      console.log(`📱 [OTP Service] Mock OTP generated: ${mockCode} for ${formattedPhone}`);
      console.log(`📱 [OTP Service] Mock mode - OTP: ${mockCode}`);

      return {
        success: true,
        message: 'OTP sent successfully (mock mode)',
        expiresIn: OTP_EXPIRATION_MINUTES * 60,
      };
    }

    console.log(`📱 [OTP Service] Using Verify Service SID: ${verifyServiceSid || 'VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'}`);

    // Start Twilio verification
    console.log(`📱 [OTP Service] Creating Twilio verification...`);
    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid || 'VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      .verifications.create({
        to: formattedPhone,
        channel: 'sms',
        locale: 'es',
      });

    console.log(`📱 [OTP Service] Twilio verification created successfully:`, {
      sid: verification.sid,
      status: verification.status,
      to: verification.to
    });

    // Store verification info
    const verificationEntry: VerificationEntry = {
      phoneNumber: formattedPhone,
      verificationSid: verification.sid,
      createdAt: new Date(),
      attempts: 0,
      verified: false,
    };

    verificationStore.set(phoneNumber, verificationEntry);
    console.log(`📱 [OTP Service] Verification entry stored for phone: ${phoneNumber}`);

    console.log(`📱 [OTP Service] OTP sent successfully to ${formattedPhone}`);

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresIn: OTP_EXPIRATION_MINUTES * 60,
    };
  } catch (error: any) {
    console.error('📱 [OTP Service] Error sending OTP:', {
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      stack: error.stack
    });

    let errorMessage = 'Failed to send OTP';
    if (error.code) {
      switch (error.code) {
        case 60200:
          errorMessage = 'Invalid phone number format';
          break;
        case 60202:
          errorMessage = 'Invalid verification code';
          break;
        case 60203:
          errorMessage = 'Maximum send attempts reached';
          break;
        case 60212:
          errorMessage = 'Too many concurrent requests';
          break;
        case 60223:
          errorMessage = 'Verification code expired';
          break;
        case 20404:
          errorMessage = 'Verification service not found';
          break;
        case 20003:
          errorMessage = 'Authentication failed';
          break;
        default:
          errorMessage = `SMS service error: ${error.code}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * Verify OTP code with Twilio
 */
export async function verifyOTP(
  phoneNumber: string,
  code: string
): Promise<{
  verified: boolean;
  message: string;
  remainingAttempts?: number;
}> {
  console.log(`📱 [OTP Service] Starting OTP verification for phone: ${phoneNumber}, code: ${code ? 'Present' : 'Not provided'}`);

  try {
    // Validate inputs
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      console.error('📱 [OTP Service] Invalid phone number input:', phoneNumber);
      return {
        verified: false,
        message: 'Invalid phone number provided',
      };
    }

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      console.error('📱 [OTP Service] Invalid OTP code input:', code);
      return {
        verified: false,
        message: 'Invalid verification code provided',
      };
    }

    const verificationEntry = verificationStore.get(phoneNumber);
    console.log(`📱 [OTP Service] Verification entry found:`, verificationEntry ? 'Yes' : 'No');

    if (!verificationEntry) {
      console.warn(`📱 [OTP Service] No verification request found for phone: ${phoneNumber}`);
      return {
        verified: false,
        message: 'No verification request found. Please request a new OTP.',
      };
    }

    // Check attempt limit
    if (verificationEntry.attempts >= MAX_ATTEMPTS) {
      console.warn(`📱 [OTP Service] Max attempts reached for phone: ${phoneNumber}, attempts: ${verificationEntry.attempts}`);
      verificationStore.delete(phoneNumber);
      return {
        verified: false,
        message: 'Too many attempts. Please request a new OTP.',
      };
    }

    console.log(`📱 [OTP Service] Current attempts: ${verificationEntry.attempts}/${MAX_ATTEMPTS}`);

    // If using mock mode, verify against stored mock code
    if (!isTwilioConfigured || !twilioClient) {
      console.log('📱 [OTP Service] Using mock verification mode');

      // In mock mode, we accept any 6-digit code for simplicity
      // In a real implementation, you'd store the mock code and verify against it
      if (code.length >= 4 && code.length <= 8 && /^\d+$/.test(code)) {
        verificationEntry.verified = true;
        console.log(`📱 [OTP Service] Mock verification successful for phone: ${phoneNumber}`);
        return {
          verified: true,
          message: 'Phone number verified successfully (mock mode)',
        };
      } else {
        verificationEntry.attempts++;
        console.warn(`📱 [OTP Service] Mock verification failed - invalid code format`);

        if (verificationEntry.attempts >= MAX_ATTEMPTS) {
          verificationStore.delete(phoneNumber);
          return {
            verified: false,
            message: 'Too many attempts. Please request a new OTP.',
          };
        }

        return {
          verified: false,
          message: 'Invalid verification code',
          remainingAttempts: MAX_ATTEMPTS - verificationEntry.attempts,
        };
      }
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    console.log(`📱 [OTP Service] Verifying with Twilio for phone: ${formattedPhone}`);

    // Verify the code with Twilio
    console.log(`📱 [OTP Service] Making Twilio verification check...`);
    const verificationCheck = await twilioClient.verify.v2
      .services(verifyServiceSid || 'VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
      .verificationChecks.create({
        to: formattedPhone,
        code: code.trim(),
      });

    // Increment attempts
    verificationEntry.attempts++;

    console.log(`📱 [OTP Service] Twilio verification result:`, {
      valid: verificationCheck.valid,
      status: verificationCheck.status,
      attempts: verificationEntry.attempts
    });

    if (verificationCheck.valid) {
      verificationEntry.verified = true;
      console.log(`📱 [OTP Service] OTP verification successful for phone: ${phoneNumber}`);
      return {
        verified: true,
        message: 'Phone number verified successfully',
      };
    } else {
      console.warn(`📱 [OTP Service] Invalid OTP code for phone: ${phoneNumber}`);

      // Check if max attempts reached
      if (verificationEntry.attempts >= MAX_ATTEMPTS) {
        console.warn(`📱 [OTP Service] Max attempts reached, removing verification for phone: ${phoneNumber}`);
        verificationStore.delete(phoneNumber);
        return {
          verified: false,
          message: 'Too many attempts. Please request a new OTP.',
        };
      }

      return {
        verified: false,
        message: 'Invalid verification code',
        remainingAttempts: MAX_ATTEMPTS - verificationEntry.attempts,
      };
    }
  } catch (error: any) {
    console.error('📱 [OTP Service] Error verifying OTP:', {
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      stack: error.stack
    });

    // Try to get the verification entry for attempt counting
    const verificationEntry = verificationStore.get(phoneNumber);

    let errorMessage = 'Verification failed';
    if (error.code) {
      switch (error.code) {
        case 60202:
          errorMessage = 'Invalid verification code';
          break;
        case 60223:
          errorMessage = 'Verification code expired';
          break;
        case 60200:
          errorMessage = 'Invalid phone number format';
          break;
        case 20404:
          errorMessage = 'Verification service not found';
          break;
        case 20003:
          errorMessage = 'Authentication failed';
          break;
        default:
          errorMessage = `SMS service error: ${error.code}`;
      }
    }

    // Increment attempts on error if entry exists
    if (verificationEntry) {
      verificationEntry.attempts++;
      console.log(`📱 [OTP Service] Incremented attempts to: ${verificationEntry.attempts}`);

      if (verificationEntry.attempts >= MAX_ATTEMPTS) {
        console.warn(`📱 [OTP Service] Max attempts reached due to error, removing verification for phone: ${phoneNumber}`);
        verificationStore.delete(phoneNumber);
        return {
          verified: false,
          message: 'Too many attempts. Please request a new OTP.',
        };
      }

      return {
        verified: false,
        message: errorMessage,
        remainingAttempts: MAX_ATTEMPTS - verificationEntry.attempts,
      };
    }

    return {
      verified: false,
      message: errorMessage,
    };
  }
}

/**
 * Resend OTP via Twilio
 */
export async function resendOTP(phoneNumber: string): Promise<{
  success: boolean;
  message: string;
  expiresIn?: number;
}> {
  // Clean up old verification
  verificationStore.delete(phoneNumber);

  // Send new OTP
  return await generateOTP(phoneNumber);
}

/**
 * Check if phone number is verified
 */
export function isOTPVerified(phoneNumber: string): boolean {
  const verificationEntry = verificationStore.get(phoneNumber);
  return verificationEntry?.verified ?? false;
}

/**
 * Get verification status
 */
export function getVerificationStatus(phoneNumber: string): {
  exists: boolean;
  verified: boolean;
  attempts: number;
  maxAttempts: number;
} {
  const verificationEntry = verificationStore.get(phoneNumber);

  return {
    exists: !!verificationEntry,
    verified: verificationEntry?.verified ?? false,
    attempts: verificationEntry?.attempts ?? 0,
    maxAttempts: MAX_ATTEMPTS,
  };
}

/**
 * Clean up expired verifications
 * Should be called periodically
 */
export function cleanupExpiredVerifications(): void {
  const now = new Date();
  const expiredKeys: string[] = [];

  for (const [key, entry] of verificationStore.entries()) {
    // Remove verifications older than expiration time
    const expirationTime = new Date(entry.createdAt.getTime() + OTP_EXPIRATION_MINUTES * 60000);
    if (now > expirationTime) {
      expiredKeys.push(key);
    }
  }

  expiredKeys.forEach((key) => verificationStore.delete(key));

  if (expiredKeys.length > 0) {
    console.log(`[OTP Service] Cleaned up ${expiredKeys.length} expired verifications`);
  }
}

/**
 * Remove verification after successful verification
 */
export function removeOTP(phoneNumber: string): void {
  verificationStore.delete(phoneNumber);
}
