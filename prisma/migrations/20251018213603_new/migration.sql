/*
  Warnings:

  - A unique constraint covering the columns `[jobId,reviewerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('CLIENT_PROFESSIONAL', 'SUPPORT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_transactionId_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "jobId" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "ConversationType" DEFAULT 'CLIENT_PROFESSIONAL',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "content" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "messageType" "MessageType" DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "jobId" TEXT,
ALTER COLUMN "transactionId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "agent_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 1000,
    "topP" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "personality" TEXT,
    "tools" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_logs" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "userId" TEXT NOT NULL,
    "toolName" TEXT,
    "action" TEXT NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "duration" INTEGER,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "toolCalls" JSONB,
    "toolResults" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_metrics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_personalities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "tools" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_personalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "budget" DECIMAL(14,2),
    "budgetMin" DECIMAL(14,2),
    "budgetMax" DECIMAL(14,2),
    "clientId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "professionalProfileId" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "description" TEXT NOT NULL,
    "includesMaterials" BOOLEAN NOT NULL DEFAULT false,
    "offersWarranty" BOOLEAN NOT NULL DEFAULT false,
    "warrantyDuration" INTEGER,
    "termsAndConditions" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_configs_name_key" ON "agent_configs"("name");

-- CreateIndex
CREATE INDEX "agent_configs_isActive_idx" ON "agent_configs"("isActive");

-- CreateIndex
CREATE INDEX "agent_configs_name_idx" ON "agent_configs"("name");

-- CreateIndex
CREATE INDEX "agent_conversations_createdAt_idx" ON "agent_conversations"("createdAt");

-- CreateIndex
CREATE INDEX "agent_conversations_sessionId_idx" ON "agent_conversations"("sessionId");

-- CreateIndex
CREATE INDEX "agent_conversations_userId_idx" ON "agent_conversations"("userId");

-- CreateIndex
CREATE INDEX "agent_logs_conversationId_idx" ON "agent_logs"("conversationId");

-- CreateIndex
CREATE INDEX "agent_logs_createdAt_idx" ON "agent_logs"("createdAt");

-- CreateIndex
CREATE INDEX "agent_logs_success_idx" ON "agent_logs"("success");

-- CreateIndex
CREATE INDEX "agent_logs_toolName_idx" ON "agent_logs"("toolName");

-- CreateIndex
CREATE INDEX "agent_logs_userId_idx" ON "agent_logs"("userId");

-- CreateIndex
CREATE INDEX "agent_messages_conversationId_idx" ON "agent_messages"("conversationId");

-- CreateIndex
CREATE INDEX "agent_messages_createdAt_idx" ON "agent_messages"("createdAt");

-- CreateIndex
CREATE INDEX "agent_messages_role_idx" ON "agent_messages"("role");

-- CreateIndex
CREATE INDEX "agent_metrics_createdAt_idx" ON "agent_metrics"("createdAt");

-- CreateIndex
CREATE INDEX "agent_metrics_date_idx" ON "agent_metrics"("date");

-- CreateIndex
CREATE INDEX "agent_metrics_metric_idx" ON "agent_metrics"("metric");

-- CreateIndex
CREATE UNIQUE INDEX "agent_personalities_name_key" ON "agent_personalities"("name");

-- CreateIndex
CREATE INDEX "agent_personalities_isActive_idx" ON "agent_personalities"("isActive");

-- CreateIndex
CREATE INDEX "agent_personalities_name_idx" ON "agent_personalities"("name");

-- CreateIndex
CREATE INDEX "job_postings_category_idx" ON "job_postings"("category");

-- CreateIndex
CREATE INDEX "job_postings_clientId_idx" ON "job_postings"("clientId");

-- CreateIndex
CREATE INDEX "job_postings_createdAt_idx" ON "job_postings"("createdAt");

-- CreateIndex
CREATE INDEX "job_postings_status_idx" ON "job_postings"("status");

-- CreateIndex
CREATE INDEX "proposals_createdAt_idx" ON "proposals"("createdAt");

-- CreateIndex
CREATE INDEX "proposals_jobId_idx" ON "proposals"("jobId");

-- CreateIndex
CREATE INDEX "proposals_professionalId_idx" ON "proposals"("professionalId");

-- CreateIndex
CREATE INDEX "proposals_status_idx" ON "proposals"("status");

-- CreateIndex
CREATE INDEX "Conversation_jobId_idx" ON "Conversation"("jobId");

-- CreateIndex
CREATE INDEX "Conversation_type_idx" ON "Conversation"("type");

-- CreateIndex
CREATE INDEX "Message_isRead_idx" ON "Message"("isRead");

-- CreateIndex
CREATE INDEX "Review_jobId_idx" ON "Review"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_jobId_reviewerId_key" ON "Review"("jobId", "reviewerId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_postings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "ServiceTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_postings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_conversations" ADD CONSTRAINT "agent_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_logs" ADD CONSTRAINT "agent_logs_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "agent_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_logs" ADD CONSTRAINT "agent_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "agent_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_professionalProfileId_fkey" FOREIGN KEY ("professionalProfileId") REFERENCES "ProfessionalProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
