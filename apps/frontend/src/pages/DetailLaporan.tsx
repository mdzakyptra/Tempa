import { useParams } from 'react-router-dom'
import { StatusTimeline } from '../components/status-timeline'

//<---------- DetailLaporan -------------->
export default function DetailLaporan() {
  const { id } = useParams<{ id: string }>()
  if (!id) return null

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-neutral-900">Detail Laporan</h1>

      <h2 className="mt-8 text-lg font-semibold text-neutral-900">Riwayat Status</h2>
      <div className="mt-4">
        <StatusTimeline reportId={id} />
      </div>
    </div>
  )
}
