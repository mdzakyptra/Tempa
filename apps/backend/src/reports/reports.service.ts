import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ListReportsQueryDto } from './dto/list-reports-query.dto';
import { FindSimilarQueryDto } from './dto/find-similar-query.dto';
import { KAWASAN_JALUR_VITAL } from './constants/jalur-vital.constant';
import {
  BOBOT_BAHAYA,
  BOBOT_TERDAMPAK,
  BOBOT_LAMA_MENUNGGU,
  BOBOT_JALUR_VITAL,
} from './constants/skor-bobot.constant';
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

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  //<---------- create -------------->
  async create(dto: CreateReportDto, userId?: string) {
    return this.prisma.report.create({
      data: {
        id: randomUUID(),
        judul: dto.judul,
        deskripsi: dto.deskripsi,
        kawasan: dto.kawasan,
        jenis_kerusakan: dto.jenis_kerusakan,
        tingkat_bahaya: dto.tingkat_bahaya,
        estimasi_terdampak: dto.estimasi_terdampak,
        jalur_vital: KAWASAN_JALUR_VITAL.includes(dto.kawasan),
        dibuat_oleh: userId,
      },
    });
  }

  //<---------- findAll -------------->
  async findAll(filter: ListReportsQueryDto) {
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

    const rows = await this.prisma.$queryRaw<ReportScoredRow[]>`
      ${this.scoredReportsCte()}
      ${where}
      ORDER BY skor DESC, dibuat_pada ASC
    `;

    return rows.map((row) => this.toListItem(row));
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
  // Keputusan desain (didokumentasikan sesuai instruksi tiket JEK-17, perlu
  // dikonfirmasi ke tim):
  // 1. Radius pencarian pakai kesamaan `kawasan` (persis sama) sebagai proxy —
  //    skema `reports` belum punya kolom koordinat/lat-lng, jadi jarak
  //    geografis beneran belum bisa dihitung (limitasi sama kayak jalur_vital
  //    di JEK-13). Ganti ke radius koordinat begitu data lokasi presisi ada.
  // 2. Laporan berstatus `selesai` atau `ditolak` DIKECUALIKAN dari saran —
  //    laporan yang udah kelar/ditolak nggak relevan buat digabung, warga
  //    cuma perlu disarankan gabung ke laporan yang masih aktif ditangani.
  async findSimilar(query: FindSimilarQueryDto) {
    return this.prisma.report.findMany({
      where: {
        kawasan: query.kawasan,
        jenis_kerusakan: query.jenis_kerusakan,
        status: { notIn: [StatusLaporan.selesai, StatusLaporan.ditolak] },
      },
      orderBy: { dibuat_pada: 'desc' },
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
          id, judul, deskripsi, kawasan, jenis_kerusakan, tingkat_bahaya,
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
      ),
      dinormalisasi AS (
        SELECT
          *,
          LEAST(1.0, jumlah_terdampak / NULLIF(MAX(jumlah_terdampak) OVER (), 0)) AS komponen_terdampak,
          LEAST(1.0, detik_menunggu / NULLIF(MAX(detik_menunggu) OVER (), 0)) AS komponen_lama_menunggu
        FROM mentah
      )
      SELECT
        id, judul, deskripsi, kawasan, jenis_kerusakan, tingkat_bahaya,
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
