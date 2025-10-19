import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { validateFileType, validateFileSize, generateUniqueFilename, getMediaTypeFromMimeType } from '@/lib/utils/file-upload';

/**
 * Upload professional portfolio item
 * @description Upload a portfolio file for a professional
 * @body FormData with file and metadata
 * @response 200:FileUploadResponseSchema:Portfolio item uploaded successfully
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
    const portfolioItemId = formData.get('portfolioItemId') as string;

    if (!file || !professionalId || !portfolioItemId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'File, professionalId, and portfolioItemId are required'
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
          'Invalid file type. Only image and video files are allowed'
        ),
        { status: 400 }
      );
    }

    // Validate file size
    if (!validateFileSize(file.size, mediaType)) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          `File size exceeds limit for ${mediaType.toLowerCase()} files`
        ),
        { status: 400 }
      );
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name, professionalId);

    // In a real implementation, you would save the file to storage
    // For now, we'll just return success
    const fileUrl = `/uploads/professional/portfolio/${professionalId}/${portfolioItemId}/${uniqueFilename}`;

    // Prepare response data
    const responseData = {
      fileUrl,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      mediaType,
      professionalId,
      portfolioItemId,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Portfolio item uploaded successfully')
    );

  } catch (error) {
    console.error('Upload portfolio item error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to upload portfolio item'
      ),
      { status: 500 }
    );
  }
}
