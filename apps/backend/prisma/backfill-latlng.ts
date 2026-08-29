import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Koordinat titik tengah tiap kawasan (sama dengan prisma/seed.ts) — dipakai
// buat backfill lat/lng laporan lama yang dibuat sebelum kolom ini ada (JEK-45).
const KAWASAN_COORDS: Record<string, [number, number]> = {
  'Kelurahan Sukajadi': [-6.8898, 107.5806],
  'Kelurahan Cibeunying': [-6.9007, 107.6236],
  'Kelurahan Antapani': [-6.9159, 107.6553],
  'Kelurahan Kopo': [-6.9482, 107.5852],
  'Kelurahan Dago': [-6.8807, 107.6133],
  'Kelurahan Cicadas': [-6.9134, 107.639],
  'Kelurahan Buah Batu': [-6.9557, 107.6367],
  'Kelurahan Gedebage': [-6.9508, 107.6864],
};

//<---------- jitterCoord -------------->
function jitterCoord([lat, lng]: [number, number]): [number, number] {
  const jitter = () => (Math.random() - 0.5) * 0.01;
  return [lat + jitter(), lng + jitter()];
}

//<---------- main -------------->
async function main(): Promise<void> {
  const reports = await prisma.report.findMany({
    where: { lat: null },
    select: { id: true, kawasan: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const report of reports) {
    const coords = KAWASAN_COORDS[report.kawasan];
    if (!coords) {
      skipped++;
      console.warn(`Skip ${report.id}: kawasan "${report.kawasan}" tidak ada di KAWASAN_COORDS`);
      continue;
    }

    const [lat, lng] = jitterCoord(coords);
    await prisma.report.update({
      where: { id: report.id },
      data: { lat, lng },
    });
    updated++;
  }

  console.log(`Backfill selesai: ${updated} laporan diupdate, ${skipped} dilewati.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
