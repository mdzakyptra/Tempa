import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, Clock3, HeartHandshake, MapPinned, ShieldAlert } from 'lucide-react'


const SCORE_COMPONENTS = [
  {
    name: 'Tingkat bahaya', short: 'Bahaya', weight: '35%', icon: ShieldAlert, color: 'text-red-700 bg-red-50',
    description: 'Dipilih warga ketika membuat laporan. Makin tinggi tingkat bahayanya, makin besar nilainya.',
    detail: 'Rendah = 25, sedang = 50, tinggi = 75, dan darurat = 100.',
  },
  {
    name: 'Warga terdampak', short: 'Terdampak', weight: '25%', icon: HeartHandshake, color: 'text-blue-700 bg-blue-50',
    description: 'Berasal dari estimasi warga terdampak saat pelaporan, ditambah jumlah dukungan warga.',
    detail: 'Nilainya dibandingkan dengan laporan aktif yang memiliki dampak terbanyak.',
  },
  {
    name: 'Lama menunggu', short: 'Menunggu', weight: '20%', icon: Clock3, color: 'text-amber-700 bg-amber-50',
    description: 'Dihitung sejak laporan dibuat agar laporan yang lebih lama tidak terus terlewat.',
    detail: 'Nilainya dibandingkan dengan laporan aktif yang paling lama menunggu.',
  },
  {
    name: 'Jalur vital', short: 'Jalur vital', weight: '20%', icon: MapPinned, color: 'text-emerald-700 bg-emerald-50',
    description: 'Menandai laporan di kawasan yang ditetapkan sebagai jalur vital oleh pengelola kota.',
    detail: 'Nilai 100 bila berada di kawasan jalur vital, atau 0 bila tidak.',
  },
]

//<---------- RumusTerm -------------->
// -ml-2 nyeimbangin px-2 di dalem, jadi teksnya tetep rata kiri persis di
// bawah label "Rumus skor prioritas" — baik pas lagi jadi pill aktif maupun
// nggak. Tanpa ini pill aktif (yang punya px-2 alignment sendiri) keliatan
// geser dibanding baris lain.
function RumusTerm({ component, isActive, isLast }: { component: (typeof SCORE_COMPONENTS)[number]; isActive: boolean; isLast: boolean }) {
  return (
    <span className="relative -ml-2 inline-flex items-baseline rounded-lg px-2 py-1">
      {isActive && (
        <motion.span
          layoutId="rumus-highlight"
          className="absolute inset-0 rounded-lg bg-white/15"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <span className={`relative font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-500'}`}>
        ({component.short} × {component.weight})
        {!isLast && <span className="ml-1.5 font-normal text-neutral-600">+</span>}
      </span>
    </span>
  )
}

//<---------- RumusInteraktif -------------->
// Pola "sticky scroll reveal" — kolom kiri scroll NORMAL (bukan pinned,
// bukan dealt/numpuk), kolom kanan sticky nampilin rumus dengan suku yang
// cocok sama komponen aktif di-highlight. Deteksi item aktif: listener
// `scroll` di document dengan capture:true (bukan window — halaman ini
// scroll di dalam <main className="overflow-y-auto">, lihat Layout.tsx),
// rAF-throttled, hitung ulang dari geometri real semua section tiap event
// — section yang titik tengahnya paling deket ke tengah viewport yang
// menang. Robust terhadap scroll cepat/lompat jauh (sudah diverifikasi
// sebelumnya).
function RumusInteraktif() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let frame: number | null = null

    const recomputeActiveIndex = () => {
      frame = null
      const viewportCenter = window.innerHeight / 2
      let closestIndex = 0
      let closestDistance = Infinity
      sectionRefs.current.forEach((el, index) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      setActiveIndex(closestIndex)
    }

    const onScroll = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(recomputeActiveIndex)
    }

    recomputeActiveIndex()
    document.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        {SCORE_COMPONENTS.map((component, index) => {
          const isActive = index === activeIndex
          const Icon = component.icon
          return (
            <div
              key={component.name}
              ref={(el) => {
                sectionRefs.current[index] = el
              }}
              className="flex min-h-[45vh] flex-col justify-center lg:min-h-[55vh]"
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl transition-opacity duration-500 ${component.color} ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  <Icon className="size-5" aria-hidden />
                </div>
                <div>
                  <span className={`text-sm font-medium transition-colors duration-500 ${isActive ? 'text-neutral-500' : 'text-neutral-300'}`}>
                    Bobot {component.weight}
                  </span>
                  <h3 className={`mt-1 text-2xl font-bold tracking-tight transition-colors duration-500 sm:text-3xl ${isActive ? 'text-neutral-900' : 'text-neutral-300'}`}>
                    {component.name}
                  </h3>
                  <p className={`mt-3 max-w-md text-sm leading-relaxed transition-colors duration-500 ${isActive ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    {component.description}
                  </p>
                  <p className={`mt-2 max-w-md text-xs leading-relaxed transition-colors duration-500 ${isActive ? 'text-neutral-500' : 'text-neutral-300'}`}>
                    {component.detail}
                  </p>

                  {/* Fallback mobile — kolom kanan disembunyikan di bawah lg,
                      jadi rumus polos (tanpa highlight) ditaruh di sini biar
                      infonya tetap ada di layar sempit. */}
                  <p className="mt-4 font-mono text-xs text-neutral-400 lg:hidden">
                    ({component.short} × {component.weight})
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dua lapis sengaja: wrapper LUAR polos (stretch penuh setinggi
          baris grid — default align-items: stretch, TANPA h-fit) supaya
          punya tinggi sepanjang 4 komponen; card sticky-nya ada di
          wrapper DALAM yang pendek (setinggi card doang). Kalau `sticky`
          ditaruh langsung di elemen yang sama dengan yang di-stretch
          (satu div buat dua-duanya), elemen itu jadi SAMA TINGGINYA
          dengan containing block-nya sendiri — nggak ada "ruang jalan"
          buat sticky-nya geser, jadi kelihatan kayak nggak nempel sama
          sekali. */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl bg-neutral-900 p-6 text-white">
          <p className="text-sm font-medium text-neutral-400">Rumus skor prioritas</p>
          <div className="mt-3 flex flex-col items-start gap-1.5 text-lg font-semibold">
            {SCORE_COMPONENTS.map((component, index) => (
              <RumusTerm
                key={component.name}
                component={component}
                isActive={index === activeIndex}
                isLast={index === SCORE_COMPONENTS.length - 1}
              />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Masing-masing komponen dinilai pada skala 0–100. Hasil gabungannya dibulatkan hingga dua angka desimal.
          </p>
        </div>
      </div>
    </div>
  )
}

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

        <section className="mt-10" aria-labelledby="komponen-skor">
          <h2 id="komponen-skor" className="text-2xl font-bold text-neutral-900">Empat komponen skor</h2>
          <RumusInteraktif />
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
