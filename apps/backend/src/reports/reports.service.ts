import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ListReportsQueryDto } from './dto/list-reports-query.dto';
import { FindSimilarQueryDto } from './dto/find-similar-query.dto';
import { MergeReportDto } from './dto/merge-report.dto';
import { KAWASAN_JALUR_VITAL } from './constants/jalur-vital.constant';
import {
  BOBOT_BAHAYA,
  BOBOT_TERDAMPAK,
  BOBOT_LAMA_MENUNGGU,
  BOBOT_JALUR_VITAL,
} from './constants/skor-bobot.constant';
import { SIMILARITY_THRESHOLD } from './constants/embedding.constant';
import { GeminiEmbeddingService } from './gemini-embedding.service';
import {
  Prisma,
  JenisKerusakan,
  StatusLaporan,
  TingkatBahaya,
} from '../../generated/prisma/client';


// Baris mentah hasil raw query — nama kolom persis kayak alias di SQL.
interface ReportScoredRow {
  id: string;
  judul: string;
  deskripsi: string;
  kawasan: string;
  lat: number | null;
  lng: number | null;
  jenis_kerusakan: JenisKerusakan;
  tingkat_bahaya: TingkatBahaya;
  estimasi_terdampak: number;
  jalur_vital: boolean;
  votes_count: number;
  status: StatusLaporan;
  dibuat_pada: Date;
  dibuat_oleh: string | null;
  skor: number;
  skor_bahaya: number;
  skor_terdampak: number;
  skor_lama_menunggu: number;
  skor_jalur_vital: number;
}

