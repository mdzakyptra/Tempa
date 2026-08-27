import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Peran,
  JenisKerusakan,
  TingkatBahaya,
} from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const SALT_ROUNDS = 10;
const SEED_PASSWORD = 'password123';

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

interface ReportSeed {
  judul: string;
  deskripsi: string;
  kawasan: string;
  jenis_kerusakan: JenisKerusakan;
  tingkat_bahaya: TingkatBahaya;
  estimasi_terdampak: number;
  jalur_vital: boolean;
  dibuat_pada: Date;
}

// Template judul+deskripsi per jenis kerusakan, dipakai buat generate laporan acak
const TEMPLATES: Record<JenisKerusakan, { judul: string; deskripsi: string }[]> = {
  jalan: [
    {
      judul: 'Jalan berlubang bikin motor sering jatuh',
      deskripsi:
        'Lubang di tengah jalan sudah sedalam 15cm, tiap malam ada motor yang kepeleset karena gak kelihatan.',
    },
    {
      judul: 'Aspal retak parah sepanjang 20 meter',
      deskripsi:
        'Retakan aspal makin lebar tiap hari hujan, dikhawatirkan ambruk kalau dilewati truk.',
    },
    {
      judul: 'Jalan bergelombang dekat perempatan',
      deskripsi:
        'Permukaan jalan bergelombang parah, kendaraan roda dua harus ngerem mendadak buat hindari.',
    },
  ],
  trotoar: [
    {
      judul: 'Ubin trotoar copot dan bikin tersandung',
      deskripsi:
        'Beberapa ubin trotoar lepas dari dudukannya, pejalan kaki termasuk lansia sering tersandung.',
    },
    {
      judul: 'Trotoar amblas dekat halte',
      deskripsi:
        'Bagian trotoar dekat halte amblas sekitar 10cm, air hujan menggenang dan licin.',
    },
    {
      judul: 'Paving trotoar berantakan sepanjang gang',
      deskripsi:
        'Paving block trotoar naik turun tidak rata, kursi roda dan stroller susah lewat.',
    },
  ],
  lampu_jalan: [
    {
      judul: 'Lampu jalan mati total sejak seminggu lalu',
      deskripsi:
        'Sepanjang jalan gelap gulita malam hari, warga khawatir rawan begal dan kecelakaan.',
    },
    {
      judul: 'Penerangan jalan kedap-kedip terus',
      deskripsi:
        'Lampu jalan nyala mati terus tiap beberapa detik, kemungkinan ada masalah di panel listriknya.',
    },
    {
      judul: 'Tiang lampu jalan miring dan berkarat',
      deskripsi:
        'Tiang lampu miring hampir 30 derajat, karatan di bagian bawah, khawatir roboh kena angin kencang.',
    },
  ],
  drainase: [
    {
      judul: 'Got tersumbat sampah, air meluap ke jalan',
      deskripsi:
        'Saluran got penuh sampah plastik dan lumpur, tiap hujan deras air langsung meluap ke badan jalan.',
    },
    {
      judul: 'Drainase mampet bikin banjir kecil tiap hujan',
      deskripsi:
        'Aliran drainase tersumbat, genangan air setinggi mata kaki muncul tiap hujan lebih dari 30 menit.',
    },
    {
      judul: 'Saluran air rusak, bau tidak sedap menyebar',
      deskripsi:
        'Dinding saluran air jebol sebagian, air kotor merembes ke permukiman dan menimbulkan bau.',
    },
  ],
  jembatan: [
    {
      judul: 'Jembatan kayu penyeberangan mulai lapuk',
      deskripsi:
        'Papan kayu jembatan penyeberangan sudah keropos di beberapa titik, warga takut ambruk.',
    },
    {
      judul: 'Pagar pengaman jembatan patah',
      deskripsi:
        'Pagar besi pengaman jembatan patah dan berkarat, anak-anak sering main dekat sisi terbuka.',
    },
    {
      judul: 'Struktur jembatan bergetar saat dilewati kendaraan',
      deskripsi:
        'Jembatan terasa bergetar cukup keras tiap dilewati kendaraan roda empat, dikhawatirkan ada retak struktur.',
    },
  ],
  fasilitas_umum: [
    {
      judul: 'Bangku taman rusak dan berkarat',
      deskripsi:
        'Bangku besi di taman warga sudah keropos, pengunjung beberapa kali kejeblos saat duduk.',
    },
    {
      judul: 'Toilet umum rusak dan tidak terawat',
      deskripsi:
        'Pintu dan kran toilet umum rusak sejak lama, warga terpaksa cari fasilitas lain.',
    },
    {
      judul: 'Halte bus atapnya bocor parah',
      deskripsi:
        'Atap halte bocor di banyak titik, penumpang basah kuyup kalau hujan sambil nunggu bus.',
    },
  ],
  lainnya: [
    {
      judul: 'Tiang listrik miring dekat permukiman padat',
      deskripsi:
        'Tiang listrik condong ke arah rumah warga, kabel kendur menyentuh atap seng.',
    },
    {
      judul: 'Rambu lalu lintas roboh belum diperbaiki',
      deskripsi:
        'Rambu peringatan tikungan tajam roboh tertabrak, belum ada penggantinya sehingga rawan kecelakaan.',
    },
  ],
};

