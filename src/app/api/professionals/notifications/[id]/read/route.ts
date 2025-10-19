import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { markProfessionalNotificationAsRead } from '@/lib/db/queries/professional';

/**
 * Mark professional notification as read
 * @description Mark a specific notification as read for the authenticated professional
 * @response 200:Success response:Notification marked as read successfully
 * @add 404:Notification not found
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Mark notification as read
    const updatedNotification = await markProfessionalNotificationAsRead(id);

    if (!updatedNotification) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'Professional notification not found'
        ),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createSuccessResponse(
        { notification: updatedNotification },
        'Professional notification marked as read successfully'
      )
    );

  } catch (error) {
    console.error('Mark professional notification as read error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to mark professional notification as read'
      ),
      { status: 500 }
    );
  }
}