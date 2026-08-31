// Mengunggah lima foto seed lewat endpoint aplikasi, lalu menautkan satu foto
// ke masing-masing dari 40 laporan. URL foto dibuat oleh PhotosService dan
// tersimpan ke Supabase lewat POST /photos, bukan diisi langsung oleh script.
// Jalanin: cd apps/backend && npx tsx prisma/scripts/seed-report-photos.ts
import 'dotenv/config';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';


const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const API_URL = process.env.SEED_API_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
const PHOTO_DIRECTORY = process.env.SEED_PHOTOS_DIRECTORY ?? resolve(process.cwd(), '../../../Graphify/seed-report-photos');
const PHOTO_FILENAMES = ['pothole.png', 'drainage.png', 'sidewalk.png', 'streetlight.png', 'playground.png'];
const REPORT_LIMIT = 40;
const ATTACH_BATCH_SIZE = 20;

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

interface PresignedUpload {
  uploadUrl: string;
  key: string;
}

//<---------- requestApi ------------>
async function requestApi<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success) throw new Error(body.message || `Request ${path} gagal.`);
  return body.data;
}

//<---------- uploadPhoto ------------>
async function uploadPhoto(filename: string): Promise<string> {
  const path = resolve(PHOTO_DIRECTORY, filename);
  const [file, fileStat] = await Promise.all([readFile(path), stat(path)]);
  const presigned = await requestApi<PresignedUpload>('/photos/presigned-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: 'image/png', contentLength: fileStat.size }),
  });
  const uploadResponse = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: file,
  });
  if (!uploadResponse.ok) throw new Error(`Upload S3 gagal untuk ${filename}: ${uploadResponse.status}.`);
  return presigned.key;
}

//<---------- waitForThrottleWindow ------------>
function waitForThrottleWindow(): Promise<void> {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, 61_000));
}

//<---------- attachPhoto ------------>
async function attachPhoto(reportId: string, key: string): Promise<void> {
  await requestApi('/photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, keys: [key] }),
  });
}

//<---------- main ------------>
async function main(): Promise<void> {
  const reports = await prisma.report.findMany({
    where: { photos: { none: {} } },
    select: { id: true },
    orderBy: { dibuat_pada: 'desc' },
    take: REPORT_LIMIT,
  });
  if (reports.length < REPORT_LIMIT) throw new Error(`Butuh ${REPORT_LIMIT} laporan tanpa foto, tersedia ${reports.length}.`);

  console.log(`Upload ${PHOTO_FILENAMES.length} foto ke S3 lewat controller...`);
  const keys = await Promise.all(PHOTO_FILENAMES.map(uploadPhoto));
  console.log(`Menautkan foto ke ${REPORT_LIMIT} laporan lewat controller...`);

  for (const [index, report] of reports.entries()) {
    if (index === ATTACH_BATCH_SIZE) {
      console.log('Menunggu jendela throttle endpoint foto sebelum batch berikutnya...');
      await waitForThrottleWindow();
    }
    await attachPhoto(report.id, keys[index % keys.length]);
    console.log(`  ${index + 1}/${REPORT_LIMIT} terpasang`);
  }
  console.log(`Selesai: ${PHOTO_FILENAMES.length} objek S3 dan ${REPORT_LIMIT} URL foto di Supabase.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
