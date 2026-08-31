import { motion } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import CountUp from '../components/landing/animations/CountUp'


const SCORE_COMPONENTS = [
  { name: 'Tingkat bahaya', number: '01', weight: 35, icon: '/TingkatBahaya.png', color: 'bg-[#ff5c35]', text: 'text-[#ff5c35]', soft: 'bg-[#fff0eb]', description: 'Dipilih warga ketika membuat laporan. Makin tinggi tingkat bahayanya, makin besar nilainya.', detail: 'Rendah = 25, sedang = 50, tinggi = 75, dan darurat = 100.' },
  { name: 'Warga terdampak', number: '02', weight: 25, icon: '/orangjatuh.png', color: 'bg-[#5856d6]', text: 'text-[#5856d6]', soft: 'bg-[#efefff]', description: 'Berasal dari estimasi warga terdampak saat pelaporan, ditambah jumlah dukungan warga.', detail: 'Dibandingkan dengan laporan aktif yang memiliki dampak terbanyak.' },
  { name: 'Lama menunggu', number: '03', weight: 20, icon: '/menunggu.png', color: 'bg-[#e49a1f]', text: 'text-[#a66200]', soft: 'bg-[#fff7e6]', description: 'Dihitung sejak laporan dibuat agar laporan yang lebih lama tidak terus terlewat.', detail: 'Dibandingkan dengan laporan aktif yang paling lama menunggu.' },
  { name: 'Jalur vital', number: '04', weight: 20, icon: '/jalur.png', color: 'bg-[#13a87b]', text: 'text-[#087b58]', soft: 'bg-[#e9fbf5]', description: 'Menandai laporan di kawasan yang ditetapkan sebagai jalur vital oleh pengelola kota.', detail: 'Nilai 100 bila berada di kawasan jalur vital, atau 0 bila tidak.' },
]

const TOTAL_WEIGHT = SCORE_COMPONENTS.reduce((total, component) => total + component.weight, 0)
const DONUT_RADIUS = 52
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS
const DONUT_SEGMENTS = SCORE_COMPONENTS.reduce<{ component: (typeof SCORE_COMPONENTS)[number]; dash: number; offset: number }[]>((segments, component) => {
  const dash = (component.weight / TOTAL_WEIGHT) * DONUT_CIRCUMFERENCE
  const offset = segments.length ? segments[segments.length - 1].offset + segments[segments.length - 1].dash : 0
  return [...segments, { component, dash, offset }]
}, [])

//<---------- DotField ------------>
function DotField() {
  return <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(#171817_1px,transparent_1px)] [background-size:13px_13px]" aria-hidden />
}

//<---------- ScoreDonut ------------>
function ScoreDonut() {
  return (
    <div className="relative mx-auto size-36 shrink-0 sm:size-40">
      <svg viewBox="0 0 140 140" className="size-full -rotate-90" aria-label="Komposisi bobot skor prioritas" role="img">
        <circle cx="70" cy="70" r={DONUT_RADIUS} fill="none" stroke="currentColor" strokeWidth="14" className="text-neutral-100" />
        {DONUT_SEGMENTS.map(({ component, dash, offset }, index) => <motion.circle key={component.name} cx="70" cy="70" r={DONUT_RADIUS} fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" className={component.text} strokeDasharray={`${Math.max(dash - 3, 0)} ${DONUT_CIRCUMFERENCE - dash + 3}`} style={{ strokeDashoffset: -offset }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.1, ease: 'easeOut' }} />)}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-black tracking-tighter text-neutral-950">100</span><span className="font-mono text-[8px] uppercase tracking-[.16em] text-neutral-400">total</span></div>
    </div>
  )
}

//<---------- ScoreBar ------------>
function ScoreBar() {
  return <div className="overflow-hidden rounded-full bg-neutral-100 p-1"><div className="flex h-5 gap-1 overflow-hidden rounded-full">{SCORE_COMPONENTS.map((component) => <motion.div key={component.name} className={component.color} initial={{ width: 0 }} whileInView={{ width: `${component.weight}%` }} viewport={{ once: true }} transition={{ duration: 0.85, delay: 0.15, ease: 'easeOut' }} />)}</div></div>
}

//<---------- MethodCard ------------>
// Ikonnya PNG solid (aset dari /public), bukan lucide — dirender sebagai
// CSS mask (bg currentColor di-mask bentuk PNG-nya) biar tetap bisa
// ditintai warna per komponen kayak ikon lucide sebelumnya, bukan cuma
// item hitam polos di atas lingkaran warna.
function MethodCard({ component }: { component: (typeof SCORE_COMPONENTS)[number] }) {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }} className="group relative overflow-hidden rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-[0_12px_35px_-25px_rgba(0,0,0,.38)] transition-transform duration-300 hover:-translate-y-1 sm:p-6">
      <div className={`absolute right-0 top-0 size-28 -translate-y-1/2 translate-x-1/2 rounded-full ${component.soft}`} aria-hidden />
      <div className="relative flex items-start justify-between gap-4"><div className={`flex size-11 items-center justify-center rounded-2xl ${component.soft}`}><span className={`size-5 ${component.text}`} style={{ backgroundColor: 'currentColor', WebkitMaskImage: `url(${component.icon})`, maskImage: `url(${component.icon})`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }} aria-hidden /></div><span className="font-mono text-xs tracking-[.18em] text-neutral-400">{component.number}</span></div>
      <div className="relative mt-9 flex items-end justify-between gap-3"><h2 className="text-2xl font-black tracking-tight text-neutral-950">{component.name}</h2><span className={`font-mono text-2xl font-bold tracking-tighter ${component.text}`}>{component.weight}%</span></div>
      <p className="relative mt-3 text-sm leading-relaxed text-neutral-600">{component.description}</p>
      <div className="relative mt-5 border-t border-dashed border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">{component.detail}</div>
    </motion.article>
  )
}

