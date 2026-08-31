import ScrollProgress from '../components/landing/animations/ScrollProgress'
import CustomCursor from '../components/landing/animations/CustomCursor'
import Navbar from '../components/landing/sections/Navbar'
import Hero from '../components/landing/sections/Hero'
import WorkStack from '../components/landing/sections/WorkStack'
import MapReport from '../components/landing/sections/MapReport'
import Footer from '../components/landing/sections/Footer'
import HabitFaqScroller from '../components/landing/sections/HabitFaqScroller'


//<---------- Beranda -------------->
export default function Beranda() {
  return (
    <div className="font-display overflow-x-clip bg-white text-black antialiased">
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
    </div>
  )
}
