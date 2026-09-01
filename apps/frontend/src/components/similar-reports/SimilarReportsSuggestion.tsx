import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Layers } from 'lucide-react'
import { apiFetch } from '../../lib/api'
import { useSimilarReports } from './useSimilarReports'
import { JENIS_KERUSAKAN_LABEL } from '../../lib/report-enums'
import type { SimilarReportsSuggestionProps } from './types'

const MIN_JUDUL_LENGTH = 3
const MIN_DESKRIPSI_LENGTH = 10

//<---------- SkeletonCard -------------->
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-3">
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
// JEK-39/48 — dipicu otomatis begitu kawasan+jenis_kerusakan (dan idealnya
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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Layers className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {query.isPending && 'Mengecek laporan serupa…'}
            {query.isError && 'Nggak bisa cek laporan serupa'}
            {query.isSuccess && query.data.length === 0 && 'Belum ada laporan serupa'}
            {query.isSuccess && query.data.length > 0 && `Ditemukan ${query.data.length} laporan serupa`}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            {query.isPending && 'Menganalisis kawasan & jenis kerusakan yang kamu isi.'}
            {query.isError && 'Kamu tetap bisa lanjut lapor seperti biasa.'}
            {query.isSuccess && query.data.length === 0 && 'Laporanmu kelihatannya belum ada yang sama, lanjut aja isi form di bawah.'}
            {query.isSuccess && query.data.length > 0 && 'Cek dulu, siapa tahu laporanmu bisa digabung ke salah satu di bawah ini.'}
          </p>
        </div>
      </div>

      {query.isPending && (
        <div className="mt-3 space-y-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <div className="mt-3 space-y-2">
          {query.data.map((report) => (
            <div
              key={report.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{report.judul}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-gray-500">
                    {report.kawasan} · {JENIS_KERUSAKAN_LABEL[report.jenis_kerusakan]}
                  </span>
                  {report.kemiripan !== null && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {Math.round(report.kemiripan * 100)}% mirip
                    </span>
                  )}
                  {report.cocok_atribut && !report.cocok_embedding && (
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                      kawasan & jenis sama
                    </span>
                  )}
                </div>
                {mergeMutation.isError && mergeMutation.variables === report.id && (
                  <p className="mt-1 text-xs text-red-600">
                    {mergeMutation.error instanceof Error && mergeMutation.error.message
                      ? mergeMutation.error.message
                      : 'Gagal gabung, coba lagi.'}
                  </p>
                )}
              </div>

              {canSubmitAndMerge ? (
                <button
                  type="button"
                  onClick={() => mergeMutation.mutate(report.id)}
                  disabled={mergeMutation.isPending}
                  className="shrink-0 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {mergeMutation.isPending && mergeMutation.variables === report.id
                    ? 'Menggabungkan…'
                    : 'Gabungkan laporan saya'}
                </button>
              ) : (
                <Link
                  to={`/laporan/${report.id}`}
                  className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
