import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { markAllProfessionalNotificationsAsRead } from '@/lib/db/queries/professional';

/**
 * Mark all professional notifications as read
 * @description Mark all notifications as read for the authenticated professional
 * @response 200:Success response:All notifications marked as read successfully
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

    // Mark all notifications as read
    const result = await markAllProfessionalNotificationsAsRead(professionalId);

    return NextResponse.json(
      createSuccessResponse(
        { updatedCount: result.count },
        'All professional notifications marked as read successfully'
      )
    );

  } catch (error) {
    console.error('Mark all professional notifications as read error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to mark all professional notifications as read'
      ),
      { status: 500 }
    );
  }
}