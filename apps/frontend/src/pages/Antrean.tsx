import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, ListFilter, MapPin, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { ALL_REPORTS_PATH, apiFetch, apiFetchPaginated } from '../lib/api'
import { ReportCard, type ReportListItem } from '../components/report-card'
import { ReportFilter, type ReportFilterValue } from '../components/report-filter'
import { CityMap, type CityMapMarker } from '../components/city-map'
import ScrollReveal from '../components/landing/animations/ScrollReveal'

//<---------- CardSkeleton -------------->
function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-black/10 bg-white p-6">
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
  const location = useLocation()
  const [searchParams] = useSearchParams()
  // Baca sekali di awal — deep-link dari zona globe landing page (?kawasan=X).
  // Bukan sinkron dua arah, cuma titik masuk filter.
  const [filter, setFilter] = useState<ReportFilterValue>({
    kawasan: searchParams.get('kawasan') ?? '',
    jenis_kerusakan: '',
  })
  const [page, setPage] = useState(1)
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  //<---------- handleFilterChange -------------->
  // Ganti filter selalu balik ke halaman 1 — halaman lama bisa nggak ada
  // lagi begitu hasilnya menyusut/berubah.
  function handleFilterChange(value: ReportFilterValue) {
    setFilter(value)
    setPage(1)
  }

  //<---------- navigateToReport ------------>
  function navigateToReport(reportId: string) {
    const destination = `/laporan/${reportId}`
    navigate(destination, { state: { backgroundLocation: location } })
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

  const markers: CityMapMarker[] = (semuaLaporan ?? [])
    .filter((report) => !filter.kawasan || report.kawasan === filter.kawasan)
    .filter((report) => !filter.jenis_kerusakan || report.jenis_kerusakan === filter.jenis_kerusakan)
    .filter((r): r is ReportListItem & { lat: number; lng: number } => r.lat !== null && r.lng !== null)
    .map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: r.judul }))

  return (
    <div className="bg-neutral-100 p-3 text-black sm:p-6">
      <div className="mx-auto mb-5 max-w-[1600px] px-1 sm:px-0">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">Antrean Kota</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Peta prioritas laporan</h1>
      </div>

      <main className="relative mx-auto h-[calc(100svh-9.5rem)] min-h-[600px] max-w-[1600px] overflow-hidden rounded-3xl border border-black/10 bg-neutral-200 shadow-sm sm:h-[calc(100svh-10.5rem)]">
        {markers.length > 0 ? (
          <div className="absolute inset-0">
            <CityMap markers={markers} zoom={12} onMarkerClick={(marker) => navigateToReport(marker.id)} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-400">
            <MapPin className="h-8 w-8" />
            <p className="px-8 text-center text-sm">Belum ada laporan dengan lokasi tersimpan.</p>
          </div>
        )}

        <div className="pointer-events-none absolute top-4 right-4 z-[500] rounded-full border border-black/10 bg-white/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 shadow-sm backdrop-blur-sm">
          {markers.length} titik di peta
        </div>

        {!isPanelOpen && (
          <button
            type="button"
            onClick={() => setIsPanelOpen(true)}
            className="absolute top-4 left-4 z-[500] flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
            aria-controls="queue-panel"
            aria-expanded="false"
          >
            <PanelLeftOpen className="size-4" aria-hidden />
            Buka antrean
          </button>
        )}

        <aside
          id="queue-panel"
          className={`absolute inset-x-3 top-16 bottom-3 z-[500] flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl transition-transform duration-300 sm:inset-x-auto sm:top-4 sm:bottom-4 sm:left-4 sm:w-[min(26rem,calc(100%-2rem))] ${
            isPanelOpen ? 'translate-x-0 translate-y-0' : 'pointer-events-none -translate-x-[calc(100%+2rem)] sm:-translate-x-[calc(100%+2rem)]'
          }`}
          aria-hidden={!isPanelOpen}
        >
          <div className="flex items-start justify-between gap-3 border-b border-black/10 px-5 py-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Daftar laporan</p>
              <h2 className="mt-1 text-lg font-bold text-neutral-900">
                {meta ? `${meta.total} laporan aktif` : 'Antrean perbaikan'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
              aria-label="Tutup panel antrean"
            >
              <PanelLeftClose className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-800">
              <ListFilter className="size-4" aria-hidden /> Filter antrean
            </div>
            <ReportFilter value={filter} kawasanOptions={kawasanOptions} onChange={handleFilterChange} />

            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {isError && (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                Gagal memuat laporan. Coba muat ulang halaman.
              </p>
            )}

            {reports && reports.length === 0 && (
              <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">Kosong</p>
                <p className="mt-3 text-sm text-neutral-500">
                  {isFilterActive ? 'Tidak ada laporan yang cocok dengan filter ini.' : 'Belum ada laporan.'}
                </p>
              </div>
            )}

            {reports && reports.length > 0 && (
              <div className="flex flex-col gap-4">
                {reports.map((report, i) => (
                  <ScrollReveal key={report.id} direction="up" duration={0.5} delay={Math.min(i, 5) * 0.05}>
                    <ReportCard
                      report={report}
                      index={(meta ? (meta.page - 1) * meta.limit : 0) + i + 1}
                      onSelect={() => navigateToReport(report.id)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            )}

            {meta && meta.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5 text-sm">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-full border border-black/20 px-4 py-2 font-semibold text-black transition-colors hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {meta.page} / {meta.totalPages} &middot; {meta.total} laporan
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="flex items-center gap-1 rounded-full border border-black/20 px-4 py-2 font-semibold text-black transition-colors hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Berikutnya
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}
