import ScrollProgress from '../components/landing/animations/ScrollProgress'
import CustomCursor from '../components/landing/animations/CustomCursor'
import Navbar from '../components/landing/sections/Navbar'
import Hero from '../components/landing/sections/Hero'
import LogoMarquee from '../components/landing/sections/LogoMarquee'
import Manifesto from '../components/landing/sections/Manifesto'
import WorkStack from '../components/landing/sections/WorkStack'
import Process from '../components/landing/sections/Process'
import Gallery from '../components/landing/sections/Gallery'
import Stats from '../components/landing/sections/Stats'
import CTA from '../components/landing/sections/CTA'
import Footer from '../components/landing/sections/Footer'


//<---------- Beranda -------------->
export default function Beranda() {
  return (
    <div className="bg-black text-white antialiased">
      <ScrollProgress />
      <CustomCursor />
      <div className="grain-overlay" aria-hidden />

      <Navbar />

      <main className="relative">
        <Hero />
        <LogoMarquee />
        <Manifesto />
        <WorkStack />
        <Process />
        <Gallery />
        <Stats />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
