-- CreateTable
CREATE TABLE "ProfessionalPortfolio" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "category" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "clientRating" DOUBLE PRECISION,
    "clientReview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalNotification" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessionalNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfessionalPortfolio_professionalId_idx" ON "ProfessionalPortfolio"("professionalId");

-- CreateIndex
CREATE INDEX "ProfessionalPortfolio_category_idx" ON "ProfessionalPortfolio"("category");

-- CreateIndex
CREATE INDEX "ProfessionalPortfolio_completionDate_idx" ON "ProfessionalPortfolio"("completionDate");

-- CreateIndex
CREATE INDEX "ProfessionalNotification_professionalId_idx" ON "ProfessionalNotification"("professionalId");

-- CreateIndex
CREATE INDEX "ProfessionalNotification_read_idx" ON "ProfessionalNotification"("read");

-- CreateIndex
CREATE INDEX "ProfessionalNotification_createdAt_idx" ON "ProfessionalNotification"("createdAt");

-- AddForeignKey
ALTER TABLE "ProfessionalPortfolio" ADD CONSTRAINT "ProfessionalPortfolio_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalNotification" ADD CONSTRAINT "ProfessionalNotification_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE TABLE "ProfessionalPortfolio" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "category" TEXT NOT NULL,
    "completionDate" TIMESTAMP(3) NOT NULL,
    "clientRating" DOUBLE PRECISION,
    "clientReview" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalNotification" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessionalNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfessionalPortfolio_professionalId_idx" ON "ProfessionalPortfolio"("professionalId");

-- CreateIndex
CREATE INDEX "ProfessionalPortfolio_category_idx" ON "ProfessionalPortfolio"("category");

-- CreateIndex
CREATE INDEX "ProfessionalPortfolio_completionDate_idx" ON "ProfessionalPortfolio"("completionDate");

-- CreateIndex
CREATE INDEX "ProfessionalNotification_professionalId_idx" ON "ProfessionalNotification"("professionalId");

-- CreateIndex
CREATE INDEX "ProfessionalNotification_read_idx" ON "ProfessionalNotification"("read");

-- CreateIndex
CREATE INDEX "ProfessionalNotification_createdAt_idx" ON "ProfessionalNotification"("createdAt");

-- AddForeignKey
ALTER TABLE "ProfessionalPortfolio" ADD CONSTRAINT "ProfessionalPortfolio_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalNotification" ADD CONSTRAINT "ProfessionalNotification_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


