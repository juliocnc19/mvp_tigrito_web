import { z } from 'zod';

// Report Schema
export const ReportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  reportedId: z.string().nullable(),
  serviceId: z.string().nullable(),
  reason: z.string(),
  proofMedia: z.any().nullable(),
  status: z.string(),
  adminNotes: z.string().nullable(),
  createdAt: z.string().datetime(),
});

// Create Report Request
export const CreateReportRequestSchema = z.object({
  reportedId: z.string().optional(),
  serviceId: z.string().optional(),
  reason: z.string().min(10),
  proofMedia: z.any().optional(),
  mediaIds: z.array(z.string()).optional(),
}).refine(
  (data) => data.reportedId || data.serviceId,
  { message: "Either reportedId or serviceId must be provided" }
);

// Update Report Status Request
export const UpdateReportStatusRequestSchema = z.object({
  status: z.string(),
  adminNotes: z.string().optional(),
});

// Get Reports Query Schema
export const GetReportsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  reporterId: z.string().optional(),
  reportedId: z.string().optional(),
  serviceId: z.string().optional(),
  status: z.string().optional(),
});
