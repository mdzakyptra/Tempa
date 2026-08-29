import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import { apiFetch } from '../lib/api'
import { ReportCard, type ReportListItem } from '../components/report-card'

//<---------- CardSkeleton -------------->
function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="h-5 w-2/3 rounded bg-neutral-200" />
      <div className="mt-2 h-4 w-1/3 rounded bg-neutral-200" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-neutral-200" />
        <div className="h-6 w-20 rounded-full bg-neutral-200" />
      </div>
    </div>
  )
}

//<---------- Antrean -------------->
export default function Antrean() {
  const {
    data: reports,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<ReportListItem[]>('/reports'),
  })

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Antrean Laporan</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Daftar laporan kerusakan, diurutkan otomatis berdasarkan skor prioritas.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          {/* TODO(JEK-32): sambungkan ke query param kawasan/jenis_kerusakan */}
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 p-4 sm:flex-row sm:items-center">
            <select
              disabled
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400"
            >
              <option>Semua kawasan</option>
            </select>
            <select
              disabled
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400"
            >
              <option>Semua jenis kerusakan</option>
            </select>
            <span className="text-xs text-neutral-400 sm:ml-auto">Filter segera hadir</span>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Gagal memuat laporan. Coba muat ulang halaman.
            </p>
          )}

          {reports && reports.length === 0 && (
            <p className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              Belum ada laporan.
            </p>
          )}

          {reports && reports.length > 0 && (
            <div className="flex flex-col gap-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>

        {/* TODO(JEK-45): ganti placeholder ini dengan CityMap begitu Report punya koordinat asli */}
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400 md:sticky md:top-6 md:h-fit md:min-h-64">
          <MapPin className="h-8 w-8" />
          <p className="text-sm">Peta laporan segera hadir</p>
        </div>
      </div>
    </div>
  )
}
