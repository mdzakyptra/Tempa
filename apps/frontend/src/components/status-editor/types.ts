import type { StatusLaporan } from '../../lib/report-enums'

export interface StatusEditorProps {
  reportId: string
  currentStatus: StatusLaporan
  /** Dipanggil setelah submit sukses — di luar invalidate query yang sudah dilakukan komponen ini sendiri. */
  onChanged?: () => void
}

// Mirror apps/backend/src/status-history/dto/update-status-response.dto.ts
export interface UpdateStatusResponse {
  report_id: string
  status: StatusLaporan
  riwayat_terbaru: {
    id: string
    report_id: string
    status_lama: StatusLaporan | null
    status_baru: StatusLaporan
    catatan: string | null
    diubah_oleh: string
    diubah_pada: string
  }
}
