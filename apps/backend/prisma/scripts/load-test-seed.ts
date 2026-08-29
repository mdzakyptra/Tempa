// Script load-test buat JEK-58 — TIDAK terhubung ke `prisma db seed` (lihat
// prisma.config.ts, cuma nunjuk ke prisma/seed.ts), jadi aman dijalanin
// manual kapan aja tanpa mengganggu alur seed demo (JEK-28).
//
// Nambahin ribuan baris `reports`/`votes` buat data seed demo yang ada
// (BUKAN reset/replace), khusus buat ngukur performa query skor & pencarian
// serupa (EXPLAIN ANALYZE) di volume data yang realistis.
//
// Jalanin: cd apps/backend && npx tsx prisma/scripts/load-test-seed.ts
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Peran,
  JenisKerusakan,
  TingkatBahaya,
  StatusLaporan,
} from '../../generated/prisma/client';


// Guard keamanan — script ini generate data acak dalam jumlah besar,
// jangan sampai kepencet jalanin ke DB produksi (Supabase) gara-gara
// DATABASE_URL kebawa dari .env.production.
if (!process.env.DATABASE_URL?.includes('localhost')) {
  throw new Error(
    'load-test-seed cuma boleh jalan ke DB lokal (DATABASE_URL harus mengandung "localhost"). ' +
      'Cek .env kamu — ini KEMUNGKINAN nunjuk ke Supabase produksi.',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const REPORT_COUNT = 5000;
const VOTER_POOL_SIZE = 300;
const MAX_VOTES_PER_REPORT = 6;
const EMBEDDING_DIM = 768;
const REPORT_CHUNK_SIZE = 500;
const EMBEDDING_CHUNK_SIZE = 50;
const VOTE_CHUNK_SIZE = 1000;

const KAWASAN_LIST = [
  'Kelurahan Sukajadi',
  'Kelurahan Cibeunying',
  'Kelurahan Antapani',
  'Kelurahan Kopo',
  'Kelurahan Dago',
  'Kelurahan Cicadas',
  'Kelurahan Buah Batu',
  'Kelurahan Gedebage',
] as const;

//<---------- randomInt -------------->
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//<---------- pick -------------->
function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

//<---------- daysAgo -------------->
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - randomInt(0, 23));
  return date;
}

//<---------- randomUnitVector -------------->
// Vektor acak (bukan hasil embedding Gemini beneran) — cukup buat ngukur
// performa index vektor (waktu build, bentuk query plan), yang bergantung
// ke jumlah & dimensi vektor, BUKAN ke makna semantiknya. Gemini nggak
// dipanggil di sini karena nggak praktis (rate limit) buat ribuan baris,
// dan nggak relevan buat tujuan ticket ini (ngukur index, bukan ngetes
// akurasi deteksi duplikat — itu udah dites terpisah di JEK-19).
function randomUnitVector(dim: number): number[] {
  const raw = Array.from({ length: dim }, () => Math.random() - 0.5);
  const norm = Math.sqrt(raw.reduce((sum, x) => sum + x * x, 0));
  return raw.map((x) => x / norm);
}

//<---------- vectorLiteral -------------->
function vectorLiteral(vector: number[]): string {
  return `[${vector.join(',')}]`;
}

interface LoadTestReport {
  id: string;
  judul: string;
  deskripsi: string;
  kawasan: string;
  jenis_kerusakan: JenisKerusakan;
  tingkat_bahaya: TingkatBahaya;
  estimasi_terdampak: number;
  jalur_vital: boolean;
  status: StatusLaporan;
  dibuat_pada: Date;
}

//<---------- buildReports -------------->
function buildReports(count: number): LoadTestReport[] {
  const jenisList = Object.values(JenisKerusakan);
  const bahayaList = Object.values(TingkatBahaya);
  const statusList = Object.values(StatusLaporan);
  const reports: LoadTestReport[] = [];

  for (let i = 0; i < count; i++) {
    reports.push({
      id: randomUUID(),
      judul: `[Load-test] Laporan kerusakan #${i}`,
      deskripsi: `Deskripsi laporan load-test ke-${i}, dipakai khusus buat ukur performa query (JEK-58).`,
      kawasan: pick(KAWASAN_LIST),
      jenis_kerusakan: pick(jenisList),
      tingkat_bahaya: pick(bahayaList),
      estimasi_terdampak: randomInt(0, 300),
      jalur_vital: Math.random() < 0.2,
      // seed.ts nggak pernah variasiin status (selalu default 'menunggu') —
      // punya kita harus, karena findSimilar() filter `status NOT IN (...)`.
      status: pick(statusList),
      dibuat_pada: daysAgo(randomInt(0, 365)),
    });
  }

  return reports;
}

