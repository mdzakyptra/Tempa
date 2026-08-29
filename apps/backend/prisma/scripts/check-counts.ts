import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main(): Promise<void> {
  const [row] = await prisma.$queryRaw<{
    profiles: bigint;
    reports: bigint;
    votes: bigint;
    report_photos: bigint;
  }[]>`
    SELECT
      (SELECT count(*) FROM profiles) AS profiles,
      (SELECT count(*) FROM reports) AS reports,
      (SELECT count(*) FROM votes) AS votes,
      (SELECT count(*) FROM report_photos) AS report_photos
  `;
  console.log(row);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
