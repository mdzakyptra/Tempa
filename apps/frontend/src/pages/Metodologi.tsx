import { AlertTriangle, Clock3, HeartHandshake, MapPinned, ShieldAlert } from 'lucide-react'


const SCORE_COMPONENTS = [
  {
    name: 'Tingkat bahaya', weight: '35%', icon: ShieldAlert, color: 'text-red-700 bg-red-50',
    description: 'Dipilih warga ketika membuat laporan. Makin tinggi tingkat bahayanya, makin besar nilainya.',
    detail: 'Rendah = 25, sedang = 50, tinggi = 75, dan darurat = 100.',
  },
  {
    name: 'Warga terdampak', weight: '25%', icon: HeartHandshake, color: 'text-blue-700 bg-blue-50',
    description: 'Berasal dari estimasi warga terdampak saat pelaporan, ditambah jumlah dukungan warga.',
    detail: 'Nilainya dibandingkan dengan laporan aktif yang memiliki dampak terbanyak.',
  },
  {
    name: 'Lama menunggu', weight: '20%', icon: Clock3, color: 'text-amber-700 bg-amber-50',
    description: 'Dihitung sejak laporan dibuat agar laporan yang lebih lama tidak terus terlewat.',
    detail: 'Nilainya dibandingkan dengan laporan aktif yang paling lama menunggu.',
  },
  {
    name: 'Jalur vital', weight: '20%', icon: MapPinned, color: 'text-emerald-700 bg-emerald-50',
    description: 'Menandai laporan di kawasan yang ditetapkan sebagai jalur vital oleh pengelola kota.',
    detail: 'Nilai 100 bila berada di kawasan jalur vital, atau 0 bila tidak.',
  },
]

//<---------- Metodologi ------------>
export default function Metodologi() {
  return (
    <div className="bg-neutral-50 px-4 py-10 sm:px-6 lg:py-14">
      <main className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold tracking-wide text-blue-700">METODOLOGI ANTREAN</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Cara kami menentukan prioritas perbaikan
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-600">
          Setiap laporan diberi skor prioritas otomatis dari 0 sampai 100. Skor yang lebih tinggi akan tampil lebih
          dahulu di antrean, agar alasan urutannya dapat dilihat dan dipahami bersama.
        </p>

        <section className="mt-8 rounded-2xl bg-neutral-900 p-6 text-white sm:p-8" aria-labelledby="rumus-skor">
          <p className="text-sm font-medium text-neutral-300">Rumus skor prioritas</p>
          <h2 id="rumus-skor" className="mt-2 text-xl font-semibold sm:text-2xl">
            (Bahaya × 35%) + (Terdampak × 25%) + (Menunggu × 20%) + (Jalur vital × 20%)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            Masing-masing komponen dinilai pada skala 0–100. Hasil gabungannya dibulatkan hingga dua angka desimal.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="komponen-skor">
          <h2 id="komponen-skor" className="text-2xl font-bold text-neutral-900">Empat komponen skor</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {SCORE_COMPONENTS.map((component) => {
              const Icon = component.icon
              return (
                <article key={component.name} className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${component.color}`}>
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-bold text-neutral-700">
                      Bobot {component.weight}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{component.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{component.description}</p>
                  <p className="mt-3 border-t border-neutral-100 pt-3 text-xs leading-relaxed text-neutral-500">
                    {component.detail}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6" aria-labelledby="batasan-sistem">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <h2 id="batasan-sistem" className="font-semibold text-amber-950">Batasan yang perlu diketahui</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-amber-900">
                <li>Skor dihitung otomatis dari data laporan dan dukungan, bukan keputusan manual petugas.</li>
                <li>Nilai terdampak serta lama menunggu dapat berubah ketika laporan aktif lain berubah.</li>
                <li>Jalur vital memakai daftar kawasan konfigurasi, belum jarak presisi ke fasilitas atau jalan utama.</li>
                <li>Skor membantu mengurutkan prioritas; penanganan lapangan tetap bergantung verifikasi dan kondisi darurat.</li>
              </ul>
            </div>
          </div>
        </section>

        <p className="mt-8 text-sm text-neutral-500">
          Catatan pemeliharaan: angka bobot halaman ini mengikuti konfigurasi backend. Jika bobot backend berubah,
          halaman ini harus diperbarui pada saat yang sama.
        </p>
      </main>
    </div>
  )
}
