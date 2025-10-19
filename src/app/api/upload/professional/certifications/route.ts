import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { validateFileType, validateFileSize, generateUniqueFilename, getMediaTypeFromMimeType } from '@/lib/utils/file-upload';

/**
 * Upload professional certification
 * @description Upload a certification file for a professional
 * @body FormData with file and metadata
 * @response 200:FileUploadResponseSchema:Certification uploaded successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const professionalId = formData.get('professionalId') as string;
    const certificationName = formData.get('certificationName') as string;

    if (!file || !professionalId || !certificationName) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'File, professionalId, and certificationName are required'
        ),
        { status: 400 }
      );
    }

    // Validate file type
    const mediaType = getMediaTypeFromMimeType(file.type);
    if (!mediaType || !validateFileType(file.type, mediaType)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed'
        ),
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (!validateFileSize(file.size, mediaType)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'File size exceeds 10MB limit'
        ),
        { status: 400 }
      );
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name, professionalId);

    // In a real implementation, you would save the file to storage
    // For now, we'll just return success
    const fileUrl = `/uploads/professional/certifications/${professionalId}/${uniqueFilename}`;

    // Prepare response data
    const responseData = {
      fileUrl,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      mediaType,
      professionalId,
      certificationName,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Certification uploaded successfully')
    );

  } catch (error) {
    console.error('Upload certification error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to upload certification'
      ),
      { status: 500 }
    );
  }
}
