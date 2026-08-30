import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LaporBaruForm } from '../components/lapor-baru-form'
import { PhotoUpload } from '../components/photo-upload'

//<---------- LaporBaru -------------->
// JEK-37 — form beneran. Dua fase di halaman yang sama: isi & kirim form
// dulu (butuh reportId sebelum foto bisa diunggah — PhotoUpload/JEK-38 nggak
// punya mode "sebelum laporan dibuat"), baru fase foto (opsional) sebelum
// lanjut ke halaman hasil posisi antrean (JEK-40).
export default function LaporBaru() {
  const [createdReportId, setCreatedReportId] = useState<string | null>(null)
  const navigate = useNavigate()

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-neutral-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Antrean Kota / Laporan warga</p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">Bantu kota bergerak lebih cepat.</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
            Tandai kerusakan secara presisi, ceritakan dampaknya, lalu laporanmu langsung masuk ke antrean prioritas.
          </p>
        </div>

      {!createdReportId ? (
        <LaporBaruForm onCreated={setCreatedReportId} />
      ) : (
        <div className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(0,0,0,0.3)] sm:p-8">
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            Laporan berhasil disimpan. Tambahkan foto pendukung (opsional), lalu lihat posisi laporanmu di antrean.
          </p>

          <PhotoUpload reportId={createdReportId} />

          <button
            type="button"
            onClick={() => navigate(`/lapor-baru/hasil/${createdReportId}`)}
            className="w-full rounded-xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Lihat hasil & posisi antrean
          </button>
        </div>
      )}
      </div>
    </main>
  )
}
