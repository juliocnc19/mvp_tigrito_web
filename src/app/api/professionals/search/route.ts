import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { searchProfessionals } from '@/lib/db/queries/professional';

export async function GET(request: NextRequest) {
  try {
    // Optional authentication (public endpoint)
    const auth = optionalAuth(request);

    // Get search query parameter
    const searchTerm = request.nextUrl.searchParams.get('q');

    if (!searchTerm || searchTerm.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Search query (q) parameter is required and cannot be empty'
        ),
        { status: 422 }
      );
    }

    // Search professionals
    const professionals = await searchProfessionals(searchTerm);

    // Prepare response data
    const responseData = {
      professionals,
      total: professionals.length,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professionals search results retrieved successfully')
    );

  } catch (error) {
    console.error('Search professionals error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to search professionals'
      ),
      { status: 500 }
    );
  }
}