//<---------- insertReportsChunked -------------->
async function insertReportsChunked(reports: LoadTestReport[]): Promise<void> {
  for (let i = 0; i < reports.length; i += REPORT_CHUNK_SIZE) {
    const chunk = reports.slice(i, i + REPORT_CHUNK_SIZE);
    await prisma.report.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  reports: ${Math.min(i + REPORT_CHUNK_SIZE, reports.length)}/${reports.length}`);
  }
}

//<---------- backfillEmbeddings -------------->
// `embedding` kolom `Unsupported` di Prisma — nggak bisa diisi lewat
// createMany, jadi diisi belakangan lewat $executeRaw per baris.
async function backfillEmbeddings(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += EMBEDDING_CHUNK_SIZE) {
    const chunk = ids.slice(i, i + EMBEDDING_CHUNK_SIZE);
    await Promise.all(
      chunk.map((id) => {
        const literal = vectorLiteral(randomUnitVector(EMBEDDING_DIM));
        return prisma.$executeRaw`UPDATE reports SET embedding = ${literal}::vector WHERE id = ${id}::uuid`;
      }),
    );
    console.log(`  embeddings: ${Math.min(i + EMBEDDING_CHUNK_SIZE, ids.length)}/${ids.length}`);
  }
}

//<---------- seedVoterPool -------------->
// Profile dummy khusus buat load-test, bukan bagian dari seed demo (JEK-28).
// Password diisi string tetap (bukan hash bcrypt asli) — dipercepat sengaja,
// karena akun ini nggak pernah dipakai buat login sungguhan.
async function seedVoterPool(count: number): Promise<string[]> {
  const ids = Array.from({ length: count }, () => randomUUID());
  const data = ids.map((id, i) => ({
    id,
    nama: `Load Test Warga ${i}`,
    email: `loadtest-warga-${i}@example.local`,
    password: 'load-test-dummy-password',
    peran: Peran.warga,
  }));

  for (let i = 0; i < data.length; i += REPORT_CHUNK_SIZE) {
    await prisma.profile.createMany({
      data: data.slice(i, i + REPORT_CHUNK_SIZE),
      skipDuplicates: true,
    });
  }

  return ids;
}

interface LoadTestVote {
  id: string;
  report_id: string;
  user_id: string;
  dibuat_pada: Date;
}

//<---------- buildVotes -------------->
function buildVotes(reportIds: string[], voterIds: string[]): LoadTestVote[] {
  const votes: LoadTestVote[] = [];

  for (const reportId of reportIds) {
    const voteCount = randomInt(0, Math.min(MAX_VOTES_PER_REPORT, voterIds.length));
    const voters = [...voterIds].sort(() => Math.random() - 0.5).slice(0, voteCount);

    for (const userId of voters) {
      votes.push({
        id: randomUUID(),
        report_id: reportId,
        user_id: userId,
        dibuat_pada: daysAgo(randomInt(0, 30)),
      });
    }
  }

  return votes;
}

//<---------- insertVotesChunked -------------->
async function insertVotesChunked(votes: LoadTestVote[]): Promise<void> {
  for (let i = 0; i < votes.length; i += VOTE_CHUNK_SIZE) {
    const chunk = votes.slice(i, i + VOTE_CHUNK_SIZE);
    // createMany tetap multi-row INSERT — trigger votes_count_trigger
    // (JEK-21) row-level tetap kepanggil sekali per baris, jadi
    // reports.votes_count otomatis konsisten begitu ini selesai (nggak
    // perlu backfill manual).
    await prisma.vote.createMany({ data: chunk, skipDuplicates: true });
    console.log(`  votes: ${Math.min(i + VOTE_CHUNK_SIZE, votes.length)}/${votes.length}`);
  }
}

//<---------- main -------------->
async function main(): Promise<void> {
  console.log(`Bikin ${REPORT_COUNT} laporan load-test...`);
  const reports = buildReports(REPORT_COUNT);
  await insertReportsChunked(reports);

  console.log('Isi embedding acak (768 dim) per laporan...');
  await backfillEmbeddings(reports.map((r) => r.id));

  console.log(`Bikin ${VOTER_POOL_SIZE} profile dummy buat voting...`);
  const voterIds = await seedVoterPool(VOTER_POOL_SIZE);

  console.log('Bikin votes...');
  const votes = buildVotes(
    reports.map((r) => r.id),
    voterIds,
  );
  await insertVotesChunked(votes);

  console.log(
    `Load-test seed selesai: ${reports.length} laporan, ${votes.length} votes, embedding terisi semua.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
