import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'
import { apiFetch } from '../lib/api'
import { ReportCard, type ReportListItem } from '../components/report-card'
import { ReportFilter, type ReportFilterValue } from '../components/report-filter'

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

//<---------- buildQueryString -------------->
function buildQueryString(filter: ReportFilterValue) {
  const params = new URLSearchParams()
  if (filter.kawasan) params.set('kawasan', filter.kawasan)
  if (filter.jenis_kerusakan) params.set('jenis_kerusakan', filter.jenis_kerusakan)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

//<---------- Antrean -------------->
export default function Antrean() {
  const [filter, setFilter] = useState<ReportFilterValue>({ kawasan: '', jenis_kerusakan: '' })

  const {
    data: reports,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reports', filter.kawasan, filter.jenis_kerusakan],
    queryFn: () => apiFetch<ReportListItem[]>(`/reports${buildQueryString(filter)}`),
  })

  // Dipisah dari query daftar di atas: query ini SELALU tanpa filter, cuma
  // dipakai buat isi opsi dropdown kawasan supaya opsinya tidak ikut menyusut
  // waktu user lagi mempersempit hasil.
  const { data: semuaLaporan } = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<ReportListItem[]>('/reports'),
    staleTime: Infinity,
  })
  const kawasanOptions = [...new Set((semuaLaporan ?? []).map((r) => r.kawasan))].sort()

  const isFilterActive = filter.kawasan !== '' || filter.jenis_kerusakan !== ''

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Antrean Laporan</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Daftar laporan kerusakan, diurutkan otomatis berdasarkan skor prioritas.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <ReportFilter value={filter} kawasanOptions={kawasanOptions} onChange={setFilter} />

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
              {isFilterActive ? 'Tidak ada laporan yang cocok dengan filter ini.' : 'Belum ada laporan.'}
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
