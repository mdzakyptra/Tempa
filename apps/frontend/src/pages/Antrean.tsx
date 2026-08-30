import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { ALL_REPORTS_PATH, apiFetch, apiFetchPaginated } from '../lib/api'
import { ReportCard, type ReportListItem } from '../components/report-card'
import { ReportFilter, type ReportFilterValue } from '../components/report-filter'
import { CityMap, type CityMapMarker } from '../components/city-map'

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
function buildQueryString(filter: ReportFilterValue, page: number) {
  const params = new URLSearchParams()
  if (filter.kawasan) params.set('kawasan', filter.kawasan)
  if (filter.jenis_kerusakan) params.set('jenis_kerusakan', filter.jenis_kerusakan)
  params.set('page', String(page))
  return `?${params.toString()}`
}

//<---------- Antrean -------------->
export default function Antrean() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Baca sekali di awal — deep-link dari zona globe landing page (?kawasan=X).
  // Bukan sinkron dua arah, cuma titik masuk filter.
  const [filter, setFilter] = useState<ReportFilterValue>({
    kawasan: searchParams.get('kawasan') ?? '',
    jenis_kerusakan: '',
  })
  const [page, setPage] = useState(1)

  //<---------- handleFilterChange -------------->
  // Ganti filter selalu balik ke halaman 1 — halaman lama bisa nggak ada
  // lagi begitu hasilnya menyusut/berubah.
  function handleFilterChange(value: ReportFilterValue) {
    setFilter(value)
    setPage(1)
  }

  const {
    data: paginated,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reports', filter.kawasan, filter.jenis_kerusakan, page],
    queryFn: () => apiFetchPaginated<ReportListItem[]>(`/reports${buildQueryString(filter, page)}`),
  })
  const reports = paginated?.data
  const meta = paginated?.meta

  // Dipisah dari query daftar di atas: query ini SELALU tanpa filter/paginasi,
  // cuma dipakai buat isi opsi dropdown kawasan supaya opsinya tidak ikut
  // menyusut waktu user lagi mempersempit hasil atau pindah halaman.
  const { data: semuaLaporan } = useQuery({
    queryKey: ['reports', 'semua'],
    queryFn: () => apiFetch<ReportListItem[]>(ALL_REPORTS_PATH),
    staleTime: Infinity,
  })
  const kawasanOptions = [...new Set((semuaLaporan ?? []).map((r) => r.kawasan))].sort()

  const isFilterActive = filter.kawasan !== '' || filter.jenis_kerusakan !== ''

  const markers: CityMapMarker[] = (reports ?? [])
    .filter((r): r is ReportListItem & { lat: number; lng: number } => r.lat !== null && r.lng !== null)
    .map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: r.judul }))

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Antrean Laporan</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Daftar laporan kerusakan, diurutkan otomatis berdasarkan skor prioritas.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <ReportFilter value={filter} kawasanOptions={kawasanOptions} onChange={handleFilterChange} />

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

          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </button>
              <span className="text-neutral-500">
                Halaman {meta.page} dari {meta.totalPages} &middot; {meta.total} laporan
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="h-64 overflow-hidden rounded-2xl border border-neutral-200 md:sticky md:top-6 md:h-[calc(100vh-6rem)] md:min-h-64">
          {markers.length > 0 ? (
            <CityMap markers={markers} onMarkerClick={(marker) => navigate(`/laporan/${marker.id}`)} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-400">
              <MapPin className="h-8 w-8" />
              <p className="px-4 text-center text-sm">Belum ada laporan dengan lokasi tersimpan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
