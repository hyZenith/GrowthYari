-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN     "status" "RegistrationStatus" NOT NULL DEFAULT 'ACTIVE';
