// Script verifikasi trigger `votes_count` (JEK-21) pas concurrent vote —
// buat JEK-58. Tembak N vote bareng ke 1 laporan yang sama, ukur wall-clock
// time, dan cek votes_count tetap akurat (correctness check sekaligus).
//
// Jalanin: cd apps/backend && npx tsx prisma/scripts/concurrent-vote-test.ts
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Peran } from '../../generated/prisma/client';


if (!process.env.DATABASE_URL?.includes('localhost')) {
  throw new Error(
    'concurrent-vote-test cuma boleh jalan ke DB lokal (DATABASE_URL harus mengandung "localhost").',
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const VOTER_COUNT = 100;

async function main(): Promise<void> {
  const target = await prisma.report.findFirst({
    where: { judul: { startsWith: '[Load-test]' } },
  });
  if (!target) {
    throw new Error('Nggak ada laporan load-test — jalanin load-test-seed.ts dulu.');
  }

  console.log(`Target laporan: ${target.id} (votes_count awal: ${target.votes_count})`);

  console.log(`Bikin ${VOTER_COUNT} profile dummy buat voting bareng...`);
  const voterIds = Array.from({ length: VOTER_COUNT }, () => randomUUID());
  await prisma.profile.createMany({
    data: voterIds.map((id, i) => ({
      id,
      nama: `Concurrent Test Warga ${i}`,
      email: `concurrent-test-${randomUUID()}@example.local`,
      password: 'load-test-dummy-password',
      peran: Peran.warga,
    })),
    skipDuplicates: true,
  });

  const before = await prisma.report.findUniqueOrThrow({
    where: { id: target.id },
    select: { votes_count: true },
  });

  console.log(`Tembak ${VOTER_COUNT} vote bareng ke laporan yang sama...`);
  const start = performance.now();
  const results = await Promise.allSettled(
    voterIds.map((userId) =>
      prisma.vote.create({
        data: { id: randomUUID(), report_id: target.id, user_id: userId },
      }),
    ),
  );
  const durationMs = performance.now() - start;

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected');

  const after = await prisma.report.findUniqueOrThrow({
    where: { id: target.id },
    select: { votes_count: true },
  });
  const actualVoteCount = await prisma.vote.count({ where: { report_id: target.id } });

  console.log('--- Hasil ---');
  console.log(`Wall-clock time: ${durationMs.toFixed(2)} ms`);
  console.log(`Sukses: ${succeeded}/${VOTER_COUNT}, Gagal: ${failed.length}`);
  if (failed.length > 0) {
    console.log('Alasan gagal (unik):', [
      ...new Set(failed.map((r) => (r as PromiseRejectedResult).reason?.message ?? String((r as PromiseRejectedResult).reason))),
    ]);
  }
  console.log(`votes_count sebelum: ${before.votes_count}, sesudah: ${after.votes_count}`);
  console.log(`COUNT(*) FROM votes (aktual): ${actualVoteCount}`);
  const match = after.votes_count === actualVoteCount && after.votes_count === before.votes_count + succeeded;
  console.log(`Konsisten (votes_count == COUNT(*) == sebelum+sukses)? ${match ? 'YA' : 'TIDAK — cek trigger!'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
