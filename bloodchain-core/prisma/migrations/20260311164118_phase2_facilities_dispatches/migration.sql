-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('HOSPITAL', 'BLOOD_BANK', 'MOBILE_DRIVE', 'LABORATORY', 'DISTRIBUTION_CENTER');

-- CreateEnum
CREATE TYPE "FacilityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "DispatchStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'DELIVERED', 'COMPROMISED_COLD_CHAIN', 'RETURNED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'LOGISTICS_COMMAND';
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE 'MOH_AUDITOR';

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FacilityType" NOT NULL,
    "status" "FacilityStatus" NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT,
    "region" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "inventoryLevel" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatches" (
    "id" TEXT NOT NULL,
    "courierId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "originFacilityId" TEXT NOT NULL,
    "destFacilityId" TEXT NOT NULL,
    "status" "DispatchStatus" NOT NULL DEFAULT 'PENDING',
    "departedAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "temperatureLog" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispatches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "blood_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_originFacilityId_fkey" FOREIGN KEY ("originFacilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_destFacilityId_fkey" FOREIGN KEY ("destFacilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
