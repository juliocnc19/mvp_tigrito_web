-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN_AI_HANDLING', 'PENDING_HUMAN_ASSIGNMENT', 'ACTIVE_HUMAN_CHAT', 'CLOSED_RESOLVED', 'CLOSED_BY_CLIENT');

-- AlterTable
ALTER TABLE "Profession" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "ProfessionalService" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "ServicePosting" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "document_url" TEXT,
ADD COLUMN     "perfil_foto_url" TEXT;

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN_AI_HANDLING',
    "escalationReason" TEXT,
    "initialSummary" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_conversationId_key" ON "SupportTicket"("conversationId");

-- CreateIndex
CREATE INDEX "SupportTicket_assignedToId_idx" ON "SupportTicket"("assignedToId");

-- CreateIndex
CREATE INDEX "SupportTicket_clientId_idx" ON "SupportTicket"("clientId");

-- CreateIndex
CREATE INDEX "SupportTicket_conversationId_idx" ON "SupportTicket"("conversationId");

-- CreateIndex
CREATE INDEX "SupportTicket_openedAt_idx" ON "SupportTicket"("openedAt");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
