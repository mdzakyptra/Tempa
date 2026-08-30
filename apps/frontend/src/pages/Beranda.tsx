import ScrollProgress from '../components/landing/animations/ScrollProgress'
import CustomCursor from '../components/landing/animations/CustomCursor'
import Navbar from '../components/landing/sections/Navbar'
import Hero from '../components/landing/sections/Hero'
import LogoMarquee from '../components/landing/sections/LogoMarquee'
import Manifesto from '../components/landing/sections/Manifesto'
import MapReport from '../components/landing/sections/MapReport'
import WorkStack from '../components/landing/sections/WorkStack'
import Process from '../components/landing/sections/Process'
import Stats from '../components/landing/sections/Stats'
import CTA from '../components/landing/sections/CTA'
import Footer from '../components/landing/sections/Footer'
import { QueueAssistant } from '../components/queue-assistant'


//<---------- Beranda -------------->
export default function Beranda() {
  return (
    <div className="bg-white text-black antialiased">
      <ScrollProgress />
      <CustomCursor />
      <div className="grain-overlay" aria-hidden />

      <Navbar />

      <main className="relative">
        <Hero />
        <LogoMarquee />
        <Manifesto />
        <MapReport />
        <WorkStack />
        <Process />
        <Stats />
        <CTA />
      </main>

      <Footer />
      <QueueAssistant />
    </div>
  )
}