// Pasangan laporan sengaja mirip makna, beda kalimat — buat uji deteksi
// duplikat berbasis embedding (JEK-19). Kawasan sengaja disamakan per pasang.
const DUPLICATE_PAIRS: [ReportSeed, ReportSeed][] = [
  [
    {
      judul: 'Jalan berlubang depan pasar',
      deskripsi:
        'Lubang cukup dalam di jalur utama depan pasar, sudah dua minggu belum diperbaiki dan bikin macet.',
      kawasan: 'Kelurahan Sukajadi',
      jenis_kerusakan: JenisKerusakan.jalan,
      tingkat_bahaya: TingkatBahaya.tinggi,
      estimasi_terdampak: 120,
      jalur_vital: true,
      dibuat_pada: daysAgo(18),
    },
    {
      judul: 'Aspal ambles dekat pasar',
      deskripsi:
        'Permukaan aspal ambles di jalur utama dekat pasar, motor sering oleng menghindarinya.',
      kawasan: 'Kelurahan Sukajadi',
      jenis_kerusakan: JenisKerusakan.jalan,
      tingkat_bahaya: TingkatBahaya.tinggi,
      estimasi_terdampak: 95,
      jalur_vital: true,
      dibuat_pada: daysAgo(16),
    },
  ],
  [
    {
      judul: 'Lampu jalan mati total di gang Melati',
      deskripsi:
        'Sepanjang gang Melati gelap total sejak lampu jalan padam, warga was-was tiap pulang malam.',
      kawasan: 'Kelurahan Cicadas',
      jenis_kerusakan: JenisKerusakan.lampu_jalan,
      tingkat_bahaya: TingkatBahaya.sedang,
      estimasi_terdampak: 60,
      jalur_vital: false,
      dibuat_pada: daysAgo(25),
    },
    {
      judul: 'Penerangan jalan padam di gang Melati',
      deskripsi:
        'Penerangan jalan umum di gang Melati padam beberapa hari, gelap gulita kalau malam.',
      kawasan: 'Kelurahan Cicadas',
      jenis_kerusakan: JenisKerusakan.lampu_jalan,
      tingkat_bahaya: TingkatBahaya.sedang,
      estimasi_terdampak: 55,
      jalur_vital: false,
      dibuat_pada: daysAgo(23),
    },
  ],
  [
    {
      judul: 'Trotoar retak berbahaya buat pejalan kaki',
      deskripsi:
        'Trotoar depan sekolah retak dan bercelah lebar, siswa jalan kaki rawan kesandung.',
      kawasan: 'Kelurahan Dago',
      jenis_kerusakan: JenisKerusakan.trotoar,
      tingkat_bahaya: TingkatBahaya.tinggi,
      estimasi_terdampak: 200,
      jalur_vital: true,
      dibuat_pada: daysAgo(10),
    },
    {
      judul: 'Ubin trotoar pecah dekat sekolah',
      deskripsi:
        'Ubin trotoar di depan gerbang sekolah pecah berantakan, rawan bikin anak-anak jatuh.',
      kawasan: 'Kelurahan Dago',
      jenis_kerusakan: JenisKerusakan.trotoar,
      tingkat_bahaya: TingkatBahaya.tinggi,
      estimasi_terdampak: 180,
      jalur_vital: true,
      dibuat_pada: daysAgo(8),
    },
  ],
  [
    {
      judul: 'Saluran got tersumbat, air meluap ke rumah warga',
      deskripsi:
        'Got di RW 05 tersumbat sampah, tiap hujan deras air meluap sampai masuk ke halaman rumah.',
      kawasan: 'Kelurahan Kopo',
      jenis_kerusakan: JenisKerusakan.drainase,
      tingkat_bahaya: TingkatBahaya.darurat,
      estimasi_terdampak: 150,
      jalur_vital: false,
      dibuat_pada: daysAgo(5),
    },
    {
      judul: 'Drainase mampet, banjir kecil tiap hujan',
      deskripsi:
        'Drainase di RW 05 mampet total, banjir setinggi mata kaki muncul tiap hujan lebih dari sejam.',
      kawasan: 'Kelurahan Kopo',
      jenis_kerusakan: JenisKerusakan.drainase,
      tingkat_bahaya: TingkatBahaya.darurat,
      estimasi_terdampak: 140,
      jalur_vital: false,
      dibuat_pada: daysAgo(4),
    },
  ],
  [
    {
      judul: 'Jembatan kayu penyeberangan mulai lapuk',
      deskripsi:
        'Papan jembatan kayu penghubung dua RT sudah keropos, beberapa papan patah saat diinjak.',
      kawasan: 'Kelurahan Antapani',
      jenis_kerusakan: JenisKerusakan.jembatan,
      tingkat_bahaya: TingkatBahaya.tinggi,
      estimasi_terdampak: 80,
      jalur_vital: false,
      dibuat_pada: daysAgo(30),
    },
    {
      judul: 'Struktur jembatan kayu keropos dan goyang',
      deskripsi:
        'Jembatan kayu penghubung RT terasa goyang dan keropos di bagian penyangga, warga takut ambruk.',
      kawasan: 'Kelurahan Antapani',
      jenis_kerusakan: JenisKerusakan.jembatan,
      tingkat_bahaya: TingkatBahaya.tinggi,
      estimasi_terdampak: 70,
      jalur_vital: false,
      dibuat_pada: daysAgo(28),
    },
  ],
];

