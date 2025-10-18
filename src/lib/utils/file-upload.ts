import { z } from 'zod';
import { MediaTypeSchema } from '@/lib/schemas/common';

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 25 * 1024 * 1024, // 25MB
} as const;

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as string[],
  VIDEO: ['video/mp4', 'video/mov', 'video/avi'] as string[],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'] as string[],
};

export function validateFileType(
  mimeType: string,
  mediaType: z.infer<typeof MediaTypeSchema>
): boolean {
  const allowedTypes = ALLOWED_FILE_TYPES[mediaType];
  return allowedTypes.includes(mimeType);
}

export function validateFileSize(
  size: number,
  mediaType: z.infer<typeof MediaTypeSchema>
): boolean {
  const maxSize = FILE_SIZE_LIMITS[mediaType];
  return size <= maxSize;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function generateUniqueFilename(
  originalName: string,
  userId: string
): string {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${userId}_${timestamp}_${randomString}.${extension}`;
}

export function getMediaTypeFromMimeType(mimeType: string): z.infer<typeof MediaTypeSchema> | null {
  if (ALLOWED_FILE_TYPES.IMAGE.includes(mimeType)) return 'IMAGE';
  if (ALLOWED_FILE_TYPES.VIDEO.includes(mimeType)) return 'VIDEO';
  if (ALLOWED_FILE_TYPES.DOCUMENT.includes(mimeType)) return 'DOCUMENT';
  return null;
}
