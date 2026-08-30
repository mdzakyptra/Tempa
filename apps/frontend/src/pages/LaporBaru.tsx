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
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-xl font-semibold text-gray-900">Lapor Baru</h1>
      <p className="mb-6 text-sm text-gray-500">
        Laporkan kerusakan infrastruktur di kawasan kamu — laporan langsung masuk antrean prioritas.
      </p>

      {!createdReportId ? (
        <LaporBaruForm onCreated={setCreatedReportId} />
      ) : (
        <div className="space-y-4">
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Laporan berhasil disimpan. Tambahkan foto pendukung (opsional), lalu lihat posisi laporanmu di antrean.
          </p>

          <PhotoUpload reportId={createdReportId} />

          <button
            type="button"
            onClick={() => navigate(`/lapor-baru/hasil/${createdReportId}`)}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Lihat hasil & posisi antrean
          </button>
        </div>
      )}
    </div>
  )
}
