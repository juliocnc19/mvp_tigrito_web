import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { validateFileType, validateFileSize, generateUniqueFilename, getMediaTypeFromMimeType } from '@/lib/utils/file-upload';

/**
 * Upload portfolio images for professional
 * @description Upload multiple images for professional portfolio
 * @response 201:MultipleFileUploadResponseSchema:Files uploaded successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Get professionalId from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'At least one file is required'
        ),
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Maximum 10 files allowed'
        ),
        { status: 400 }
      );
    }

    // Validate and process each file
    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file type
        const mediaType = getMediaTypeFromMimeType(file.type);
        if (!mediaType || mediaType !== 'IMAGE') {
          errors.push(`File ${file.name}: Only image files are allowed`);
          continue;
        }

        // Validate file size
        if (!validateFileSize(file.size, mediaType)) {
          errors.push(`File ${file.name}: File size exceeds limit (10MB for images)`);
          continue;
        }

        // Generate unique filename
        const uniqueFilename = generateUniqueFilename(file.name, professionalId);

        // For now, simulate file upload - in production this would upload to cloud storage
        // TODO: Implement actual cloud storage upload (AWS S3, Cloudinary, etc.)
        const fileUrl = `https://storage.example.com/professional-portfolio/${uniqueFilename}`;

        uploadedFiles.push({
          fileUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        });

      } catch (fileError) {
        console.error('Error processing file:', file.name, fileError);
        errors.push(`File ${file.name}: Processing failed`);
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No valid files were uploaded',
          errors
        ),
        { status: 400 }
      );
    }

    // Prepare response data
    const responseData = {
      files: uploadedFiles,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, `${uploadedFiles.length} files uploaded successfully`),
      { status: 201 }
    );

  } catch (error) {
    console.error('Portfolio upload error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to upload portfolio files'
      ),
      { status: 500 }
    );
  }
}
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { validateFileType, validateFileSize, generateUniqueFilename, getMediaTypeFromMimeType } from '@/lib/utils/file-upload';

/**
 * Upload portfolio images for professional
 * @description Upload multiple images for professional portfolio
 * @response 201:MultipleFileUploadResponseSchema:Files uploaded successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    // Get professionalId from query parameters
    const professionalId = request.nextUrl.searchParams.get('professionalId');

    if (!professionalId) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'professionalId query parameter is required'
        ),
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'At least one file is required'
        ),
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Maximum 10 files allowed'
        ),
        { status: 400 }
      );
    }

    // Validate and process each file
    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file type
        const mediaType = getMediaTypeFromMimeType(file.type);
        if (!mediaType || mediaType !== 'IMAGE') {
          errors.push(`File ${file.name}: Only image files are allowed`);
          continue;
        }

        // Validate file size
        if (!validateFileSize(file.size, mediaType)) {
          errors.push(`File ${file.name}: File size exceeds limit (10MB for images)`);
          continue;
        }

        // Generate unique filename
        const uniqueFilename = generateUniqueFilename(file.name, professionalId);

        // For now, simulate file upload - in production this would upload to cloud storage
        // TODO: Implement actual cloud storage upload (AWS S3, Cloudinary, etc.)
        const fileUrl = `https://storage.example.com/professional-portfolio/${uniqueFilename}`;

        uploadedFiles.push({
          fileUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        });

      } catch (fileError) {
        console.error('Error processing file:', file.name, fileError);
        errors.push(`File ${file.name}: Processing failed`);
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'No valid files were uploaded',
          errors
        ),
        { status: 400 }
      );
    }

    // Prepare response data
    const responseData = {
      files: uploadedFiles,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, `${uploadedFiles.length} files uploaded successfully`),
      { status: 201 }
    );

  } catch (error) {
    console.error('Portfolio upload error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to upload portfolio files'
      ),
      { status: 500 }
    );
  }
}


