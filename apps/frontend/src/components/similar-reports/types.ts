import type { JenisKerusakan, TingkatBahaya } from '../../lib/report-enums'

// Mirror apps/backend/src/reports/dto/report-similar-item.dto.ts
export interface ReportSimilarItem {
  id: string
  judul: string
  deskripsi: string
  kawasan: string
  jenis_kerusakan: JenisKerusakan
  tingkat_bahaya: TingkatBahaya
  estimasi_terdampak: number
  jalur_vital: boolean
  votes_count: number
  status: string
  dibuat_pada: string
  dibuat_oleh: string | null
  digabung_ke_id: string | null
  kemiripan: number | null
  cocok_atribut: boolean
  cocok_embedding: boolean
}

export interface SimilarReportsParams {
  kawasan: string
  jenis_kerusakan: JenisKerusakan | ''
  judul?: string
  deskripsi?: string
}

export interface SimilarReportsSuggestionProps extends SimilarReportsParams {
  // Sisa field CreateReportDto (JEK-13) — opsional. Kalau SEMUA ini ada &
  // valid, tombol "Gabungkan" beneran submit laporan baru lalu merge-in ke
  // laporan existing (JEK-18) — bukan cuma navigasi. Kalau form belum
  // lengkap (misal warga baru ngisi kawasan+jenis), fallback ke navigasi
  // biasa ke laporan existing tanpa submit apa-apa.
  tingkat_bahaya?: TingkatBahaya | ''
  estimasi_terdampak?: number
  onMerged?: (laporanUtamaId: string) => void
}