//<---------- daysAgo -------------->
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - randomInt(0, 23));
  return date;
}

//<---------- randomInt -------------->
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//<---------- pick -------------->
function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

//<---------- buildRandomReports -------------->
function buildRandomReports(count: number): ReportSeed[] {
  const jenisList = Object.values(JenisKerusakan);
  const bahayaList = Object.values(TingkatBahaya);
  const reports: ReportSeed[] = [];

  for (let i = 0; i < count; i++) {
    const jenis = jenisList[i % jenisList.length];
    const template = pick(TEMPLATES[jenis]);

    reports.push({
      judul: template.judul,
      deskripsi: template.deskripsi,
      kawasan: pick(KAWASAN_LIST),
      jenis_kerusakan: jenis,
      tingkat_bahaya: pick(bahayaList),
      estimasi_terdampak: randomInt(5, 300),
      jalur_vital: Math.random() < 0.25,
      dibuat_pada: daysAgo(randomInt(0, 60)),
    });
  }

  return reports;
}

//<---------- resetData -------------->
async function resetData(): Promise<void> {
  // Urutan hapus ikutin arah relasi FK, biar script aman dijalankan berkali-kali
  // tanpa data menumpuk (baik di Postgres lokal maupun Supabase).
  await prisma.vote.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.reportPhoto.deleteMany();
  await prisma.report.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.profile.deleteMany();
}

//<---------- seedProfiles -------------->
async function seedProfiles(): Promise<{ warga: string[]; petugas: string[] }> {
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);
  const warga: string[] = [];
  const petugas: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const id = randomUUID();
    await prisma.profile.create({
      data: {
        id,
        nama: `Warga Seed ${i}`,
        email: `warga${i}@seed.local`,
        password: hashedPassword,
        peran: Peran.warga,
      },
    });
    warga.push(id);
  }

  for (let i = 0; i < 2; i++) {
    const id = randomUUID();
    await prisma.profile.create({
      data: {
        id,
        nama: `Petugas Seed ${i + 1}`,
        email: `petugas${i + 1}@seed.local`,
        password: hashedPassword,
        peran: Peran.petugas,
        kawasan_tugas: KAWASAN_LIST[i],
      },
    });
    petugas.push(id);
  }

  return { warga, petugas };
}

//<---------- seedReports -------------->
async function seedReports(wargaIds: string[]): Promise<string[]> {
  const pairedReports = DUPLICATE_PAIRS.flat();
  const randomReports = buildRandomReports(40);
  const allReports = [...pairedReports, ...randomReports];
  const reportIds: string[] = [];

  for (const report of allReports) {
    const created = await prisma.report.create({
      data: {
        id: randomUUID(),
        ...report,
        dibuat_oleh: pick(wargaIds),
        // Embedding sengaja dibiarkan null di sini — JEK-19 (deteksi embedding)
        // belum selesai saat seed ini ditulis. Begitu endpoint AI-nya siap,
        // jalankan ulang generate embedding buat semua laporan yang embedding-nya null.
      },
    });
    reportIds.push(created.id);
  }

  return reportIds;
}

//<---------- seedVotes -------------->
async function seedVotes(reportIds: string[], wargaIds: string[]): Promise<void> {
  for (const reportId of reportIds) {
    const voteCount = randomInt(0, Math.min(15, wargaIds.length));
    const voters = [...wargaIds].sort(() => Math.random() - 0.5).slice(0, voteCount);

    for (const userId of voters) {
      await prisma.vote.create({
        data: {
          id: randomUUID(),
          report_id: reportId,
          user_id: userId,
          dibuat_pada: daysAgo(randomInt(0, 30)),
        },
      });
    }
  }
}

//<---------- main -------------->
async function main(): Promise<void> {
  await resetData();

  const { warga } = await seedProfiles();
  const reportIds = await seedReports(warga);
  await seedVotes(reportIds, warga);

  console.log(
    `Seed selesai: ${reportIds.length} laporan, ${warga.length} warga, votes tersebar acak.`,
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
