import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
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
    <div className="bg-white text-black">
      {/* ---------- konten ---------- */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_360px]">
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
                    <ReportCard report={report} index={(meta ? (meta.page - 1) * meta.limit : 0) + i + 1} />
                  </ScrollReveal>
                ))}
              </div>
            )}

            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6 text-sm">
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

          {/* ---------- peta: persegi, sticky ---------- */}
          <div className="md:sticky md:top-6 md:self-start">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/10">
              <div className="pointer-events-none absolute left-3 top-3 z-[400] rounded-full border border-black/10 bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600 backdrop-blur-sm">
                Peta Laporan
              </div>
              {markers.length > 0 ? (
                <CityMap markers={markers} onMarkerClick={(marker) => navigate(`/laporan/${marker.id}`)} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-400">
                  <MapPin className="h-8 w-8" />
                  <p className="px-8 text-center text-sm">Belum ada laporan dengan lokasi tersimpan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
