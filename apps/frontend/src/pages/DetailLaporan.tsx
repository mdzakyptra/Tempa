import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { apiFetch, ApiError } from '../lib/api'
import { StatusTimeline } from '../components/status-timeline'
import { ScoreBreakdown } from '../components/score-breakdown'
import { CityMap } from '../components/city-map'
import { VoteButton } from '../components/vote-button'
import type { ReportListItem } from '../components/report-card'
import NotFound from './NotFound'


// Mirror apps/backend/src/photos/dto/report-photo-response.dto.ts
interface ReportPhoto {
  id: string
  report_id: string
  url_foto: string
}

interface DetailLaporanProps {
  isOverlay?: boolean
}

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

// Ukuran sel ikut lebar kolom (bukan kolom tetap) — biar 1-2 foto tampil
// besar, tapi tetap rapi kalau fotonya banyak.
const PHOTO_GRID_CLASS = 'grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3'

//<---------- PhotoGridSkeleton -------------->
function PhotoGridSkeleton() {
  return (
    <div className={PHOTO_GRID_CLASS}>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-xl bg-neutral-100" />
      ))}
    </div>
  )
}

//<---------- DetailLaporan -------------->
export default function DetailLaporan({ isOverlay = false }: DetailLaporanProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    data: report,
    isLoading,
    isError,
    error: reportError,
  } = useQuery({
    queryKey: ['report', id],
    queryFn: () => apiFetch<ReportListItem>(`/reports/${id}`),
    enabled: !!id,
    retry: (failureCount, err) => !(err instanceof ApiError && err.statusCode === 404) && failureCount < 3,
  })

  const isNotFound = reportError instanceof ApiError && reportError.statusCode === 404

  // retry:false — laporan yang belum punya foto itu keadaan normal (bukan
  // error transient), nggak perlu diulang-ulang kayak default TanStack Query.
  const {
    data: photos,
    isLoading: isPhotosLoading,
    isError: isPhotosError,
  } = useQuery({
    queryKey: ['report-photos', id],
    queryFn: () => apiFetch<ReportPhoto[]>(`/photos?reportId=${id}`),
    enabled: !!id,
    retry: false,
  })

  if (!id) return null

  if (isNotFound) {
    return (
      <NotFound
        title="Laporan tidak ditemukan"
        description="Laporan dengan ID ini tidak ada, atau sudah dihapus."
      />
    )
  }

  const content = (
    <div className={isOverlay ? 'p-5 sm:p-7' : 'mx-auto p-6'}>
      {isOverlay && (
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            aria-label="Tutup detail laporan"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-900">{report ? report.judul : 'Detail Laporan'}</h1>
        {report && <VoteButton reportId={report.id} votesCount={report.votes_count} />}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Rincian Skor</h2>
          <div className="mt-4">
            {isLoading && <ScoreBreakdownSkeleton />}
            {isError && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Gagal memuat rincian skor.
              </p>
            )}
            {report && <ScoreBreakdown report={report} />}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Lokasi</h2>
          <div className="mt-4">
            {report && report.lat !== null && report.lng !== null ? (
              <div className="h-[360px] overflow-hidden rounded-2xl border border-neutral-200 md:h-[420px]">
                <CityMap markers={[{ id: report.id, lat: report.lat, lng: report.lng, label: report.judul }]} />
              </div>
            ) : (
              <div className="flex h-[360px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-400 md:h-[420px]">
                Lokasi belum tersedia untuk laporan ini.
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Foto</h2>
        <div className="mt-4">
          {isPhotosLoading && <PhotoGridSkeleton />}
          {isPhotosError && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Gagal memuat foto laporan.
            </p>
          )}
          {photos && photos.length === 0 && (
            <p className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
              Belum ada foto untuk laporan ini.
            </p>
          )}
          {photos && photos.length > 0 && (
            <div className={PHOTO_GRID_CLASS}>
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.url_foto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square overflow-hidden rounded-xl border border-neutral-200"
                >
                  <img
                    src={photo.url_foto}
                    alt="Foto laporan"
                    className="h-full w-full object-cover transition-opacity hover:opacity-90"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Riwayat Status</h2>
      <div className="mt-4">
        <StatusTimeline reportId={id} />
      </div>
    </div>
  )

  if (!isOverlay) return content

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end bg-black/30 backdrop-blur-[1px] sm:p-4" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Detail laporan"
        className="detail-overlay-panel h-full w-full max-w-6xl overflow-y-auto bg-white shadow-2xl"
      >
        {content}
      </section>
    </div>
  )
}