//<---------- Metodologi ------------>
export default function Metodologi() {
  return (
    <div className="min-h-full bg-[#f6f5f1] px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="mx-auto max-w-6xl">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-black/8 bg-white px-6 py-8 shadow-[0_12px_35px_-25px_rgba(0,0,0,.25)] sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <DotField />
          <div className="absolute -right-12 top-0 size-64 rounded-full border border-[#d9ff72] sm:size-80" aria-hidden />
          <div className="absolute -right-4 top-8 size-40 rounded-full border border-neutral-200 sm:right-16" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <div><p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.2em] text-neutral-500"><span className="size-1.5 rounded-full bg-[#13a87b]" /> Sistem prioritas v1.0</p><h1 className="mt-7 max-w-3xl text-4xl font-black leading-[.95] tracking-[-.06em] text-neutral-950 sm:text-6xl lg:text-7xl">Setiap laporan<br /><span className="text-[#087b58]">punya alasan</span><br />untuk didahulukan.</h1><p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">Antrean Kota menghitung skor prioritas dari 0 sampai 100. Bukan sekadar siapa yang datang duluan—tetapi laporan mana yang paling mendesak untuk kota.</p></div>
            <div className="rounded-3xl border border-neutral-200 bg-[#f8f8f5] p-5 sm:p-6"><div className="flex items-center gap-4"><ScoreDonut /><div><span className="font-mono text-[10px] uppercase tracking-[.2em] text-neutral-500">Bobot total</span><CountUp to={TOTAL_WEIGHT} suffix="%" duration={1.2} className="mt-1 block text-4xl font-black tracking-tighter text-neutral-950" /><span className="text-xs text-neutral-500">empat faktor</span></div></div><div className="mt-5"><ScoreBar /></div><p className="mt-4 text-xs leading-relaxed text-neutral-500">Empat sinyal diolah secara konsisten untuk semua laporan aktif.</p></div>
          </div>
        </section>

        <section className="grid gap-4 py-7 sm:py-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-10"><div className="lg:sticky lg:top-8 lg:h-fit"><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-neutral-500">01 / Mesin penilai</p><h2 className="mt-4 max-w-sm text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">Empat sinyal.<br />Satu urutan yang terbuka.</h2><p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-600">Bobotnya bersifat tetap. Nilai di dalam setiap faktor dapat berubah mengikuti kondisi laporan yang masih aktif.</p><div className="mt-7 hidden items-center gap-2 text-sm font-semibold text-neutral-900 lg:flex">Jelajahi faktor <ArrowDownRight className="size-4" /></div></div><div className="grid gap-4 sm:grid-cols-2">{SCORE_COMPONENTS.map((component) => <MethodCard key={component.name} component={component} />)}</div></section>

        <section className="grid overflow-hidden rounded-[2rem] bg-[#d9ff72] sm:rounded-[2.5rem] lg:grid-cols-[1.05fr_.95fr]"><div className="p-6 sm:p-9 lg:p-12"><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-neutral-700">02 / Cara hitung</p><h2 className="mt-4 text-3xl font-black leading-none tracking-[-.05em] text-neutral-950 sm:text-5xl">Nilai yang bisa<br />ditelusuri.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-700">Setiap komponen dinilai pada skala 0–100, dikalikan dengan bobotnya, lalu dijumlahkan. Hasil akhir dibulatkan hingga dua angka desimal.</p></div><div className="m-3 rounded-[1.5rem] bg-[#171817] p-6 text-white sm:m-5 sm:p-9"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-white/45">Rumus skor prioritas</p><div className="mt-6 space-y-3 font-mono text-sm leading-relaxed text-white/85 sm:text-base">{SCORE_COMPONENTS.map((component, index) => <div key={component.name} className="flex items-center gap-3"><span className={`size-2 rounded-full ${component.color}`} /><span>({component.name} × {component.weight}%)</span>{index < SCORE_COMPONENTS.length - 1 && <span className="ml-auto text-white/25">+</span>}</div>)}</div><div className="mt-7 border-t border-white/10 pt-5 text-2xl font-black tracking-tight">= skor 0—100</div></div></section>

        <section className="mt-7 overflow-hidden rounded-[2rem] bg-[#171817] p-6 text-white sm:mt-10 sm:rounded-[2.5rem] sm:p-9"><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#e49a1f]">Batasan sistem</p><h2 className="mt-2 max-w-lg text-2xl font-black tracking-tight text-white sm:text-3xl">Transparan berarti juga menjelaskan batasannya.</h2><div className="mt-7 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-4 sm:divide-x sm:divide-white/10"><p className="text-sm leading-relaxed text-white/70 sm:pr-6">Skor dihitung otomatis dari data laporan dan dukungan, bukan keputusan manual petugas.</p><p className="text-sm leading-relaxed text-white/70 sm:px-6">Nilai terdampak serta lama menunggu dapat berubah ketika laporan aktif lain berubah.</p><p className="text-sm leading-relaxed text-white/70 sm:px-6">Jalur vital memakai daftar kawasan konfigurasi, belum jarak presisi ke fasilitas atau jalan utama.</p><p className="text-sm leading-relaxed text-white/70 sm:pl-6">Skor membantu mengurutkan prioritas; penanganan lapangan tetap bergantung verifikasi dan kondisi darurat.</p></div></section>
        <p className="px-2 py-8 text-xs leading-relaxed text-neutral-500 sm:py-10">Catatan pemeliharaan: angka bobot halaman ini mengikuti konfigurasi backend. Jika bobot backend berubah, halaman ini harus diperbarui pada saat yang sama.</p>
      </main>
    </div>
  )
}
