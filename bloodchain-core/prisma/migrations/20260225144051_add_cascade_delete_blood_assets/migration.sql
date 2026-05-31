-- DropForeignKey
ALTER TABLE "blood_assets" DROP CONSTRAINT "blood_assets_donorId_fkey";

-- AddForeignKey
ALTER TABLE "blood_assets" ADD CONSTRAINT "blood_assets_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
