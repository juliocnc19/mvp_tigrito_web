import { prisma } from '../prisma';
import { Media, Prisma } from '@prisma/client';
import { GetMediaQuerySchema } from '@/lib/schemas/media';
import { z } from 'zod';

// Create media
export async function createMedia(data: {
  url: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  filename?: string;
  sizeBytes?: number;
  uploadedById?: string;
  postingId?: string;
  proServiceId?: string;
  transactionId?: string;
  reportId?: string;
}): Promise<Media> {
  return prisma.media.create({
    data: {
      url: data.url,
      type: data.type,
      filename: data.filename,
      sizeBytes: data.sizeBytes,
      uploadedById: data.uploadedById,
      postingId: data.postingId,
      proServiceId: data.proServiceId,
      transactionId: data.transactionId,
      reportId: data.reportId,
    },
  });
}

// Get media by ID
export async function getMediaById(id: string): Promise<Media | null> {
  return prisma.media.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      posting: {
        select: {
          id: true,
          title: true,
        },
      },
      proService: {
        select: {
          id: true,
          title: true,
        },
      },
      transaction: {
        select: {
          id: true,
        },
      },
      report: {
        select: {
          id: true,
          reason: true,
        },
      },
    },
  });
}

// Delete media
export async function deleteMedia(id: string): Promise<Media> {
  return prisma.media.delete({
    where: { id },
  });
}

// Get media with filters and pagination
export async function getMedia(query: z.infer<typeof GetMediaQuerySchema>): Promise<{
  media: Media[];
  total: number;
}> {
  const { page, limit, type, uploadedById, postingId, proServiceId, transactionId, reportId } = query;
  
  const where: Prisma.MediaWhereInput = {};

  // Type filter
  if (type) {
    where.type = type;
  }

  // Uploaded by filter
  if (uploadedById) {
    where.uploadedById = uploadedById;
  }

  // Posting filter
  if (postingId) {
    where.postingId = postingId;
  }

  // Pro service filter
  if (proServiceId) {
    where.proServiceId = proServiceId;
  }

  // Transaction filter
  if (transactionId) {
    where.transactionId = transactionId;
  }

  // Report filter
  if (reportId) {
    where.reportId = reportId;
  }

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        posting: {
          select: {
            id: true,
            title: true,
          },
        },
        proService: {
          select: {
            id: true,
            title: true,
          },
        },
        transaction: {
          select: {
            id: true,
          },
        },
        report: {
          select: {
            id: true,
            reason: true,
          },
        },
      },
    }),
    prisma.media.count({ where }),
  ]);

  return { media, total };
}

// Get media by type
export async function getMediaByType(type: 'IMAGE' | 'VIDEO' | 'DOCUMENT'): Promise<Media[]> {
  return prisma.media.findMany({
    where: { type },
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

// Get media by user
export async function getMediaByUser(uploadedById: string): Promise<Media[]> {
  return prisma.media.findMany({
    where: { uploadedById },
    orderBy: { createdAt: 'desc' },
  });
}

// Get media statistics
export async function getMediaStats(): Promise<{
  total: number;
  images: number;
  videos: number;
  documents: number;
  totalSize: number;
  averageSize: number;
}> {
  const [total, images, videos, documents, sizeStats] = await Promise.all([
    prisma.media.count(),
    prisma.media.count({ where: { type: 'IMAGE' } }),
    prisma.media.count({ where: { type: 'VIDEO' } }),
    prisma.media.count({ where: { type: 'DOCUMENT' } }),
    prisma.media.aggregate({
      _sum: { sizeBytes: true },
      _avg: { sizeBytes: true },
    }),
  ]);

  return {
    total,
    images,
    videos,
    documents,
    totalSize: sizeStats._sum.sizeBytes || 0,
    averageSize: sizeStats._avg.sizeBytes || 0,
  };
}

// Get recent media
export async function getRecentMedia(limit: number = 10): Promise<Media[]> {
  return prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      uploadedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

// Get media by posting
export async function getMediaByPosting(postingId: string): Promise<Media[]> {
  return prisma.media.findMany({
    where: { postingId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get media by pro service
export async function getMediaByProService(proServiceId: string): Promise<Media[]> {
  return prisma.media.findMany({
    where: { proServiceId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get media by transaction
export async function getMediaByTransaction(transactionId: string): Promise<Media[]> {
  return prisma.media.findMany({
    where: { transactionId },
    orderBy: { createdAt: 'desc' },
  });
}

// Get media by report
export async function getMediaByReport(reportId: string): Promise<Media[]> {
  return prisma.media.findMany({
    where: { reportId },
    orderBy: { createdAt: 'desc' },
  });
}
