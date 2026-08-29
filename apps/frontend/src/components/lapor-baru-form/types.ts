import type { JenisKerusakan, TingkatBahaya } from '../../lib/report-enums'

// Semua field disimpan sebagai string mentah (termasuk angka) — gampang
// dipasang ke <input>/<select> controlled, di-parse pas validasi & submit.
export interface LaporBaruFormState {
  judul: string
  kawasan: string
  jenis_kerusakan: JenisKerusakan | ''
  tingkat_bahaya: TingkatBahaya | ''
  estimasi_terdampak: string
  deskripsi: string
}

export type LaporBaruFormErrors = Partial<Record<keyof LaporBaruFormState, string>>

// Mirror apps/backend/src/reports/dto/create-report.dto.ts — bentuk siap
// kirim ke POST /reports (sudah lolos validasi & ter-parse).
export interface CreateReportPayload {
  judul: string
  deskripsi: string
  kawasan: string
  jenis_kerusakan: JenisKerusakan
  tingkat_bahaya: TingkatBahaya
  estimasi_terdampak: number
}

export interface LaporBaruFormProps {
  onCreated: (reportId: string) => void
}
