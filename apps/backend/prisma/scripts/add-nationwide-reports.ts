// Nambahin 10 laporan tersebar di kota-kota jauh se-Indonesia (lihat
// prisma/seed-data/nationwide-reports.ts) ke DB yang lagi aktif — TANPA
// hapus data yang udah ada (beda dari seed.ts yang reset semua dulu).
// Idempotent: dicek dulu per judul+kawasan, laporan yang udah ada dilewatin
// biar aman dijalankan berkali-kali.
//
// Jalanin: cd apps/backend && npx tsx prisma/scripts/add-nationwide-reports.ts
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Peran } from '../../generated/prisma/client';
import { NATIONWIDE_REPORTS } from '../seed-data/nationwide-reports';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

async function main(): Promise<void> {
  const warga = await prisma.profile.findMany({ where: { peran: Peran.warga }, select: { id: true } });
  const wargaIds = warga.map((w) => w.id);
  if (wargaIds.length === 0) {
    throw new Error('Nggak ada profil warga di DB ini  jalankan seed.ts dulu buat data dasar.');
  }

  let dibuat = 0;
  let dilewati = 0;

  for (const report of NATIONWIDE_REPORTS) {
    const existing = await prisma.report.findFirst({
      where: { judul: report.judul, kawasan: report.kawasan },
      select: { id: true },
    });
    if (existing) {
      dilewati++;
      console.log(`  lewat (udah ada): ${report.judul} — ${report.kawasan}`);
      continue;
    }

    const created = await prisma.report.create({
      data: {
        id: randomUUID(),
        judul: report.judul,
        deskripsi: report.deskripsi,
        kawasan: report.kawasan,
        jenis_kerusakan: report.jenis_kerusakan,
        tingkat_bahaya: report.tingkat_bahaya,
        estimasi_terdampak: report.estimasi_terdampak,
        jalur_vital: report.jalur_vital,
        dibuat_pada: report.dibuat_pada,
        lat: report.lat,
        lng: report.lng,
        dibuat_oleh: pick(wargaIds),
        // Embedding dibiarkan null — jalankan backfill-embeddings.ts abis ini
        // biar deteksi laporan serupa tetap kepakai buat laporan-laporan ini.
      },
    });

    const voteCount = randomInt(0, Math.min(6, wargaIds.length));
    const voters = [...wargaIds].sort(() => Math.random() - 0.5).slice(0, voteCount);
    for (const userId of voters) {
      await prisma.vote.create({ data: { id: randomUUID(), report_id: created.id, user_id: userId } });
    }

    dibuat++;
    console.log(`  ok: ${report.judul} — ${report.kawasan} (${voteCount} vote)`);
  }

  console.log(`Selesai: ${dibuat} laporan baru, ${dilewati} dilewati (udah ada).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
