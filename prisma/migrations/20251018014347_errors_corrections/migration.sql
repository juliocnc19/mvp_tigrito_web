-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "proposedPrice" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "recipientId" TEXT;

-- AlterTable
ALTER TABLE "ProfessionalProfile" ADD COLUMN     "completionRate" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "responseTime" INTEGER;

-- AlterTable
ALTER TABLE "ProfessionalService" ADD COLUMN     "professionalProfileId" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "professionalProfileId" TEXT;

-- AlterTable
ALTER TABLE "ServicePosting" ADD COLUMN     "budget" DECIMAL(14,2),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServiceTransaction" ADD COLUMN     "agreedPrice" DECIMAL(14,2),
ADD COLUMN     "offerId" TEXT,
ADD COLUMN     "status" "ServiceStatus" NOT NULL DEFAULT 'PENDING_SOLICITUD';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;

-- AddForeignKey
ALTER TABLE "ProfessionalService" ADD CONSTRAINT "ProfessionalService_professionalProfileId_fkey" FOREIGN KEY ("professionalProfileId") REFERENCES "ProfessionalProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTransaction" ADD CONSTRAINT "ServiceTransaction_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_professionalProfileId_fkey" FOREIGN KEY ("professionalProfileId") REFERENCES "ProfessionalProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
