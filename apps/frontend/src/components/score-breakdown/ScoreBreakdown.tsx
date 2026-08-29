import { Link } from 'react-router-dom'
import type { ReportListItem } from '../report-card'

interface ScoreBreakdownProps {
  report: ReportListItem
}

const BAHAYA_LABEL: Record<ReportListItem['tingkat_bahaya'], string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
  darurat: 'Darurat',
}

//<---------- formatLamaMenunggu -------------->
function formatLamaMenunggu(dibuatPada: string) {
  const hari = Math.floor((Date.now() - new Date(dibuatPada).getTime()) / 86_400_000)
  if (hari <= 0) return 'Kurang dari 1 hari'
  return `${hari} hari`
}

//<---------- ScoreRow -------------->
function ScoreRow({
  nama,
  bobotPersen,
  nilaiMentah,
  skorKomponen,
}: {
  nama: string
  bobotPersen: number
  nilaiMentah: string
  skorKomponen: number
}) {
  const kontribusi = Math.round(skorKomponen * (bobotPersen / 100) * 100) / 100

  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-900">{nama}</p>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
          bobot {bobotPersen}%
        </span>
      </div>
      <p className="mt-1 text-sm text-neutral-600">{nilaiMentah}</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-neutral-900" style={{ width: `${skorKomponen}%` }} />
      </div>
      <p className="mt-1 text-xs text-neutral-400">Sumbang {kontribusi} poin ke skor akhir</p>
    </div>
  )
}

//<---------- ScoreBreakdown -------------->
export default function ScoreBreakdown({ report }: ScoreBreakdownProps) {
  const { skor_komponen: komponen } = report

  const totalKontribusi =
    Math.round(
      (komponen.bahaya * 0.35 + komponen.terdampak * 0.25 + komponen.lama_menunggu * 0.2 + komponen.jalur_vital * 0.2) *
        100,
    ) / 100

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-neutral-900">Rincian Skor Prioritas</h3>
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-sm font-bold text-white">{report.skor}</span>
      </div>
      
      <div className="mt-4 flex flex-col gap-3">
        <ScoreRow
          nama="Tingkat Bahaya"
          bobotPersen={35}
          nilaiMentah={`Dilaporkan: ${BAHAYA_LABEL[report.tingkat_bahaya]}`}
          skorKomponen={komponen.bahaya}
        />
        <ScoreRow
          nama="Jumlah Warga Terdampak"
          bobotPersen={25}
          nilaiMentah={`${report.estimasi_terdampak} estimasi awal + ${report.votes_count} dukungan warga`}
          skorKomponen={komponen.terdampak}
        />
        <ScoreRow
          nama="Lama Menunggu"
          bobotPersen={20}
          nilaiMentah={`Menunggu sejak dibuat: ${formatLamaMenunggu(report.dibuat_pada)}`}
          skorKomponen={komponen.lama_menunggu}
        />
        <ScoreRow
          nama="Jalur Vital"
          bobotPersen={20}
          nilaiMentah={report.jalur_vital ? 'Ya, dekat sekolah/RS/jalur utama' : 'Tidak'}
          skorKomponen={komponen.jalur_vital}
        />
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        Total kontribusi keempat komponen: <span className="font-semibold text-neutral-900">{totalKontribusi}</span>{' '}
        ≈ skor akhir <span className="font-semibold text-neutral-900">{report.skor}</span> (selisih kecil dari
        pembulatan tiap komponen).
      </p>

      <Link to="/metodologi" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline">
        Lihat rumus lengkap di halaman Metodologi →
      </Link>
    </div>
  )
}
