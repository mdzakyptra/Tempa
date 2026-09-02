import ScrollReveal from "../animations/ScrollReveal";
import GlobeMapTransition from "./GlobeMapTransition";


//<---------- CityCoordinates ------------>
export default function CityCoordinates() {
  return (
    <section className="relative overflow-hidden bg-white px-5 pb-8 pt-14 text-[#102c45] sm:px-8 md:px-12 lg:min-h-0 lg:px-16 lg:pb-8 lg:pt-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(180px,.55fr)_minmax(300px,.75fr)_minmax(300px,.85fr)] lg:items-center lg:gap-16">
        <ScrollReveal direction="right">
          <p className="font-serif text-sm italic text-[#102c45]/80">peta kita</p>
          <h2 className="mt-2 text-[clamp(3.5rem,8vw,8.5rem)] font-black uppercase leading-[.76] tracking-[-0.09em]">Peta</h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <img src="/globe-gallery-frame.png" alt="Bingkai galeri untuk globe peta" className="absolute inset-0 size-full object-contain" />
            {/* Persentase diukur dari lubang gelap di globe-gallery-frame.png (209,204)-(1033,1033)
                dari kanvas 1254px — bukan inset seragam, bingkainya memang gak simetris. */}
            <div className="absolute bottom-[17.5%] left-[16.7%] right-[17.5%] top-[16.3%]">
              <GlobeMapTransition compact />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0.15}>
          <p className="font-serif text-3xl leading-none tracking-[-0.06em] sm:text-4xl">Setiap titik punya cerita.</p>
          <h3 className="mt-2 font-serif text-3xl leading-none tracking-[-0.06em] sm:text-4xl">Setiap laporan punya arah.</h3>
          <p className="mt-12 max-w-md text-base leading-snug text-[#102c45]/80">Warga menandai lokasi kerusakan langsung di peta. Dari titik itu, Aspiraku membaca kedekatan jalur vital untuk menyusun antrean perbaikan yang terbuka dan adil.</p>
          <a href="/antrean" className="mt-6 inline-flex border border-[#102c45] px-4 py-3 text-sm transition-colors hover:bg-[#102c45] hover:text-white">Jelajahi peta ↗</a>
        </ScrollReveal>
      </div>
    </section>
  );
}
