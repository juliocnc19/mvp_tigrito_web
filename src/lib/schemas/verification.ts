import { z } from 'zod';

// ID Verification Request Schema
export const IDVerificationRequestSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  cedula: z.string()
    .regex(/^\d{7,8}$/, 'Cédula must be 7-8 digits')
    .min(7, 'Cédula is required'),
  cedulaImage: z.string()
    .min(1, 'Cédula image is required')
    .refine(
      (data) => data.startsWith('data:image/'),
      'Invalid image format'
    ),
  faceScanData: z.string()
    .min(1, 'Face scan data is required')
    .refine(
      (data) => data.startsWith('data:') || data.length > 100,
      'Invalid face scan data'
    ),
});

// Phone Verification Request Schema
export const PhoneVerificationRequestSchema = z.object({
  phoneNumber: z.string()
    .regex(/^04\d{9}$/, 'Phone must be in format 04120386216')
    .min(11, 'Phone is required'),
});

// ID Verification Response Schema
export const IDVerificationResponseSchema = z.object({
  message: z.string(),
  verified: z.boolean(),
  verificationId: z.string().optional(),
});

// Phone Verification Response Schema
export const PhoneVerificationResponseSchema = z.object({
  message: z.string(),
  verified: z.boolean(),
});
