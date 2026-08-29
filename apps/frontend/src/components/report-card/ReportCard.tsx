import { Link } from 'react-router-dom'
import { MapPin, ThumbsUp } from 'lucide-react'
import { cn } from '../../lib/cn'
import { JENIS_KERUSAKAN_LABEL } from './constants'

export interface ReportListItem {
  id: string
  judul: string
  deskripsi: string
  kawasan: string
  lat: number | null
  lng: number | null
  jenis_kerusakan: 'jalan' | 'trotoar' | 'lampu_jalan' | 'drainase' | 'jembatan' | 'fasilitas_umum' | 'lainnya'
  tingkat_bahaya: 'rendah' | 'sedang' | 'tinggi' | 'darurat'
  estimasi_terdampak: number
  jalur_vital: boolean
  votes_count: number
  status: 'menunggu' | 'diproses' | 'selesai' | 'ditolak'
  dibuat_pada: string
  dibuat_oleh: string | null
  skor: number
  skor_komponen: { bahaya: number; terdampak: number; lama_menunggu: number; jalur_vital: number }
}

interface ReportCardProps {
  report: ReportListItem
}

const TINGKAT_BAHAYA_STYLE: Record<ReportListItem['tingkat_bahaya'], string> = {
  rendah: 'bg-neutral-100 text-neutral-600',
  sedang: 'bg-yellow-100 text-yellow-700',
  tinggi: 'bg-orange-100 text-orange-700',
  darurat: 'bg-red-100 text-red-700',
}

//<---------- skorBadgeStyle -------------->
function skorBadgeStyle(skor: number) {
  if (skor >= 70) return 'bg-black text-white'
  if (skor >= 40) return 'bg-neutral-700 text-white'
  return 'bg-neutral-200 text-neutral-700'
}

//<---------- ReportCard -------------->
export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      to={`/laporan/${report.id}`}
      className="block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-neutral-900">{report.judul}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {report.kawasan} &middot; {JENIS_KERUSAKAN_LABEL[report.jenis_kerusakan]}
            </span>
          </p>
        </div>
        <span className={cn('shrink-0 rounded-full px-3 py-1 text-sm font-bold', skorBadgeStyle(report.skor))}>
          {Math.round(report.skor)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={cn(
            'rounded-full px-2.5 py-1 font-medium capitalize',
            TINGKAT_BAHAYA_STYLE[report.tingkat_bahaya],
          )}
        >
          {report.tingkat_bahaya}
        </span>
        {report.jalur_vital && (
          <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">Jalur Vital</span>
        )}
        <span className="ml-auto flex items-center gap-1 text-neutral-500">
          <ThumbsUp className="h-3.5 w-3.5" />
          {report.votes_count}
        </span>
      </div>
    </Link>
  )
}
