import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Verify/Unverify user by ID
 * @description Toggle user verification status
 * @param {string} id - User ID
 * @response 200:User verification updated successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'User ID is required'
        ),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isVerified, isIDVerified } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'User not found'
        ),
        { status: 404 }
      );
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(isVerified !== undefined && { isVerified }),
        ...(isIDVerified !== undefined && { isIDVerified }),
      },
    });

    // Map user data
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email ?? null,
      phone: updatedUser.phone ?? null,
      name: updatedUser.name ?? null,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      isIDVerified: updatedUser.isIDVerified,
      balance: updatedUser.balance.toNumber(),
      isSuspended: updatedUser.isSuspended,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      deletedAt: updatedUser.deletedAt?.toISOString() || null,
      locationLat: updatedUser.locationLat ?? null,
      locationLng: updatedUser.locationLng ?? null,
      locationAddress: updatedUser.locationAddress ?? null,
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'User verification updated successfully',
    });

  } catch (error) {
    console.error('Update user verification error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update user verification'
      ),
      { status: 500 }
    );
  }
}
