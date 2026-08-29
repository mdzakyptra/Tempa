import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'

export interface StatusHistoryEntry {
  id: string
  report_id: string
  status_lama: 'menunggu' | 'diproses' | 'selesai' | 'ditolak' | null
  status_baru: 'menunggu' | 'diproses' | 'selesai' | 'ditolak'
  catatan: string | null
  diubah_oleh: string
  diubah_pada: string
}

interface StatusTimelineProps {
  reportId: string
}

const STATUS_LABEL: Record<StatusHistoryEntry['status_baru'], string> = {
  menunggu: 'Menunggu',
  diproses: 'Diproses',
  selesai: 'Selesai',
  ditolak: 'Ditolak',
}

const STATUS_DOT: Record<StatusHistoryEntry['status_baru'], string> = {
  menunggu: 'bg-neutral-400',
  diproses: 'bg-blue-500',
  selesai: 'bg-green-500',
  ditolak: 'bg-red-500',
}

//<---------- formatWaktu -------------->
function formatWaktu(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

//<---------- TimelineSkeleton -------------->
function TimelineSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex animate-pulse gap-3">
          <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-neutral-200" />
          <div className="flex-1">
            <div className="h-4 w-1/3 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-1/4 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

//<---------- TimelineItem -------------->
function TimelineItem({
  label,
  dotClass,
  fromLabel,
  catatan,
  waktu,
}: {
  label: string
  dotClass: string
  fromLabel?: string
  catatan?: string | null
  waktu: string | null
}) {
  return (
    <li className="flex gap-3">
      <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${dotClass}`} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-neutral-900">{fromLabel ? `${fromLabel} → ${label}` : label}</p>
        {catatan && <p className="mt-0.5 text-sm text-neutral-600">{catatan}</p>}
        {waktu && <p className="mt-0.5 text-xs text-neutral-400">{waktu}</p>}
      </div>
    </li>
  )
}

//<---------- StatusTimeline -------------->
export default function StatusTimeline({ reportId }: StatusTimelineProps) {
  const {
    data: history,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['status-history', reportId],
    queryFn: () => apiFetch<StatusHistoryEntry[]>(`/reports/${reportId}/status-history`),
  })

  if (isLoading) return <TimelineSkeleton />

  if (isError) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Gagal memuat riwayat status.
      </p>
    )
  }

  const entries = history ?? []

  return (
    <ol className="flex flex-col gap-4">
      {entries.length === 0 && (
        <TimelineItem
          label={STATUS_LABEL.menunggu}
          dotClass={STATUS_DOT.menunggu}
          catatan="Laporan diterima, menunggu diproses petugas."
          waktu={null}
        />
      )}
      {entries.map((entry) => (
        <TimelineItem
          key={entry.id}
          label={STATUS_LABEL[entry.status_baru]}
          dotClass={STATUS_DOT[entry.status_baru]}
          fromLabel={entry.status_lama ? STATUS_LABEL[entry.status_lama] : undefined}
          catatan={entry.catatan}
          waktu={formatWaktu(entry.diubah_pada)}
        />
      ))}
    </ol>
  )
}
