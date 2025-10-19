import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalNotifications, getProfessionalUnreadNotificationsCount } from '@/lib/db/queries/professional';

/**
 * Get professional notifications
 * @description Retrieve notifications for the authenticated professional
 * @response 200:ProfessionalNotificationsListResponseSchema:Notifications retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
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

    // Get limit from query parameters (default 50)
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');

    // Get notifications for the professional
    const notifications = await getProfessionalNotifications(professionalId, limit);

    // Get unread count
    const unreadCount = await getProfessionalUnreadNotificationsCount(professionalId);

    // Prepare response data
    const responseData = {
      notifications: notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
      })),
      total: notifications.length,
      unreadCount,
    };

    return NextResponse.json(
      createSuccessResponse(responseData, 'Professional notifications retrieved successfully')
    );

  } catch (error) {
    console.error('Get professional notifications error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve professional notifications'
      ),
      { status: 500 }
    );
  }
}