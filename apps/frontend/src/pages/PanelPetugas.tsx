import { useState, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Search, ShieldAlert } from 'lucide-react'
import { ALL_REPORTS_PATH, apiFetch } from '../lib/api'
import { getCachedUserSnapshot, getCurrentUser, isPetugasPanelAllowed } from '../lib/auth'
import { ReportCard } from '../components/report-card'
import type { ReportListItem } from '../components/report-card'
import { StatusEditor } from '../components/status-editor'
import { STATUS_LAPORAN_LABEL } from '../lib/report-enums'
import ScrollReveal from '../components/landing/animations/ScrollReveal'

//<---------- ListSkeleton -------------->
function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl border border-black/10 bg-neutral-100" />
      ))}
    </div>
  )
}

//<---------- AksesDitolak -------------->
function AksesDitolak() {
  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <ShieldAlert className="mx-auto size-10 text-neutral-400" aria-hidden />
      <h1 className="mt-4 text-lg font-semibold text-neutral-900">Akses ditolak</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Halaman ini cuma bisa diakses akun petugas tertentu. Kalau menurutmu ini keliru, hubungi admin.
      </p>
      <Link to="/" className="mt-4 inline-block text-sm font-semibold text-neutral-900 hover:underline">
        ← Kembali ke Beranda
      </Link>
    </div>
  )
}

//<---------- PanelShell -------------->
// Header + grid selalu sama persis antara state loading dan state terisi —
// cuma kolom kiri (daftar laporan) yang ganti isi. Ini yang bikin
// userQuery.isPending dan reportsQuery.isLoading kerasa satu skeleton yang
// nyambung, bukan dua flash terpisah (header baru muncul, list skeleton lagi).
function PanelShell({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Panel Petugas</h1>
      <p className="mt-1 text-sm text-neutral-500">Pilih laporan untuk mengubah status dan menambahkan catatan.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>{left}</div>
        <div className="lg:sticky lg:top-6 lg:h-fit">{right}</div>
      </div>
    </div>
  )
}

//<---------- PanelPetugas -------------->
// JEK-44 — gate akses (isPetugasPanelAllowed, lib/auth) diperiksa dulu di
// sini sebelum daftar laporan + StatusEditor dirender. Penegakan
// SESUNGGUHNYA ada di backend (PetugasPanelGuard) — gate ini cuma UX.
export default function PanelPetugas() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const userQuery = useQuery({ queryKey: ['current-user'], queryFn: getCurrentUser, initialData: getCachedUserSnapshot })

  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<ReportListItem[]>(ALL_REPORTS_PATH),
    enabled: userQuery.isSuccess && userQuery.data !== null,
  })

  const user = userQuery.data

  // userQuery masih pending ATAU (udah lolos gate & reports masih fetch) —
  // dua kondisi ini dianggap satu fase loading, shell-nya sama persis biar
  // gak ada dua flash skeleton yang keliatan beda.
  const isPetugasKnownAllowed = isPetugasPanelAllowed(user)
  if (userQuery.isPending || (isPetugasKnownAllowed && reportsQuery.isLoading)) {
    return (
      <PanelShell
        left={<ListSkeleton />}
        right={
          <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
            Pilih salah satu laporan di kiri untuk ubah statusnya.
          </div>
        }
      />
    )
  }

  if (!user) {
    return <Navigate to="/auth?redirect=/panel-petugas&reason=petugas" />
  }

  if (!isPetugasKnownAllowed) {
    return <AksesDitolak />
  }

  const selectedReport = reportsQuery.data?.find((report) => report.id === selectedId) ?? null

  const query = search.trim().toLowerCase()
  const filteredReports = reportsQuery.data?.filter(
    (report) => !query || report.judul.toLowerCase().includes(query) || report.kawasan.toLowerCase().includes(query),
  )

  return (
    <PanelShell
      left={
        <>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul atau kawasan…"
              className="w-full rounded-full border border-black/15 bg-white py-2.5 pr-4 pl-9 text-sm outline-none transition-colors focus:border-black/40"
            />
          </div>

          {reportsQuery.isError && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Gagal memuat laporan.</p>
          )}
          {filteredReports && filteredReports.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
              Tidak ada laporan yang cocok dengan pencarian ini.
            </p>
          )}
          {filteredReports && filteredReports.length > 0 && (
            <div className="flex flex-col gap-4">
              {filteredReports.map((report, index) => (
                <ScrollReveal key={report.id} direction="up" duration={0.5} delay={Math.min(index, 5) * 0.05}>
                  <div
                    className={`flex items-stretch gap-2 rounded-2xl ${report.id === selectedId ? 'ring-2 ring-neutral-900' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <ReportCard report={report} index={index + 1} onSelect={() => setSelectedId(report.id)} />
                    </div>
                    <Link
                      to={`/antrean?laporan=${report.id}`}
                      title="Lihat titik di peta Antrean"
                      className="flex shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white px-3 text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-900"
                    >
                      <MapPin className="size-4" aria-hidden />
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </>
      }
      right={
        selectedReport ? (
          <div>
            <p className="mb-2 text-sm text-neutral-500">
              Status sekarang: <span className="font-semibold text-neutral-900">{STATUS_LAPORAN_LABEL[selectedReport.status]}</span>
            </p>
            <StatusEditor key={selectedReport.id} reportId={selectedReport.id} currentStatus={selectedReport.status} />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
            Pilih salah satu laporan di kiri untuk ubah statusnya.
          </div>
        )
      }
    />
  )
}