// Baris mentah hasil query kemiripan (JEK-17 + JEK-19 digabung).
export interface ReportSimilarRow {
  id: string;
  judul: string;
  deskripsi: string;
  kawasan: string;
  jenis_kerusakan: JenisKerusakan;
  tingkat_bahaya: TingkatBahaya;
  estimasi_terdampak: number;
  jalur_vital: boolean;
  votes_count: number;
  status: StatusLaporan;
  dibuat_pada: Date;
  dibuat_oleh: string | null;
  digabung_ke_id: string | null;
  kemiripan: number | null;
  cocok_atribut: boolean;
  cocok_embedding: boolean;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: GeminiEmbeddingService,
  ) {}

  //<---------- create -------------->
  async create(dto: CreateReportDto, userId?: string) {
    const report = await this.prisma.report.create({
      data: {
        id: randomUUID(),
        judul: dto.judul,
        deskripsi: dto.deskripsi,
        kawasan: dto.kawasan,
        lat: dto.lat,
        lng: dto.lng,
        jenis_kerusakan: dto.jenis_kerusakan,
        tingkat_bahaya: dto.tingkat_bahaya,
        estimasi_terdampak: dto.estimasi_terdampak,
        jalur_vital: KAWASAN_JALUR_VITAL.includes(dto.kawasan),
        dibuat_oleh: userId,
      },
    });

    // Sekali per laporan, pas dibuat — bukan dihitung ulang tiap kali
    // deteksi duplikat dipanggil (JEK-19). Sengaja di-await di sini (bukan
    // fire-and-forget) biar kriteria "embedding tersimpan setiap laporan
    // baru dibuat" pasti kepenuhi; kalau Gemini lagi down, embedding cuma
    // tetap null (lihat GeminiEmbeddingService) — create laporan TETAP
    // sukses, gak boleh gagal gara-gara AI down.
    await this.storeEmbedding(report.id, `${dto.judul} ${dto.deskripsi}`);

    return report;
  }

  //<---------- storeEmbedding -------------->
  private async storeEmbedding(reportId: string, text: string): Promise<void> {
    const vector = await this.embeddingService.embed(text);
    if (!vector) return;

    const literal = `[${vector.join(',')}]`;
    await this.prisma.$executeRaw`
      UPDATE reports SET embedding = ${literal}::vector WHERE id = ${reportId}::uuid
    `;
  }

  //<---------- findAll -------------->
  // LIMIT/OFFSET, sama kayak WHERE (lihat catatan di scoredReportsCte),
  // ditempel SETELAH CTE — normalisasi komponen skor tetap dihitung
  // terhadap seluruh tabel, bukan cuma satu halaman.
  //
  // Paginasi cuma aktif kalau page/limit eksplisit ke-set. Lewat HTTP,
  // ListReportsQueryDto SELALU punya nilai (default page=1/limit=10 dari
  // ValidationPipe transform:true). Pemanggil internal (AiAssistantService,
  // butuh SELURUH antrean buat hitung posisi_antrean yang benar) lewat
  // objek literal `{}` — page/limit-nya tetap undefined, jadi diambil semua.
  async findAll(filter: ListReportsQueryDto) {
    const isPaginated = filter.page !== undefined || filter.limit !== undefined;
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions: Prisma.Sql[] = [];
    if (filter.kawasan) {
      conditions.push(Prisma.sql`kawasan = ${filter.kawasan}`);
    }
    if (filter.jenis_kerusakan) {
      conditions.push(
        Prisma.sql`jenis_kerusakan = ${filter.jenis_kerusakan}::"JenisKerusakan"`,
      );
    }
    const where =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
        : Prisma.empty;
    const limitOffset = isPaginated
      ? Prisma.sql`LIMIT ${limit} OFFSET ${offset}`
      : Prisma.empty;

    const [rows, [{ total }]] = await Promise.all([
      this.prisma.$queryRaw<ReportScoredRow[]>`
        ${this.scoredReportsCte()}
        ${where}
        ORDER BY skor DESC, dibuat_pada ASC
        ${limitOffset}
      `,
      this.prisma.$queryRaw<{ total: number }[]>`
        SELECT COUNT(*)::int AS total FROM reports
        WHERE digabung_ke_id IS NULL
        ${conditions.length > 0 ? Prisma.sql`AND ${Prisma.join(conditions, ' AND ')}` : Prisma.empty}
      `,
    ]);

    return {
      items: rows.map((row) => this.toListItem(row)),
      meta: isPaginated
        ? { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
        : { page: 1, limit: total, total, totalPages: 1 },
    };
  }

  //<---------- findOne -------------->
  async findOne(id: string) {
    const rows = await this.prisma.$queryRaw<ReportScoredRow[]>`
      ${this.scoredReportsCte()}
      WHERE id = ${id}::uuid
    `;

    const row = rows[0];
    if (!row) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    return this.toListItem(row);
  }

  //<---------- findSimilar -------------->
  // Keputusan desain (didokumentasikan sesuai instruksi tiket JEK-17/JEK-19,
  // perlu dikonfirmasi ke tim):
  // 1. Radius pencarian atribut pakai kesamaan `kawasan` (persis sama) sebagai
  //    proxy — skema `reports` belum punya kolom koordinat/lat-lng, jadi jarak
  //    geografis beneran belum bisa dihitung (limitasi sama kayak jalur_vital
  //    di JEK-13). Ganti ke radius koordinat begitu data lokasi presisi ada.
  // 2. Laporan berstatus `selesai` atau `ditolak` DIKECUALIKAN dari saran —
  //    laporan yang udah kelar/ditolak nggak relevan buat digabung, warga
  //    cuma perlu disarankan gabung ke laporan yang masih aktif ditangani.
  // 3. `judul`/`deskripsi` opsional (lihat FindSimilarQueryDto) — kalau
  //    dikirim, hasil atribut (JEK-17) DIGABUNG sama hasil kemiripan makna
  //    embedding (JEK-19) dalam satu response, ditandai cocok_atribut /
  //    cocok_embedding per kandidat, dan diurut dari paling mirip. Kalau
  //    nggak dikirim (caller lama), jalan kayak semula — atribut doang,
  //    kemiripan selalu null.
  async findSimilar(query: FindSimilarQueryDto): Promise<ReportSimilarRow[]> {
    if (!query.judul || !query.deskripsi) {
      const rows = await this.prisma.report.findMany({
        where: {
          kawasan: query.kawasan,
          jenis_kerusakan: query.jenis_kerusakan,
          status: { notIn: [StatusLaporan.selesai, StatusLaporan.ditolak] },
          digabung_ke_id: null,
        },
        orderBy: { dibuat_pada: 'desc' },
      });
      return rows.map((r) => ({
        ...r,
        kemiripan: null,
        cocok_atribut: true,
        cocok_embedding: false,
      }));
    }

    const vector = await this.embeddingService.embed(
      `${query.judul} ${query.deskripsi}`,
    );

    // Gemini lagi down/key belum diset — jangan gagalin deteksi duplikat
    // sepenuhnya, mundur ke pencocokan atribut doang (JEK-17).
    if (!vector) {
      return this.findSimilar({
        kawasan: query.kawasan,
        jenis_kerusakan: query.jenis_kerusakan,
      });
    }

    const literal = `[${vector.join(',')}]`;

    // JEK-58: sempat dicoba refactor bentuk CTE (hitung embedding <=> literal
    // sekali, bukan 3x) dengan asumsi lebih murah — tapi diukur pakai
    // EXPLAIN ANALYZE di data 5000 baris, hasilnya malah KONSISTEN lebih
    // lambat (~9ms vs ~6-7ms, buffer hit ~2x lipat, diulang 2x biar bukan
    // noise). Sebabnya: WHERE (cocok_atribut OR embedding_check) di bentuk
    // ASLI ini manfaatin short-circuit OR — baris yang cocok_atribut TRUE
    // (kawasan+jenis match) SAMA SEKALI skip hitung jarak vektor. Bentuk
    // CTE ngitung buat SEMUA baris tanpa syarat duluan, baru difilter —
    // kehilangan keuntungan short-circuit itu meski "cuma dihitung 1x".
    // Makanya bentuk ini dipertahankan apa adanya, bukan "dioptimasi".
    return this.prisma.$queryRaw<ReportSimilarRow[]>`
      SELECT
        id, judul, deskripsi, kawasan, jenis_kerusakan, tingkat_bahaya,
        estimasi_terdampak, jalur_vital, votes_count, status, dibuat_pada,
        dibuat_oleh, digabung_ke_id,
        (kawasan = ${query.kawasan}
          AND jenis_kerusakan = ${query.jenis_kerusakan}::"JenisKerusakan") AS cocok_atribut,
        (embedding IS NOT NULL
          AND (1 - (embedding <=> ${literal}::vector)) >= ${SIMILARITY_THRESHOLD}) AS cocok_embedding,
        CASE WHEN embedding IS NOT NULL
          THEN ROUND((1 - (embedding <=> ${literal}::vector))::numeric, 4)::float8
          ELSE NULL
        END AS kemiripan
      FROM reports
      WHERE digabung_ke_id IS NULL
        AND status NOT IN ('selesai', 'ditolak')
        AND (
          (kawasan = ${query.kawasan}
            AND jenis_kerusakan = ${query.jenis_kerusakan}::"JenisKerusakan")
          OR (embedding IS NOT NULL
            AND (1 - (embedding <=> ${literal}::vector)) >= ${SIMILARITY_THRESHOLD})
        )
      ORDER BY kemiripan DESC NULLS LAST, dibuat_pada DESC
    `;
  }

  //<---------- merge -------------->
  // Keputusan desain JEK-18 (didokumentasikan sesuai instruksi tiket):
  // 1. Laporan duplikat DISIMPAN sebagai referensi (kolom digabung_ke_id),
  //    bukan dihapus — riwayat & foto (report_photos) tetap utuh nempel di
  //    baris aslinya, cuma dikeluarkan dari daftar aktif (lihat WHERE di
  //    scoredReportsCte). Konsekuensinya: GET /reports/:id buat laporan yang
  //    sudah digabung akan 404, karena dia sengaja dikeluarkan dari query
  //    skor bersama — bukan hilang datanya, cuma nggak lagi dianggap "aktif".
  // 2. Vote di laporan duplikat DIPINDAH ke laporan utama (bukan dihitung
  //    ulang manual), supaya trigger votes_count (JEK-21) tetap jadi satu
  //    sumber kebenaran. Kalau user yang sama udah vote di laporan utama
  //    juga, vote duplikatnya cuma dihapus (bukan dipindah) buat menghindari
  //    duplikat dukungan dari satu orang.
  async merge(duplicateId: string, dto: MergeReportDto) {
    const primaryId = dto.laporan_utama_id;

    if (duplicateId === primaryId) {
      throw new BadRequestException(
        'Laporan tidak bisa digabung ke dirinya sendiri',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const [duplicate, primary] = await Promise.all([
        tx.report.findUnique({ where: { id: duplicateId } }),
        tx.report.findUnique({ where: { id: primaryId } }),
      ]);

      if (!duplicate) {
        throw new NotFoundException('Laporan yang mau digabung tidak ditemukan');
      }
      if (!primary) {
        throw new NotFoundException('Laporan utama tujuan gabung tidak ditemukan');
      }
      if (duplicate.digabung_ke_id) {
        throw new ConflictException('Laporan ini sudah pernah digabung sebelumnya');
      }
      if (primary.digabung_ke_id) {
        throw new ConflictException(
          'Laporan tujuan sudah jadi duplikat laporan lain — gabung langsung ke laporan utamanya',
        );
      }

      const votesDuplikat = await tx.vote.findMany({
        where: { report_id: duplicateId },
      });
      const votesPrimary = await tx.vote.findMany({
        where: { report_id: primaryId },
        select: { user_id: true },
      });
      const userSudahVotePrimary = new Set(votesPrimary.map((v) => v.user_id));

      for (const vote of votesDuplikat) {
        await tx.vote.delete({ where: { id: vote.id } });
        if (!userSudahVotePrimary.has(vote.user_id)) {
          await tx.vote.create({
            data: {
              id: randomUUID(),
              report_id: primaryId,
              user_id: vote.user_id,
              dibuat_pada: vote.dibuat_pada,
            },
          });
        }
      }

      return tx.report.update({
        where: { id: duplicateId },
        data: { digabung_ke_id: primaryId },
      });
    });
  }

  //<---------- scoredReportsCte -------------->
  // Query bersama dipakai findAll (JEK-14) & findOne (JEK-15) supaya rumus
  // skor nggak dobel dan hasilnya selalu konsisten di kedua endpoint.
  //
  // Normalisasi komponen jumlah_terdampak & lama_menunggu sengaja dihitung
  // relatif terhadap SELURUH laporan di tabel (window function tanpa WHERE
  // di CTE ini) — bukan cuma hasil yang sudah difilter/dibatasi. Kalau
  // normalisasi ikut kena filter, skor laporan yang sama bisa beda antara
  // daftar (difilter kawasan) dan detail (cuma 1 baris, otomatis 100%),
  // padahal kriteria JEK-15 minta angkanya konsisten. Filter/`WHERE id=`
  // makanya ditempel oleh caller SETELAH CTE ini, bukan di dalamnya.
  private scoredReportsCte(): Prisma.Sql {
    return Prisma.sql`
      WITH mentah AS (
        SELECT
          id, judul, deskripsi, kawasan, lat, lng, jenis_kerusakan, tingkat_bahaya,
          estimasi_terdampak, jalur_vital, votes_count, status, dibuat_pada, dibuat_oleh,
          (CASE tingkat_bahaya
            WHEN 'rendah' THEN 0.25
            WHEN 'sedang' THEN 0.5
            WHEN 'tinggi' THEN 0.75
            WHEN 'darurat' THEN 1.0
          END)::float8 AS komponen_bahaya,
          (estimasi_terdampak + votes_count)::float8 AS jumlah_terdampak,
          EXTRACT(EPOCH FROM (now() - dibuat_pada))::float8 AS detik_menunggu,
          (CASE WHEN jalur_vital THEN 1.0 ELSE 0.0 END)::float8 AS komponen_jalur_vital
        FROM reports
        WHERE digabung_ke_id IS NULL
      ),
      dinormalisasi AS (
        SELECT
          *,
          LEAST(1.0, jumlah_terdampak / NULLIF(MAX(jumlah_terdampak) OVER (), 0)) AS komponen_terdampak,
          LEAST(1.0, detik_menunggu / NULLIF(MAX(detik_menunggu) OVER (), 0)) AS komponen_lama_menunggu
        FROM mentah
      )
      SELECT
        id, judul, deskripsi, kawasan, lat, lng, jenis_kerusakan, tingkat_bahaya,
        estimasi_terdampak, jalur_vital, votes_count, status, dibuat_pada, dibuat_oleh,
        ROUND((
          komponen_bahaya * ${Prisma.raw(String(BOBOT_BAHAYA))}
          + COALESCE(komponen_terdampak, 0) * ${Prisma.raw(String(BOBOT_TERDAMPAK))}
          + COALESCE(komponen_lama_menunggu, 0) * ${Prisma.raw(String(BOBOT_LAMA_MENUNGGU))}
          + komponen_jalur_vital * ${Prisma.raw(String(BOBOT_JALUR_VITAL))}
        )::numeric * 100, 2)::float8 AS skor,
        ROUND((komponen_bahaya * 100)::numeric, 2)::float8 AS skor_bahaya,
        ROUND((COALESCE(komponen_terdampak, 0) * 100)::numeric, 2)::float8 AS skor_terdampak,
        ROUND((COALESCE(komponen_lama_menunggu, 0) * 100)::numeric, 2)::float8 AS skor_lama_menunggu,
        ROUND((komponen_jalur_vital * 100)::numeric, 2)::float8 AS skor_jalur_vital
      FROM dinormalisasi
    `;
  }

  //<---------- toListItem -------------->
  private toListItem(row: ReportScoredRow) {
    return {
      id: row.id,
      judul: row.judul,
      deskripsi: row.deskripsi,
      kawasan: row.kawasan,
      lat: row.lat,
      lng: row.lng,
      jenis_kerusakan: row.jenis_kerusakan,
      tingkat_bahaya: row.tingkat_bahaya,
      estimasi_terdampak: row.estimasi_terdampak,
      jalur_vital: row.jalur_vital,
      votes_count: row.votes_count,
      status: row.status,
      dibuat_pada: row.dibuat_pada,
      dibuat_oleh: row.dibuat_oleh,
      skor: row.skor,
      skor_komponen: {
        bahaya: row.skor_bahaya,
        terdampak: row.skor_terdampak,
        lama_menunggu: row.skor_lama_menunggu,
        jalur_vital: row.skor_jalur_vital,
      },
    };
  }
}
