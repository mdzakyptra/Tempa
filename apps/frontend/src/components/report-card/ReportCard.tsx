import { Link } from 'react-router-dom'
import { MapPin, Route, ThumbsUp } from 'lucide-react'
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
  foto_url: string | null
  skor: number
  skor_komponen: { bahaya: number; terdampak: number; lama_menunggu: number; jalur_vital: number }
}

interface ReportCardProps {
  report: ReportListItem
  /** Urutan tampil (1-based) — dicetak sebagai indeks angka besar di sisi kartu. */
  index: number
  onSelect?: () => void
}

const TINGKAT_BAHAYA_DOT: Record<ReportListItem['tingkat_bahaya'], string> = {
  rendah: 'bg-neutral-400',
  sedang: 'bg-yellow-500',
  tinggi: 'bg-orange-500',
  darurat: 'bg-red-500',
}

//<---------- skorBadgeStyle -------------->
function skorBadgeStyle(skor: number) {
  if (skor >= 70) return 'bg-black text-white'
  if (skor >= 40) return 'bg-neutral-700 text-white'
  return 'bg-neutral-200 text-neutral-700'
}

//<---------- ReportCard -------------->
export default function ReportCard({ report, index, onSelect }: ReportCardProps) {
  const hasPhoto = Boolean(report.foto_url)

  return (
    <Link
      to={`/laporan/${report.id}`}
      onClick={
        onSelect
          ? (event) => {
              event.preventDefault()
              onSelect()
            }
          : undefined
      }
      className="group relative flex gap-4 overflow-hidden rounded-2xl border border-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.25)] sm:p-6"
      >
      {hasPhoto && (
        <div className="absolute inset-0" aria-hidden>
          <img src={report.foto_url!} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.08)_36%,rgba(255,255,255,0.45)_68%,rgba(255,255,255,0.9)_88%,#fff_100%)] backdrop-blur-[1px]" />
        </div>
      )}
      <span
        aria-hidden
        className={cn('relative hidden shrink-0 select-none font-mono text-4xl font-black leading-none tracking-tighter transition-colors duration-300 sm:block', hasPhoto ? 'text-white drop-shadow-md group-hover:text-white' : 'text-black/10 group-hover:text-black/20')}
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="relative min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-tight text-neutral-900">{report.judul}</h3>
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-700">
            <span className={cn('h-1.5 w-1.5 rounded-full', TINGKAT_BAHAYA_DOT[report.tingkat_bahaya])} />
            {report.tingkat_bahaya}
          </span>
          {report.jalur_vital && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-700">
              <Route className="h-3 w-3" />
              Jalur vital
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-neutral-500">
            <ThumbsUp className="h-3.5 w-3.5" />
            {report.votes_count}
          </span>
        </div>
      </div>

      <span
        aria-hidden
        className="absolute right-5 top-5 text-black/20 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 sm:hidden"
      >
        ↗
      </span>
    </Link>
  )
}
