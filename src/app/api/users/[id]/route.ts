import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';

/**
 * Delete user by ID
 * @description Soft delete a user by setting deletedAt timestamp
 * @param {string} id - User ID
 * @response 200:User deleted successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function DELETE(
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

    // Soft delete the user
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to delete user'
      ),
      { status: 500 }
    );
  }
}

/**
 * Get user by ID
 * @description Retrieve a specific user by ID
 * @param {string} id - User ID
 * @response 200:User retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(
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

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        professionalProfile: true,
        clientProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.NOT_FOUND,
          'User not found'
        ),
        { status: 404 }
      );
    }

    // Map user data
    const userData = {
      id: user.id,
      email: user.email ?? null,
      phone: user.phone ?? null,
      name: user.name ?? null,
      role: user.role,
      isVerified: user.isVerified,
      isIDVerified: user.isIDVerified,
      balance: user.balance.toNumber(),
      isSuspended: user.isSuspended,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString() || null,
      locationLat: user.locationLat ?? null,
      locationLng: user.locationLng ?? null,
      locationAddress: user.locationAddress ?? null,
      professionalProfile: user.professionalProfile,
      clientProfile: user.clientProfile,
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'User retrieved successfully',
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to retrieve user'
      ),
      { status: 500 }
    );
  }
}

/**
 * Update user by ID
 * @description Update a specific user by ID
 * @param {string} id - User ID
 * @response 200:User updated successfully
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
    const { name, phone, locationLat, locationLng, locationAddress } = body;

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

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(locationLat !== undefined && { locationLat }),
        ...(locationLng !== undefined && { locationLng }),
        ...(locationAddress !== undefined && { locationAddress }),
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
      message: 'User updated successfully',
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to update user'
      ),
      { status: 500 }
    );
  }
}