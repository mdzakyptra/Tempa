// Backfill embedding buat laporan yang embedding-nya masih NULL — dibutuhin
// buat laporan seed demo (JEK-28) yang dibuat SEBELUM JEK-19 (deteksi
// embedding) kelar, sesuai catatan di seed.ts sendiri: "begitu endpoint
// AI-nya siap, jalankan ulang generate embedding buat semua laporan yang
// embedding-nya null."
//
// Beda dari load-test-seed.ts: script itu pakai vektor ACAK (buat ukur
// performa index doang, JEK-58) — ini pakai Gemini ASLI (GeminiEmbeddingService
// yang sama kayak dipakai reports.service.ts), karena tujuannya beda: biar
// deteksi laporan serupa berbasis makna (JEK-19/48) beneran bisa ketes/kepakai
// buat data seed demo yang ada.
//
// Aman dijalankan ke DB manapun (lokal atau Supabase) — operasinya cuma
// isi kolom embedding yang masih NULL pakai embedding ASLI, nggak pernah
// menghapus/menimpa data lain. Beda dari load-test-seed.ts yang sengaja
// dibatasi ke lokal (itu pakai data acak, bukan buat data beneran).
//
// Jalanin: cd apps/backend && npx tsx prisma/scripts/backfill-embeddings.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { GeminiEmbeddingService } from '../../src/reports/gemini-embedding.service';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const embeddingService = new GeminiEmbeddingService();

async function main(): Promise<void> {
  const reports = await prisma.$queryRaw<{ id: string; judul: string; deskripsi: string }[]>`
    SELECT id, judul, deskripsi FROM reports WHERE embedding IS NULL
  `;

  console.log(`${reports.length} laporan belum punya embedding.`);

  let sukses = 0;
  let gagal = 0;

  for (const report of reports) {
    const vector = await embeddingService.embed(`${report.judul} ${report.deskripsi}`);
    if (!vector) {
      gagal++;
      console.log(`  gagal: ${report.judul}`);
      continue;
    }

    const literal = `[${vector.join(',')}]`;
    await prisma.$executeRaw`
      UPDATE reports SET embedding = ${literal}::vector WHERE id = ${report.id}::uuid
    `;
    sukses++;
    console.log(`  ok (${sukses}/${reports.length}): ${report.judul}`);
  }

  console.log(`Backfill selesai: ${sukses} sukses, ${gagal} gagal.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
