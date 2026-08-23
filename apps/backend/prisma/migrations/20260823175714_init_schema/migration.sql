-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Peran" AS ENUM ('warga', 'petugas');

-- CreateEnum
CREATE TYPE "TingkatBahaya" AS ENUM ('rendah', 'sedang', 'tinggi', 'darurat');

-- CreateEnum
CREATE TYPE "JenisKerusakan" AS ENUM ('jalan', 'trotoar', 'lampu_jalan', 'drainase', 'jembatan', 'fasilitas_umum', 'lainnya');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('menunggu', 'diproses', 'selesai', 'ditolak');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "peran" "Peran" NOT NULL DEFAULT 'warga',
    "kawasan_tugas" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kawasan" TEXT NOT NULL,
    "jenis_kerusakan" "JenisKerusakan" NOT NULL,
    "tingkat_bahaya" "TingkatBahaya" NOT NULL,
    "estimasi_terdampak" INTEGER NOT NULL DEFAULT 0,
    "jalur_vital" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusLaporan" NOT NULL DEFAULT 'menunggu',
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dibuat_oleh" UUID NOT NULL,
    "embedding" vector(768),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_photos" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "url_foto" TEXT NOT NULL,

    CONSTRAINT "report_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "dibuat_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_history" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "status_lama" "StatusLaporan",
    "status_baru" "StatusLaporan" NOT NULL,
    "catatan" TEXT,
    "diubah_oleh" UUID NOT NULL,
    "diubah_pada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_kawasan_idx" ON "reports"("kawasan");

-- CreateIndex
CREATE INDEX "reports_jenis_kerusakan_idx" ON "reports"("jenis_kerusakan");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_dibuat_pada_idx" ON "reports"("dibuat_pada");

-- CreateIndex
CREATE UNIQUE INDEX "votes_report_id_user_id_key" ON "votes"("report_id", "user_id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_dibuat_oleh_fkey" FOREIGN KEY ("dibuat_oleh") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_photos" ADD CONSTRAINT "report_photos_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_diubah_oleh_fkey" FOREIGN KEY ("diubah_oleh") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
