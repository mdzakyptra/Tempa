import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import RotatingGlobe from '../components/ui/rotating-globe'

interface NotFoundProps {
  title?: string
  description?: string
  backTo?: string
  backLabel?: string
}

//<---------- NotFound -------------->
export default function NotFound({
  title = 'Halaman tidak ditemukan',
  description = 'Alamat yang kamu tuju tidak ada, atau sudah dipindahkan.',
  backTo = '/antrean',
  backLabel = 'Kembali ke antrean',
}: NotFoundProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-stroke text-7xl font-bold leading-none sm:text-8xl">4</span>
        <RotatingGlobe
          className="h-24 w-24 shrink-0 sm:h-32 sm:w-32"
          width={256}
          height={256}
        />
        <span className="text-stroke text-7xl font-bold leading-none sm:text-8xl">4</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-3"
      >
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h1>
        <p className="max-w-md text-sm text-neutral-500">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Link
          to={backTo}
          className="inline-block rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          {backLabel}
        </Link>
      </motion.div>
    </div>
  )
}
