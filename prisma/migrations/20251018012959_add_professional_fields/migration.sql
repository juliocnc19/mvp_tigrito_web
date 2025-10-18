-- AlterTable
ALTER TABLE "ProfessionalProfile" ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "hourlyRate" DECIMAL(14,2),
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER;
