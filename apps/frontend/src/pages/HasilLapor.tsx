import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ALL_REPORTS_PATH, apiFetch } from '../lib/api'
import { JENIS_KERUSAKAN_LABEL } from '../lib/report-enums'
import type { JenisKerusakan, TingkatBahaya } from '../lib/report-enums'

interface SkorKomponen {
  bahaya: number
  terdampak: number
  lama_menunggu: number
  jalur_vital: number
}

// Mirror apps/backend/src/reports/dto/report-list-item.dto.ts
interface ReportListItem {
  id: string
  judul: string
  deskripsi: string
  kawasan: string
  jenis_kerusakan: JenisKerusakan
  tingkat_bahaya: TingkatBahaya
  estimasi_terdampak: number
  jalur_vital: boolean
  votes_count: number
  status: string
  dibuat_pada: string
  dibuat_oleh: string | null
  skor: number
  skor_komponen: SkorKomponen
}

// Bobot komponen skor (harus sinkron sama
// apps/backend/src/reports/constants/skor-bobot.constant.ts & halaman
// Metodologi) — cuma dipakai buat label di sini, bukan buat ngitung ulang.
const KOMPONEN_LABEL: { key: keyof SkorKomponen; label: string; bobot: string }[] = [
  { key: 'bahaya', label: 'Tingkat bahaya', bobot: '35%' },
  { key: 'terdampak', label: 'Jumlah warga terdampak', bobot: '25%' },
  { key: 'lama_menunggu', label: 'Lama menunggu', bobot: '20%' },
  { key: 'jalur_vital', label: 'Jalur vital', bobot: '20%' },
]

//<---------- SkeletonHasil -------------->
function SkeletonHasil() {
  return (
    <div className="mx-auto max-w-lg animate-pulse p-6">
      <div className="h-6 w-2/3 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-1/2 rounded bg-gray-200" />
      <div className="mt-6 h-24 rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 rounded bg-gray-200" />
        <div className="h-3 rounded bg-gray-200" />
        <div className="h-3 rounded bg-gray-200" />
        <div className="h-3 rounded bg-gray-200" />
      </div>
    </div>
  )
}

//<---------- HasilLapor -------------->
// JEK-40 — ditampilkan setelah submit laporan berhasil (JEK-37), pakai id
// laporan yang baru dibuat. Posisi antrean dihitung client-side dari
// GET /reports (JEK-14, urutan udah sama persis sama Beranda/JEK-30 —
// kriteria konsistensi kepenuhi otomatis karena sumber datanya sama).
export default function HasilLapor() {
  const { id } = useParams<{ id: string }>()

  // retry:false — 404 (laporan nggak ketemu/id salah) nggak akan pernah
  // berhasil diulang, defaultnya TanStack Query nyoba 3x dulu (delay makin
  // lama tiap percobaan) sebelum isError jadi true, bikin skeleton nyangkut
  // lama padahal harusnya langsung kelihatan errornya.
  const reportQuery = useQuery({
    queryKey: ['report', id],
    queryFn: () => apiFetch<ReportListItem>(`/reports/${id}`),
    enabled: !!id,
    retry: false,
  })

  const listQuery = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<ReportListItem[]>(ALL_REPORTS_PATH),
    retry: false,
  })

  if (reportQuery.isPending || listQuery.isPending) {
    return <SkeletonHasil />
  }

  if (reportQuery.isError || !reportQuery.data) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <p className="text-sm text-red-600">Laporan nggak ditemukan.</p>
      </div>
    )
  }

  const report = reportQuery.data
  const list = listQuery.data ?? []
  const position = list.findIndex((r) => r.id === report.id)
  const total = list.length

  return (
    <div className="mx-auto max-w-lg p-6">
      <p className="text-sm font-medium text-emerald-700">Laporan kamu berhasil masuk antrean!</p>
      <h1 className="mt-1 text-xl font-semibold text-gray-900">{report.judul}</h1>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
        {position >= 0 ? (
          <>
            <p className="text-3xl font-bold text-gray-900">
              #{position + 1} <span className="text-base font-normal text-gray-500">dari {total}</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">posisi laporan kamu di antrean aktif</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Laporan ini nggak lagi ada di antrean aktif (mungkin udah digabung atau selesai diproses).
          </p>
        )}
        <p className="mt-3 text-sm text-gray-700">
          Skor prioritas: <span className="font-semibold">{report.skor}</span> / 100
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium text-gray-700">Rincian skor</p>
        {KOMPONEN_LABEL.map(({ key, label, bobot }) => (
          <div key={key}>
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {label} <span className="text-gray-400">(bobot {bobot})</span>
              </span>
              <span>{report.skor_komponen[key]}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, Math.max(0, report.skor_komponen[key]))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {report.kawasan} · {JENIS_KERUSAKAN_LABEL[report.jenis_kerusakan]}
      </p>

      <Link
        to={`/laporan/${report.id}`}
        className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Lihat detail laporan & tanya asisten
      </Link>
    </div>
  )
}
