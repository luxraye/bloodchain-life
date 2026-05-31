-- CreateEnum
CREATE TYPE "ComponentType" AS ENUM ('WHOLE_BLOOD', 'RBC', 'FFP', 'PLATELETS');

-- CreateEnum
CREATE TYPE "TTIStatus" AS ENUM ('PENDING', 'NEGATIVE', 'REACTIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AssetStatus" ADD VALUE 'REACTIVE_DISCARD';
ALTER TYPE "AssetStatus" ADD VALUE 'PROCESSED_SPLIT';

-- AlterTable
ALTER TABLE "blood_assets" ADD COLUMN     "componentType" "ComponentType" NOT NULL DEFAULT 'WHOLE_BLOOD',
ADD COLUMN     "parentUnitId" TEXT;

-- CreateTable
CREATE TABLE "tti_screenings" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "hiv_1_2" "TTIStatus" NOT NULL DEFAULT 'PENDING',
    "hbsag" "TTIStatus" NOT NULL DEFAULT 'PENDING',
    "hcv" "TTIStatus" NOT NULL DEFAULT 'PENDING',
    "syphilis" "TTIStatus" NOT NULL DEFAULT 'PENDING',
    "technicianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tti_screenings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tti_screenings_assetId_key" ON "tti_screenings"("assetId");

-- AddForeignKey
ALTER TABLE "blood_assets" ADD CONSTRAINT "blood_assets_parentUnitId_fkey" FOREIGN KEY ("parentUnitId") REFERENCES "blood_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tti_screenings" ADD CONSTRAINT "tti_screenings_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "blood_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tti_screenings" ADD CONSTRAINT "tti_screenings_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
