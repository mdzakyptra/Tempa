import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import { useSimilarReports } from './useSimilarReports'
import { JENIS_KERUSAKAN_LABEL } from '../../lib/report-enums'
import type { SimilarReportsSuggestionProps } from './types'

const MIN_JUDUL_LENGTH = 3
const MIN_DESKRIPSI_LENGTH = 10

//<---------- SkeletonCard -------------->
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 p-3">
      <div className="h-4 w-2/3 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
    </div>
  )
}

//<---------- submitAndMerge -------------->
// Alur beneran (JEK-18): submit laporan baru dulu (butuh id-nya buat jadi
// `duplicateId`), BARU panggil endpoint merge — merge nggak bisa duluan
// karena butuh 2 laporan yang udah ada.
async function submitAndMerge(
  payload: {
    judul: string
    deskripsi: string
    kawasan: string
    jenis_kerusakan: string
    tingkat_bahaya: string
    estimasi_terdampak: number
  },
  laporanUtamaId: string,
): Promise<string> {
  const created = await apiFetch<{ id: string }>('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  await apiFetch(`/reports/${created.id}/merge`, {
    method: 'POST',
    body: JSON.stringify({ laporan_utama_id: laporanUtamaId }),
  })
  return laporanUtamaId
}

//<---------- SimilarReportsSuggestion -------------->
// JEK-39 — dipicu otomatis begitu kawasan+jenis_kerusakan (dan idealnya
// judul+deskripsi) keisi di form Lapor Baru (JEK-37), SEBELUM warga submit.
export default function SimilarReportsSuggestion({
  kawasan,
  jenis_kerusakan,
  judul,
  deskripsi,
  tingkat_bahaya,
  estimasi_terdampak,
  onMerged,
}: SimilarReportsSuggestionProps) {
  const navigate = useNavigate()
  const query = useSimilarReports({ kawasan, jenis_kerusakan, judul, deskripsi })

  // Semua field CreateReportDto wajib udah lengkap & valid — baru bisa
  // submit+merge beneran. Kalau belum, tombol turun jadi navigasi biasa.
  const canSubmitAndMerge =
    !!judul &&
    judul.trim().length >= MIN_JUDUL_LENGTH &&
    !!deskripsi &&
    deskripsi.trim().length >= MIN_DESKRIPSI_LENGTH &&
    kawasan.trim().length >= 3 &&
    jenis_kerusakan !== '' &&
    !!tingkat_bahaya &&
    typeof estimasi_terdampak === 'number' &&
    estimasi_terdampak >= 0

  const mergeMutation = useMutation({
    mutationFn: (laporanUtamaId: string) =>
      submitAndMerge(
        {
          judul: judul!,
          deskripsi: deskripsi!,
          kawasan,
          jenis_kerusakan,
          tingkat_bahaya: tingkat_bahaya as string,
          estimasi_terdampak: estimasi_terdampak!,
        },
        laporanUtamaId,
      ),
    onSuccess: (laporanUtamaId) => {
      onMerged?.(laporanUtamaId)
      navigate(`/laporan/${laporanUtamaId}`)
    },
  })

  if (kawasan.trim().length < 3 || jenis_kerusakan === '') return null

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="mb-3 text-sm font-medium text-amber-900">
        Mengecek laporan serupa di kawasan ini...
      </p>

      {query.isPending && (
        <div className="space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {query.isError && (
        <p className="text-sm text-amber-700">
          Nggak bisa cek laporan serupa sekarang — kamu tetap bisa lanjut lapor.
        </p>
      )}

      {query.isSuccess && query.data.length === 0 && (
        <p className="text-sm text-amber-700">Belum ada laporan serupa ditemukan.</p>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-amber-800">
            Ditemukan {query.data.length} laporan yang mungkin sama — cek dulu sebelum lapor baru:
          </p>
          {query.data.map((report) => (
            <div key={report.id} className="flex items-start justify-between gap-3 rounded-lg border border-amber-300 bg-white p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{report.judul}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {report.kawasan} · {JENIS_KERUSAKAN_LABEL[report.jenis_kerusakan]}
                  {report.kemiripan !== null && ` · ${Math.round(report.kemiripan * 100)}% mirip`}
                  {report.cocok_atribut && !report.cocok_embedding && ' · kawasan & jenis sama'}
                </p>
                {mergeMutation.isError && mergeMutation.variables === report.id && (
                  <p className="mt-1 text-xs text-red-600">Gagal gabung, coba lagi.</p>
                )}
              </div>

              {canSubmitAndMerge ? (
                <button
                  type="button"
                  onClick={() => mergeMutation.mutate(report.id)}
                  disabled={mergeMutation.isPending}
                  className="shrink-0 rounded-md border border-amber-400 bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-60"
                >
                  {mergeMutation.isPending && mergeMutation.variables === report.id
                    ? 'Menggabungkan…'
                    : 'Gabungkan laporan saya'}
                </button>
              ) : (
                <Link
                  to={`/laporan/${report.id}`}
                  className="shrink-0 rounded-md border border-amber-400 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
                >
                  Ini laporan saya
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
