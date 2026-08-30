import type { CSSProperties, ReactNode } from 'react'


interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqRow {
  id: string
  speed: string
  direction: 'left' | 'right'
  faqItems: FaqItem[]
}

interface FaqData {
  mainTitle: string
  mainSubtitle: string
  rows: FaqRow[]
}

interface FaqCardProps {
  question: string
  answer: string
}

interface HorizontalScrollerProps {
  children: ReactNode
  speed: string
  direction: FaqRow['direction']
}

const FAQ_DATA: FaqData = {
  mainTitle: 'Pertanyaan yang sering ditanyakan',
  mainSubtitle: 'Pahami cara laporan diprioritaskan dan bagaimana Anda dapat ikut membantu perbaikan kota.',
  rows: [
    {
      id: 'laporan',
      speed: '60s',
      direction: 'left',
      faqItems: [
        {
          id: 'prioritas',
          question: 'Bagaimana urutan laporan ditentukan?',
          answer: 'Antrean memakai skor prioritas dari tingkat bahaya, dampak warga, waktu tunggu, dan jalur vital.',
        },
        {
          id: 'lapor',
          question: 'Bagaimana cara membuat laporan?',
          answer: 'Pilih menu Lapor Baru, isi lokasi serta kondisi kerusakan, lalu kirim laporan Anda.',
        },
      ],
    },
    {
      id: 'dukungan',
      speed: '48s',
      direction: 'right',
      faqItems: [
        {
          id: 'dukung',
          question: 'Apakah saya bisa mendukung laporan?',
          answer: 'Bisa. Masuk terlebih dahulu, kemudian pilih Dukung pada halaman detail laporan.',
        },
        {
          id: 'skor',
          question: 'Apakah dukungan mengubah skor?',
          answer: 'Ya. Dukungan warga ikut memperbarui komponen jumlah warga terdampak pada skor prioritas.',
        },
      ],
    },
    {
      id: 'transparansi',
      speed: '68s',
      direction: 'left',
      faqItems: [
        {
          id: 'pantau',
          question: 'Bisakah saya melihat perkembangan laporan?',
          answer: 'Status dan rincian skor dapat dilihat langsung dari halaman detail setiap laporan.',
        },
        {
          id: 'penanganan',
          question: 'Apakah skor memastikan laporan langsung ditangani?',
          answer: 'Skor membantu mengurutkan prioritas. Penanganan tetap bergantung verifikasi dan kondisi lapangan.',
        },
      ],
    },
  ],
}

//<---------- FaqCard ------------>
function FaqCard({ question, answer }: FaqCardProps) {
  return (
    <article className="w-[min(24rem,calc(100vw-3rem))] shrink-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-900">{question}</h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-600">{answer}</p>
    </article>
  )
}

//<---------- HorizontalScroller ------------>
function HorizontalScroller({ children, speed, direction }: HorizontalScrollerProps) {
  const animationClass = direction === 'right' ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal'

  return (
    <div className="scroller-mask w-full overflow-hidden">
      <div className={`flex w-max ${animationClass}`} style={{ '--scroll-duration': speed } as CSSProperties}>
        <div className="flex shrink-0 items-stretch gap-5 px-2 sm:gap-8 sm:px-4">{children}</div>
        <div className="flex shrink-0 items-stretch gap-5 px-2 sm:gap-8 sm:px-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

//<---------- HabitFaqScroller ------------>
export default function HabitFaqScroller() {
  return (
    <section className="overflow-hidden bg-neutral-50 py-16 sm:py-20" aria-labelledby="landing-faq-title">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="max-w-2xl text-center">
          <h2 id="landing-faq-title" className="animate-fade-in-up text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            {FAQ_DATA.mainTitle}
          </h2>
          <p className="animate-fade-in-up animation-delay-200 mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {FAQ_DATA.mainSubtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col gap-5 px-4 sm:mt-12 sm:gap-8 sm:px-6">
        {FAQ_DATA.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item) => (
              <FaqCard key={item.id} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>
    </section>
  )
}
