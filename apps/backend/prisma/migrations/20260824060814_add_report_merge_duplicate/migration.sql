-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "digabung_ke_id" UUID;

-- CreateIndex
CREATE INDEX "reports_digabung_ke_id_idx" ON "reports"("digabung_ke_id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_digabung_ke_id_fkey" FOREIGN KEY ("digabung_ke_id") REFERENCES "reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;
