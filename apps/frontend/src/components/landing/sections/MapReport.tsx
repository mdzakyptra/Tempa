import { ArrowRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

//<---------- MapReport -------------->
export default function MapReport() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showRing, setShowRing] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      setShowRing(entry.isIntersecting);
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="lapor" ref={sectionRef} className="relative overflow-hidden bg-white">
      <div className="grid min-h-[760px] lg:min-h-[680px] lg:grid-cols-2">
        <article className="relative min-h-[560px] overflow-hidden lg:min-h-0">
          <img src="/citizen-reporting-photo.png" alt="Warga mendokumentasikan fasilitas kota" className="absolute inset-0 size-full object-cover object-center" />
          <div className="absolute inset-x-5 bottom-6 grid gap-3 sm:grid-cols-2 lg:inset-x-12 lg:bottom-8">
            <div className="rounded-lg bg-white/95 p-4 shadow-sm backdrop-blur-sm"><p className="font-serif text-3xl leading-none text-[#102c45]">80%</p><p className="mt-2 text-sm leading-tight text-[#102c45]">Laporan langsung tercatat dengan lokasi yang jelas.</p></div>
            <div className="rounded-lg bg-white/95 p-4 shadow-sm backdrop-blur-sm"><p className="font-serif text-3xl leading-none text-[#102c45]">24 jam</p><p className="mt-2 text-sm leading-tight text-[#102c45]">Warga dapat memantau perkembangan laporan.</p></div>
          </div>
        </article>

        <article className="relative flex min-h-[560px] flex-col items-center overflow-hidden bg-[#c4e6f7] px-6 py-10 text-[#102c45] lg:min-h-0 lg:px-12">
          <img src="/hero-sky-background.png" alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
          <div className="relative z-10 flex w-full max-w-xl flex-1 flex-col items-center">
            <h2 className="text-center font-serif text-[clamp(2rem,3.3vw,3.35rem)] leading-none tracking-[-0.055em]">Satu laporan, dampak nyata untuk kota</h2>
            <div className="relative mt-10 grid size-52 place-items-center sm:size-64">
              {showRing && <span className="map-report-ring absolute inset-0"><svg viewBox="0 0 100 100" className="size-full" aria-hidden>{Array.from({ length: 40 }, (_, index) => <line key={index} x1="50" y1="2" x2="50" y2={index % 4 === 0 ? "11" : "7"} stroke="currentColor" strokeWidth="0.45" transform={`rotate(${index * 9} 50 50)`} />)}</svg></span>}
              <div className="relative grid size-24 place-items-center rounded-[1.65rem] bg-white shadow-[0_15px_35px_rgba(16,44,69,.16)] sm:size-28"><MapPin className="size-12 fill-[#e45b22] text-[#102c45] sm:size-14" strokeWidth={1.4} /><span className="absolute text-[10px] font-bold text-white">!</span></div>
            </div>
            <p className="mt-8 text-center font-serif text-xl tracking-[-0.04em] sm:text-2xl">Titik yang jelas, antrean yang lebih adil</p>
            <a href="/lapor-baru" className="mt-5 inline-flex items-center gap-4 rounded-full bg-[#102c45] px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">Laporkan sekarang <ArrowRight className="size-4" /></a>
          </div>
        </article>
      </div>
    </section>
  );
}
