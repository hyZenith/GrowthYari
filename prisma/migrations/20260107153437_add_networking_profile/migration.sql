-- AlterTable
ALTER TABLE "User" ADD COLUMN     "experienceLevel" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "networkingAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "skills" TEXT[];
