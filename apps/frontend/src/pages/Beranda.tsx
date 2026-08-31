import { useState } from 'react'
import ScrollProgress from '../components/landing/animations/ScrollProgress'
import CustomCursor from '../components/landing/animations/CustomCursor'
import SmoothScroll from '../components/landing/SmoothScroll'
import Navbar from '../components/landing/sections/Navbar'
import Hero from '../components/landing/sections/Hero'
import WorkStack from '../components/landing/sections/WorkStack'
import MapReport from '../components/landing/sections/MapReport'
import Footer from '../components/landing/sections/Footer'
import HabitFaqScroller from '../components/landing/sections/HabitFaqScroller'
import LoadingScreen, { hasSeenSplash } from '../components/loading-screen/LoadingScreen'

const SPLASH_SESSION_KEY = 'aspiraku-beranda-splash-seen'

//<---------- Beranda -------------->
// Konten Beranda (Hero-nya punya globe Three.js, MapReport punya globe
// WireframeDotted-nya sendiri) sengaja BARU dimount setelah splash mulai
// fade-out — lihat komentar di LoadingScreen.tsx. `hasSeenSplash()` dibaca
// sinkron di initializer biar returning-visitor (splash nggak nongol)
// langsung dapet `true`, nggak kena delay sama sekali.
export default function Beranda() {
  const [showContent, setShowContent] = useState(() => hasSeenSplash(SPLASH_SESSION_KEY))

  return (
    <div className="font-display overflow-x-clip bg-white text-black antialiased">
      <LoadingScreen sessionKey={SPLASH_SESSION_KEY} onExitStart={() => setShowContent(true)} />

      {showContent && (
        <>
          <SmoothScroll />
          <ScrollProgress />
          <CustomCursor />
          <div className="grain-overlay" aria-hidden />

          <Navbar />

          <main className="relative">
            <Hero />
            <WorkStack />
            <MapReport />
            <HabitFaqScroller />
          </main>

          <Footer />
        </>
      )}
    </div>
  )
}
