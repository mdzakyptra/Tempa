import type { ReportListItem } from './ReportCard'

export const JENIS_KERUSAKAN_LABEL: Record<ReportListItem['jenis_kerusakan'], string> = {
  jalan: 'Jalan',
  trotoar: 'Trotoar',
  lampu_jalan: 'Lampu Jalan',
  drainase: 'Drainase',
  jembatan: 'Jembatan',
  fasilitas_umum: 'Fasilitas Umum',
  lainnya: 'Lainnya',
}
