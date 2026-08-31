import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShieldAlert } from 'lucide-react'
import { ALL_REPORTS_PATH, apiFetch } from '../lib/api'
import { getCurrentUser } from '../lib/auth'
import { ReportCard } from '../components/report-card'
import type { ReportListItem } from '../components/report-card'
import { StatusEditor } from '../components/status-editor'
import { STATUS_LAPORAN_LABEL } from '../lib/report-enums'
import ScrollReveal from '../components/landing/animations/ScrollReveal'

// Dipisah koma, sama persis isinya kayak PETUGAS_PANEL_EMAILS di
// apps/backend/.env — lihat komentar VITE_PETUGAS_PANEL_EMAILS di
// apps/frontend/.env kenapa ini BUKAN boundary keamanan asli, cuma gate UI.
const ALLOWED_EMAILS = (import.meta.env.VITE_PETUGAS_PANEL_EMAILS ?? '')
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean)

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

//<---------- PanelPetugas -------------->
// JEK-44 — gate akses (cuma 2 akun di ALLOWED_EMAILS) diperiksa dulu di
// sini sebelum daftar laporan + StatusEditor dirender. Penegakan
// SESUNGGUHNYA ada di backend (PetugasPanelGuard) — gate ini cuma UX.
export default function PanelPetugas() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const userQuery = useQuery({ queryKey: ['current-user'], queryFn: getCurrentUser })

  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<ReportListItem[]>(ALL_REPORTS_PATH),
    enabled: userQuery.isSuccess && userQuery.data !== null,
  })

  if (userQuery.isPending) {
    return (
      <div className="p-6">
        <ListSkeleton />
      </div>
    )
  }

  const user = userQuery.data
  const isAllowed = !!user && user.peran === 'petugas' && ALLOWED_EMAILS.includes(user.email.toLowerCase())

  if (!user) {
    return <Navigate to="/auth?redirect=/panel-petugas&reason=petugas" />
  }

  if (!isAllowed) {
    return <AksesDitolak />
  }

  const selectedReport = reportsQuery.data?.find((report) => report.id === selectedId) ?? null

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Panel Petugas</h1>
      <p className="mt-1 text-sm text-neutral-500">Pilih laporan untuk mengubah status dan menambahkan catatan.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {reportsQuery.isLoading && <ListSkeleton />}
          {reportsQuery.isError && (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Gagal memuat laporan.</p>
          )}
          {reportsQuery.data && (
            <div className="flex flex-col gap-4">
              {reportsQuery.data.map((report, index) => (
                <ScrollReveal key={report.id} direction="up" duration={0.5} delay={Math.min(index, 5) * 0.05}>
                  <div className={report.id === selectedId ? 'ring-2 ring-neutral-900 rounded-2xl' : ''}>
                    <ReportCard report={report} index={index + 1} onSelect={() => setSelectedId(report.id)} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-6 lg:h-fit">
          {selectedReport ? (
            <div>
              <p className="mb-2 text-sm text-neutral-500">
                Status sekarang: <span className="font-semibold text-neutral-900">{STATUS_LAPORAN_LABEL[selectedReport.status]}</span>
              </p>
              <StatusEditor
                key={selectedReport.id}
                reportId={selectedReport.id}
                currentStatus={selectedReport.status}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
              Pilih salah satu laporan di kiri untuk ubah statusnya.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
