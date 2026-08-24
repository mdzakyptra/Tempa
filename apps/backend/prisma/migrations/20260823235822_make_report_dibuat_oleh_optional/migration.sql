-- AlterTable
ALTER TABLE "reports" ALTER COLUMN "dibuat_oleh" DROP NOT NULL;

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_dibuat_oleh_fkey";

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
