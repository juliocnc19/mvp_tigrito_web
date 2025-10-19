import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, COMMON_ERROR_CODES, createSuccessResponse } from '@/lib/utils/response';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Schema for creating a user
const CreateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  role: z.enum(['CLIENT', 'PROFESSIONAL', 'ADMIN']),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  locationAddress: z.string().optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
});

/**
 * Create a new user
 * @description Create a new user in the system
 * @body CreateUserSchema
 * @response 201:User created successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 [POST /api/users] Request body:', body);
    
    // Validate request body
   

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { phone: body.phone },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Ya existe un usuario con este email o teléfono'
        ),
        { status: 409 }
      );
    }


    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        password: body.password,
        locationAddress: body.locationAddress ?? null,
        locationLat: body.locationLat ?? null,
        locationLng: body.locationLng ?? null,
        isVerified: body.role === 'ADMIN', // Auto-verify admins
        isIDVerified: false,
        balance: 0,
        isSuspended: false,
      },
    });

    // Map user data for response
    const userData = {
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      name: newUser.name,
      role: newUser.role,
      isVerified: newUser.isVerified,
      isIDVerified: newUser.isIDVerified,
      balance: newUser.balance.toNumber(),
      isSuspended: newUser.isSuspended,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
      deletedAt: newUser.deletedAt?.toISOString() || null,
      locationLat: newUser.locationLat,
      locationLng: newUser.locationLng,
      locationAddress: newUser.locationAddress,
    };

    return NextResponse.json(
      createSuccessResponse(
        userData,
        'Usuario creado exitosamente'
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al crear usuario'
      ),
      { status: 500 }
    );
  }
}

/**
 * Get all users (for admin)
 * @description Retrieve all users with pagination and filters
 * @query page, limit, role, isVerified, search, locationLat, locationLng, radius
 * @response 200:Users retrieved successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const isVerified = searchParams.get('isVerified');
    const search = searchParams.get('search');
    const locationLat = searchParams.get('locationLat');
    const locationLng = searchParams.get('locationLng');
    const radius = parseInt(searchParams.get('radius') || '10');

    // Build where clause
    const where: any = {
      deletedAt: null, // Only non-deleted users
    };

    if (role && role !== 'all') {
      where.role = role;
    }

    if (isVerified && isVerified !== 'all') {
      where.isVerified = isVerified === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Map users data
    const usersData = users.map(user => ({
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
    }));

    return NextResponse.json(
      createSuccessResponse(
        usersData,
        'Usuarios obtenidos exitosamente',
        {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      )
    );

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Error interno del servidor al obtener usuarios'
      ),
      { status: 500 }
    );
  }
}
