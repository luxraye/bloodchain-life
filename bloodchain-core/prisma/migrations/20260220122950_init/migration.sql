-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PUBLIC', 'MEDICAL', 'LAB', 'TRANSIT', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('COLLECTED', 'TESTING', 'QUARANTINE', 'RELEASED', 'IN_TRANSIT', 'USED', 'DISCARDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PUBLIC',
    "facilityId" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_assets" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "bloodType" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'COLLECTED',
    "currentLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "blood_assets" ADD CONSTRAINT "blood_assets_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
