import 'dotenv/config';
import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

// Jalanin tanpa argumen: cuma list. Jalanin dengan argumen "--delete": hapus
// semua objek "reports/" yang ketemu (dipakai buat buang sampah hasil
// testing komponen upload foto yang nggak pernah lanjut attachToReport).
async function main(): Promise<void> {
  const result = await client.send(
    new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET, Prefix: 'reports/' }),
  );
  console.log(`Total object: ${result.KeyCount ?? 0}`);
  for (const obj of result.Contents ?? []) {
    console.log(`${obj.Key}  (${obj.Size} bytes, ${obj.LastModified?.toISOString()})`);
  }

  if (process.argv.includes('--delete') && result.Contents?.length) {
    await client.send(
      new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET,
        Delete: { Objects: result.Contents.map((o) => ({ Key: o.Key! })) },
      }),
    );
    console.log(`Dihapus: ${result.Contents.length} objek.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
