/*
  Warnings:

  - You are about to drop the column `kcUserId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supabaseId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "blood_assets" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "kcUserId",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "medicalConditions" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "supabaseId" TEXT,
ADD COLUMN     "trustLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "verificationDocUrl" TEXT;

-- CreateTable
CREATE TABLE "custody_events" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custody_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_logs" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "actionPerformed" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseId_key" ON "users"("supabaseId");

-- AddForeignKey
ALTER TABLE "custody_events" ADD CONSTRAINT "custody_events_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "blood_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custody_events" ADD CONSTRAINT "custody_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
