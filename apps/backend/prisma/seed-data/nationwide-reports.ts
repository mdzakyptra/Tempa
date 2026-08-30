// Data laporan tersebar di kota-kota jauh se-Indonesia (bukan cuma seputar
// Bandung kayak KAWASAN_LIST di seed.ts) — buat nunjukkin antrean & peta
// yang beneran nasional. Sengaja file terpisah dari seed.ts (bukan
// digabung langsung di sana): seed.ts punya `main().catch(...)` yang
// jalan otomatis begitu di-import sebagai modul, jadi taruh data murni di
// sini biar aman diimpor dari script lain (mis. add-nationwide-reports.ts)
// tanpa ikut memicu reset+seed penuh.
//
// `import type` di bawah ini di-erase total pas kompilasi (verbatimModuleSyntax
// di tsconfig) — jadi tetap nggak ada risiko nyeret runtime seed.ts.
import type { ReportSeed } from '../seed';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

// TODO: batch berikutnya nambahin kota di luar Indonesia — sengaja belum
// sekarang sesuai arahan, satu negara dulu sampai antrean nasionalnya mantap.
export const NATIONWIDE_REPORTS: ReportSeed[] = [
  {
    judul: 'Jalan ambles parah di dekat Bundaran HI',
    deskripsi:
      'Aspal ambles sedalam 30cm di jalur utama dekat Bundaran HI, macet parah tiap jam sibuk dan berbahaya buat pengendara motor.',
    kawasan: 'Jakarta Pusat',
    jenis_kerusakan: 'jalan',
    tingkat_bahaya: 'tinggi',
    estimasi_terdampak: 250,
    jalur_vital: true,
    dibuat_pada: daysAgo(3),
    lat: -6.1751,
    lng: 106.865,
  },
  {
    judul: 'Drainase jebol bikin banjir separuh kompleks',
    deskripsi:
      'Saluran drainase utama jebol, air meluap ke perumahan warga tiap hujan deras, sudah 2 minggu belum ditangani.',
    kawasan: 'Surabaya',
    jenis_kerusakan: 'drainase',
    tingkat_bahaya: 'darurat',
    estimasi_terdampak: 400,
    jalur_vital: false,
    dibuat_pada: daysAgo(7),
    lat: -7.2575,
    lng: 112.7521,
  },
  {
    judul: 'Jalan berlubang di jalur menuju pasar tradisional',
    deskripsi:
      'Beberapa lubang cukup dalam di jalur utama menuju pasar, sering bikin kendaraan roda dua oleng.',
    kawasan: 'Medan',
    jenis_kerusakan: 'jalan',
    tingkat_bahaya: 'sedang',
    estimasi_terdampak: 80,
    jalur_vital: true,
    dibuat_pada: daysAgo(15),
    lat: 3.5952,
    lng: 98.6722,
  },
  {
    judul: 'Trotoar retak di sepanjang jalan pesisir',
    deskripsi:
      'Ubin trotoar retak dan bergelombang di beberapa titik sepanjang jalan pesisir, mengganggu pejalan kaki sore hari.',
    kawasan: 'Makassar',
    jenis_kerusakan: 'trotoar',
    tingkat_bahaya: 'rendah',
    estimasi_terdampak: 40,
    jalur_vital: false,
    dibuat_pada: daysAgo(20),
    lat: -5.1477,
    lng: 119.4327,
  },
  {
    judul: 'Lampu jalan padam total di kawasan wisata',
    deskripsi:
      'Penerangan jalan mati sejak seminggu lalu, kawasan jadi gelap gulita malam hari, wisatawan dan warga was-was.',
    kawasan: 'Denpasar',
    jenis_kerusakan: 'lampu_jalan',
    tingkat_bahaya: 'sedang',
    estimasi_terdampak: 60,
    jalur_vital: false,
    dibuat_pada: daysAgo(9),
    lat: -8.6705,
    lng: 115.2126,
  },
  {
    judul: 'Halte bus rusak dan atapnya bocor',
    deskripsi:
      'Atap halte bocor parah, penumpang kehujanan tiap nunggu bus, bangku juga sudah banyak yang patah.',
    kawasan: 'Yogyakarta',
    jenis_kerusakan: 'fasilitas_umum',
    tingkat_bahaya: 'sedang',
    estimasi_terdampak: 100,
    jalur_vital: false,
    dibuat_pada: daysAgo(12),
    lat: -7.7956,
    lng: 110.3695,
  },
  {
    judul: 'Jembatan penghubung retak struktur',
    deskripsi:
      'Retakan struktur terlihat jelas di tiang penyangga jembatan penghubung dua kecamatan, warga khawatir ambruk.',
    kawasan: 'Palembang',
    jenis_kerusakan: 'jembatan',
    tingkat_bahaya: 'tinggi',
    estimasi_terdampak: 150,
    jalur_vital: true,
    dibuat_pada: daysAgo(5),
    lat: -2.9761,
    lng: 104.7754,
  },
  {
    judul: 'Jalan utama menuju pelabuhan longsor sebagian',
    deskripsi:
      'Sebagian badan jalan menuju pelabuhan longsor akibat hujan deras, lebar jalan tinggal separuh, rawan kecelakaan.',
    kawasan: 'Balikpapan',
    jenis_kerusakan: 'jalan',
    tingkat_bahaya: 'tinggi',
    estimasi_terdampak: 120,
    jalur_vital: true,
    dibuat_pada: daysAgo(2),
    lat: -1.2379,
    lng: 116.8529,
  },
  {
    judul: 'Got tersumbat bikin genangan tiap hujan',
    deskripsi:
      'Saluran got penuh sedimen dan sampah, genangan air muncul tiap hujan turun lebih dari 20 menit.',
    kawasan: 'Manado',
    jenis_kerusakan: 'drainase',
    tingkat_bahaya: 'sedang',
    estimasi_terdampak: 70,
    jalur_vital: false,
    dibuat_pada: daysAgo(18),
    lat: 1.4748,
    lng: 124.8421,
  },
  {
    judul: 'Tiang listrik miring dekat permukiman',
    deskripsi:
      'Tiang listrik condong ke arah rumah warga akibat tanah labil, kabel kendur menyentuh atap rumah.',
    kawasan: 'Jayapura',
    jenis_kerusakan: 'lainnya',
    tingkat_bahaya: 'sedang',
    estimasi_terdampak: 50,
    jalur_vital: false,
    dibuat_pada: daysAgo(25),
    lat: -2.5337,
    lng: 140.7181,
  },
];
