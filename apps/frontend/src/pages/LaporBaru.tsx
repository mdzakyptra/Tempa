import { PhotoUpload } from '../components/photo-upload'
import { SimilarReportsSuggestion } from '../components/similar-reports'

// TODO(JEK-37): nilai di bawah ini hardcode sementara buat verifikasi manual
// JEK-38 (upload foto) & JEK-39/48 (deteksi laporan serupa), karena halaman
// form Lapor Baru sesungguhnya belum dibangun. Ganti begitu JEK-37 mulai
// dikerjain — nilai-nilai ini harusnya datang dari form beneran.
const TEMP_REPORT_ID = 'e6f97322-8842-4829-82fd-94be1e58df93'
const TEMP_KAWASAN = 'Kelurahan Sukajadi'
const TEMP_JENIS_KERUSAKAN = 'jalan' as const

//<---------- LaporBaru -------------->
export default function LaporBaru() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Lapor Baru</h1>

      <div className="mb-4">
        <SimilarReportsSuggestion kawasan={TEMP_KAWASAN} jenis_kerusakan={TEMP_JENIS_KERUSAKAN} />
      </div>

      <PhotoUpload reportId={TEMP_REPORT_ID} onUploaded={(photo) => console.log('foto tersimpan:', photo)} />
    </div>
  )
}
