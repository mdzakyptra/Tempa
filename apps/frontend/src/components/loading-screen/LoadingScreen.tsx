import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import RotatingGlobe from '../ui/rotating-globe'

//<---------- hasSeenSplash -------------->
// Diekspor juga — halaman yang pakai LoadingScreen (Beranda, Auth, dst.)
// pakai ini buat nentuin `showContent` awal (konten baru dimount setelah
// splash beneran mulai kelar), tanpa duplikat logic sessionStorage-nya.
// `sessionKey` dikirim per halaman (lihat masing-masing pemanggil) — jadi
// splash Beranda sama splash Auth independen, saling nggak nge-skip.
export function hasSeenSplash(sessionKey: string) {
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
  /** Total durasi progress bar ngisi 0→100%, dalam ms. Default 1400. */
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

  // Stepped: 4 "lompatan" cepat (~0.3s) diselingi jeda diam (~0.2s) di tiap
  // kelipatan 25%, totalnya tetap pas `progressDurationMs`. Mulus: satu
  // animasi kontinu 0→100% sepanjang `progressDurationMs`.
  const progressDurationSec = progressDurationMs / 1000
  const progressAnimation = steppedProgress
    ? {
        animate: { width: ['0%', '25%', '25%', '50%', '50%', '75%', '75%', '100%', '100%'] },
        transition: { duration: progressDurationSec, times: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 0.9, 1], ease: 'easeInOut' as const },
      }
    : {
        animate: { width: '100%' },
        transition: { duration: progressDurationSec, ease: 'easeInOut' as const },
      }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-6 bg-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RotatingGlobe className="h-40 w-40 sm:h-48 sm:w-48" width={280} height={280} />
          </motion.div>

          <motion.img
            src="/aspiraku-wordmark.png"
            alt="Aspiraku"
            className="h-7 w-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1.5 w-48 overflow-hidden rounded-full bg-black/10"
          >
            <motion.div
              className="h-full rounded-full bg-black"
              initial={{ width: '0%' }}
              {...progressAnimation}
              onAnimationComplete={() => {
                setTimeout(() => {
                  setIsVisible(false)
                  onExitStart?.()
                }, 200)
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
