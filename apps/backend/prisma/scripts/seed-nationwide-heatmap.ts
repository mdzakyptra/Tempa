import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  JenisKerusakan,
  PrismaClient,
  TingkatBahaya,
} from '../../generated/prisma/client';


const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const LOCATIONS = [
  ['Banda Aceh', 5.5483, 95.3238],
  ['Medan', 3.5952, 98.6722],
  ['Padang', -0.9471, 100.4172],
  ['Pekanbaru', 0.5071, 101.4478],
  ['Jambi', -1.6101, 103.6131],
  ['Palembang', -2.9761, 104.7754],
  ['Bandar Lampung', -5.3971, 105.2668],
  ['Tanjung Pinang', 0.9186, 104.4665],
  ['Serang', -6.1201, 106.1503],
  ['Jakarta Pusat', -6.1751, 106.865],
  ['Bandung', -6.9175, 107.6191],
  ['Semarang', -6.9667, 110.4167],
  ['Yogyakarta', -7.7956, 110.3695],
  ['Surabaya', -7.2575, 112.7521],
  ['Denpasar', -8.6705, 115.2126],
  ['Mataram', -8.5833, 116.1167],
  ['Kupang', -10.1772, 123.607],
  ['Pontianak', -0.0263, 109.3425],
  ['Palangkaraya', -2.2088, 113.9167],
  ['Banjarmasin', -3.3186, 114.5944],
  ['Samarinda', -0.5022, 117.1536],
  ['Balikpapan', -1.2379, 116.8529],
  ['Manado', 1.4748, 124.8421],
  ['Gorontalo', 0.5435, 123.0568],
  ['Palu', -0.8917, 119.8707],
  ['Makassar', -5.1477, 119.4327],
  ['Kendari', -3.9985, 122.5129],
  ['Ambon', -3.6547, 128.1906],
  ['Ternate', 0.7903, 127.3842],
  ['Sorong', -0.8762, 131.2558],
  ['Manokwari', -0.8615, 134.062],
  ['Biak', -1.0381, 135.9801],
  ['Jayapura', -2.5337, 140.7181],
  ['Merauke', -8.4932, 140.4018],
] as const;

const REPORT_VARIANTS = [
  {
    title: 'Drainase tersumbat di jalur permukiman',
    description: 'Saluran tersumbat lumpur dan sampah, genangan muncul setiap hujan deras dan mengganggu akses warga.',
    type: JenisKerusakan.drainase,
    danger: TingkatBahaya.sedang,
  },
  {
    title: 'Jalan berlubang di akses utama warga',
    description: 'Permukaan aspal berlubang dan retak, pengendara roda dua harus melambat mendadak untuk menghindari kecelakaan.',
    type: JenisKerusakan.jalan,
    danger: TingkatBahaya.tinggi,
  },
  {
    title: 'Lampu jalan padam di area publik',
    description: 'Penerangan jalan tidak menyala saat malam, membuat pejalan kaki dan warga sekitar merasa tidak aman.',
    type: JenisKerusakan.lampu_jalan,
    danger: TingkatBahaya.sedang,
  },
] as const;

//<---------- daysAgo ------------>
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

//<---------- seedNationwideHeatmap ------------>
async function seedNationwideHeatmap(): Promise<void> {
  let added = 0;
  let skipped = 0;

  for (const [locationIndex, [kawasan, lat, lng]] of LOCATIONS.entries()) {
    for (const [variantIndex, variant] of REPORT_VARIANTS.entries()) {
      const judul = `${variant.title} — ${kawasan}`;
      const existing = await prisma.report.findFirst({ where: { judul } });

      if (existing) {
        skipped += 1;
        continue;
      }

      const offset = (variantIndex - 1) * 0.018;
      await prisma.report.create({
        data: {
          id: randomUUID(),
          judul,
          deskripsi: `${variant.description} Lokasi laporan berada di ${kawasan}.`,
          kawasan,
          lat: lat + offset,
          lng: lng - offset,
          jenis_kerusakan: variant.type,
          tingkat_bahaya: variant.danger,
          estimasi_terdampak: 60 + ((locationIndex * 37 + variantIndex * 53) % 390),
          jalur_vital: variantIndex === 1 || locationIndex % 5 === 0,
          dibuat_pada: daysAgo((locationIndex * 3 + variantIndex * 7) % 60),
        },
      });
      added += 1;
    }
  }

  const total = await prisma.report.count({ where: { digabung_ke_id: null } });
  console.log(`Seed heatmap nasional selesai: ${added} ditambahkan, ${skipped} sudah ada, total aktif ${total}.`);
}

//<---------- main ------------>
async function main(): Promise<void> {
  await seedNationwideHeatmap();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
