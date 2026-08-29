import { PhotoUpload } from '../components/photo-upload'

// TODO(JEK-37): reportId di bawah ini hardcode sementara buat verifikasi
// manual JEK-38 (komponen upload foto), karena halaman form Lapor Baru
// sesungguhnya belum dibangun. Ganti begitu JEK-37 mulai dikerjain — reportId
// harusnya datang dari laporan yang baru aja dibuat via POST /reports.
const TEMP_REPORT_ID = 'e6f97322-8842-4829-82fd-94be1e58df93'

//<---------- LaporBaru -------------->
export default function LaporBaru() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Lapor Baru</h1>
      <PhotoUpload reportId={TEMP_REPORT_ID} onUploaded={(photo) => console.log('foto tersimpan:', photo)} />
    </div>
  )
}
