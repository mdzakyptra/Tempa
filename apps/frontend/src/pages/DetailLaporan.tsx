import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import { StatusTimeline } from '../components/status-timeline'
import { ScoreBreakdown } from '../components/score-breakdown'
import { CityMap } from '../components/city-map'
import type { ReportListItem } from '../components/report-card'

//<---------- ScoreBreakdownSkeleton -------------->
function ScoreBreakdownSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="h-5 w-1/2 rounded bg-neutral-200" />
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-neutral-100" />
        ))}
      </div>
    </div>
  )
}

//<---------- DetailLaporan -------------->
export default function DetailLaporan() {
  const { id } = useParams<{ id: string }>()

  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['report', id],
    queryFn: () => apiFetch<ReportListItem>(`/reports/${id}`),
    enabled: !!id,
  })

  if (!id) return null

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">{report ? report.judul : 'Detail Laporan'}</h1>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Rincian Skor</h2>
      <div className="mt-4">
        {isLoading && <ScoreBreakdownSkeleton />}
        {isError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Gagal memuat rincian skor.
          </p>
        )}
        {report && <ScoreBreakdown report={report} />}
      </div>

      {report && (
        <>
          <h2 className="mt-8 text-lg font-semibold text-neutral-900">Lokasi</h2>
          <div className="mt-4 h-64 overflow-hidden rounded-2xl border border-neutral-200">
            {report.lat !== null && report.lng !== null ? (
              <CityMap markers={[{ id: report.id, lat: report.lat, lng: report.lng, label: report.judul }]} />
            ) : (
              <div className="flex h-full items-center justify-center bg-neutral-50 text-sm text-neutral-400">
                Lokasi belum tersedia untuk laporan ini.
              </div>
            )}
          </div>
        </>
      )}

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Riwayat Status</h2>
      <div className="mt-4">
        <StatusTimeline reportId={id} />
      </div>
    </div>
  )
}
