import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'


const LOADING_LINE_HEIGHTS = [32, 68, 44, 82, 55, 28, 74, 39, 91, 47, 63, 35, 79, 52, 96, 41, 71, 30, 58, 86, 46, 66, 37, 77, 50, 93, 43, 61, 33, 83, 54, 70, 40, 89, 48, 64, 31, 76, 57, 98]

//<---------- useLoadingProgress ------------>
function useLoadingProgress(isLoading: boolean, durationMs: number) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const startedAt = performance.now()
    let frameId = 0

    const updateProgress = (now: number) => {
      const nextProgress = Math.min(Math.round(((now - startedAt) / durationMs) * 100), 100)
      setProgress(nextProgress)
      if (nextProgress < 100) frameId = requestAnimationFrame(updateProgress)
    }

    frameId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(frameId)
  }, [durationMs, isLoading])

  return progress
}

interface LoadingLinesProps {
  duration: number
  stepped: boolean
  onComplete: () => void
}

//<---------- LoadingLines ------------>
function LoadingLines({ duration, stepped, onComplete }: LoadingLinesProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-28 items-end gap-px px-1 sm:h-40 sm:px-2" aria-hidden="true">
      {LOADING_LINE_HEIGHTS.map((height, index) => (
        <div key={`${height}-${index}`} className="flex-1 self-end bg-black/10" style={{ height: `${height}%` }}>
          <motion.span
            className="block h-full origin-bottom bg-black"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: duration * 0.55,
              delay: (index / (LOADING_LINE_HEIGHTS.length - 1)) * duration * 0.45,
              ease: stepped ? 'easeInOut' : 'linear',
            }}
            onAnimationComplete={index === LOADING_LINE_HEIGHTS.length - 1 ? onComplete : undefined}
          />
        </div>
      ))}
    </div>
  )
}

//<---------- hasSeenSplash -------------->
// `sessionKey` dikirim per halaman (lihat masing-masing pemanggil) — jadi
// splash Beranda sama splash Auth independen, saling nggak nge-skip.
function hasSeenSplash(sessionKey: string) {
  try {
    return sessionStorage.getItem(sessionKey) === '1'
  } catch {
    // sessionStorage bisa gagal (mode privat/quota) — anggap belum pernah
    // lihat, jangan sampai splash malah nge-block halaman.
    return true
  }
}

function markSplashSeen(sessionKey: string) {
  try {
    sessionStorage.setItem(sessionKey, '1')
  } catch {
    // no-op — kalau storage nggak bisa ditulis, splash cuma bakal muncul
    // lagi di kunjungan berikutnya, bukan masalah besar.
  }
}

//<---------- LoadingScreen -------------->
// Cuma sekali per sesi browser PER HALAMAN (sessionStorage, key beda-beda
// per pemanggil — lihat `sessionKey`) — pindah ke halaman lain terus balik
// lagi di sesi yang sama TIDAK memunculkan splash lagi, tapi sesi
// baru/browser ditutup-buka lagi akan. Progress bar-nya timed/simulasi,
// bukan nunggu network beneran — nggak ada satu sinyal "halaman selesai
// loading" yang bersih buat disinkronin (macam-macam lazy chunk &
// gambar), jadi durasi tetap yang terasa disengaja lebih robust.
//
// Konten di belakang splash (mis. globe Three.js di Hero Beranda, atau
// Dither WebGL di Auth) sengaja BARU dimount setelah splash mulai
// fade-out (`onExitStart`) — bukan dirender bareng lalu ditutup-tutupin
// doang. Kalau dirender bareng, render loop-nya numpuk sama render loop
// globe splash ini sendiri walau nggak keliatan, jadi kerasa berat.
// `onExitStart` dipanggil pas fade-out MULAI (bukan nunggu bener-bener
// hilang) — splash masih opaque nutupin ~0.4 detik sisanya, jadi konten
// yang mulai mount di titik ini dapet head-start tanpa sempet nge-pop
// kelihatan kosong.
interface LoadingScreenProps {
  /** Wajib kalau `oncePerSession` true (default) — diabaikan kalau false. */
  sessionKey?: string
  /** Default true (sekali per sesi, lewat `sessionKey`). Set false buat
   * splash yang mau tampil TIAP kali komponennya di-mount — tiap kunjungan
   * atau refresh halaman itu, bukan cuma sekali per sesi (mis. Auth). */
  oncePerSession?: boolean
  /** Total durasi progress garis loading sampai penuh, dalam ms. Default 1400. */
  progressDurationMs?: number
  /** Default false (ngisi mulus/kontinu). True = ngisi berhenti-jalan tiap
   * 25% (0→25→50→75→100, jeda sebentar di tiap step) — dipakai Auth biar
   * durasi loading kerasa "disengaja" & kasih waktu konten di belakang
   * (Dither WebGL) render duluan sebelum ke-reveal. */
  steppedProgress?: boolean
  onExitStart?: () => void
}

export default function LoadingScreen({
  sessionKey,
  oncePerSession = true,
  progressDurationMs = 1400,
  steppedProgress = false,
  onExitStart,
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (!oncePerSession || !sessionKey) return true
    if (hasSeenSplash(sessionKey)) return false
    markSplashSeen(sessionKey)
    return true
  })
  const progress = useLoadingProgress(isVisible, progressDurationMs)

  // Semua garis mencapai penuh tepat di akhir durasi yang ditentukan.
  const progressDurationSec = progressDurationMs / 1000

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-6 bg-white"
        >
          <motion.img
            src="/aspiraku-wordmark.png"
            alt="Aspiraku"
            className="h-7 w-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />

          <LoadingLines
            duration={progressDurationSec}
            stepped={steppedProgress}
            onComplete={() => {
              setTimeout(() => {
                setIsVisible(false)
                onExitStart?.()
              }, 200)
            }}
          />

          <output className="absolute bottom-32 right-5 z-10 bg-white/90 px-2 py-1 font-mono text-2xl font-bold tracking-[0.08em] text-black sm:bottom-44 sm:right-7 sm:text-3xl" aria-label={`Memuat ${progress} persen`}>
            {String(progress).padStart(3, '0')}%
          </output>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
