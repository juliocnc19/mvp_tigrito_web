import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, COMMON_ERROR_CODES } from '@/lib/utils/response';
import { optionalAuth } from '@/lib/auth/middleware';
import { getProfessionalServiceById } from '@/lib/db/queries/professional-service';
import { createServiceTransaction } from '@/lib/db/queries/service';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const RequestProfessionalServiceSchema = z.object({
  professionalServiceId: z.string(),
  agreedPrice: z.number().min(0),
  scheduledDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  promoCodeId: z.string().optional(),
});

/**
 * Request professional service directly
 * @description Create a service transaction directly from a professional service
 * @body RequestProfessionalServiceSchema
 * @response 201:Transaction created successfully
 * @responseSet auth
 * @security BearerAuth
 * @openapi
 */
export async function POST(request: NextRequest) {
  try {
    const auth = optionalAuth(request);

    if (!auth?.user?.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = RequestProfessionalServiceSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        createErrorResponse(
          COMMON_ERROR_CODES.VALIDATION_ERROR,
          'Invalid request body',
          validation.error.issues
        ),
        { status: 422 }
      );
    }

    const { professionalServiceId, agreedPrice, scheduledDate, notes, promoCodeId } = validation.data;

    // Get the professional service
    const professionalService = await getProfessionalServiceById(professionalServiceId);
    if (!professionalService) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Professional service not found'),
        { status: 404 }
      );
    }

    // Check if service is active
    if (!professionalService.isActive) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.CONFLICT, 'Service is not available'),
        { status: 409 }
      );
    }

    // Check if user is not the service owner
    if (professionalService.professionalId === auth.user.userId) {
      return NextResponse.json(
        createErrorResponse(COMMON_ERROR_CODES.FORBIDDEN, 'Cannot request your own service'),
        { status: 403 }
      );
    }

    // Validate promo code if provided
    let promoCode = null;
    if (promoCodeId) {
      promoCode = await prisma.promoCode.findFirst({
        where: {
          id: promoCodeId,
          isActive: true,
          validFrom: { lte: new Date() },
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } }
          ],
        },
      });

      if (!promoCode) {
        return NextResponse.json(
          createErrorResponse(COMMON_ERROR_CODES.NOT_FOUND, 'Invalid or expired promo code'),
          { status: 404 }
        );
      }
    }

    // Calculate platform fee (example: 5% of agreed price)
    const platformFee = agreedPrice * 0.05;
    const escrowAmount = agreedPrice + platformFee;

    // Create service transaction
    const transaction = await prisma.serviceTransaction.create({
      data: {
        clientId: auth.user.userId,
        professionalId: professionalService.professionalId,
        proServiceId: professionalServiceId,
        priceAgreed: agreedPrice,
        agreedPrice: agreedPrice,
        platformFee: platformFee,
        escrowAmount: escrowAmount,
        currentStatus: 'PENDING_SOLICITUD',
        status: 'PENDING_SOLICITUD',
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        notes: notes,
        promoCodeId: promoCodeId,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        professional: { select: { id: true, name: true, email: true } },
        proService: { select: { id: true, title: true, price: true } },
      },
    });

    return NextResponse.json(
      createSuccessResponse(
        {
          transaction: {
            id: transaction.id,
            clientId: transaction.clientId,
            professionalId: transaction.professionalId,
            proServiceId: transaction.proServiceId,
            priceAgreed: transaction.priceAgreed.toNumber(),
            platformFee: transaction.platformFee.toNumber(),
            escrowAmount: transaction.escrowAmount.toNumber(),
            status: transaction.status,
            scheduledDate: transaction.scheduledDate?.toISOString() || null,
            notes: transaction.notes,
            promoCodeId: transaction.promoCodeId,
            createdAt: transaction.createdAt.toISOString(),
            client: transaction.client,
            professional: transaction.professional,
            proService: transaction.proService,
          },
        },
        'Service request created successfully'
      ),
      { status: 201 }
    );

  } catch (error) {
    console.error('Request professional service error:', error);
    return NextResponse.json(
      createErrorResponse(
        COMMON_ERROR_CODES.INTERNAL_ERROR,
        'Failed to create service request'
      ),
      { status: 500 }
    );
  }
}
