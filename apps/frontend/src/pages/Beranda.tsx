import { useState } from 'react'
import ScrollProgress from '../components/landing/animations/ScrollProgress'
import CustomCursor from '../components/landing/animations/CustomCursor'
import SmoothScroll from '../components/landing/SmoothScroll'
import Navbar from '../components/landing/sections/Navbar'
import Hero from '../components/landing/sections/Hero'
import WorkStack from '../components/landing/sections/WorkStack'
import MapReport from '../components/landing/sections/MapReport'
import CityCoordinates from '../components/landing/sections/CityCoordinates'
import Footer from '../components/landing/sections/Footer'
import HabitFaqScroller from '../components/landing/sections/HabitFaqScroller'
import LoadingScreen from '../components/loading-screen/LoadingScreen'



//<---------- Beranda -------------->
// Konten Beranda (Hero-nya punya globe Three.js, MapReport punya globe
// WireframeDotted-nya sendiri) sengaja BARU dimount setelah splash mulai
// fade-out — lihat komentar di LoadingScreen.tsx. Splash selalu ditampilkan
// setiap halaman dimuat, termasuk ketika browser melakukan refresh.
export default function Beranda() {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="font-display overflow-x-clip bg-white text-black antialiased">
      <LoadingScreen oncePerSession={false} progressDurationMs={2600} onExitStart={() => setShowContent(true)} />

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
            <CityCoordinates />
            <HabitFaqScroller />
          </main>

          <Footer />
        </>
      )}
    </div>
  )
}
