import { ArrowUpRight, ChevronLeft, ChevronRight, MapPinned } from "lucide-react";
import { useEffect, useRef, useState } from "react";


const pages = [
  { number: "01", title: "Antrean laporan", eyebrow: "Laporan prioritas", caption: "Laporan yang perlu ditangani", description: "Pantau laporan warga yang paling mendesak, lengkap dengan skor prioritas dan pembaruan statusnya.", href: "/antrean", image: "/city-report-inspection.png", imageAlt: "Dokumentasi inspeksi fasilitas kota" },
  { number: "02", title: "Detail laporan", eyebrow: "Transparan untuk semua", caption: "Dari laporan sampai tindak lanjut", description: "Lihat bukti, riwayat penanganan, dan alasan sebuah laporan berada di antrean saat ini.", href: "/antrean", image: "/report-detail-followup.png", imageAlt: "Petugas memeriksa detail laporan perbaikan trotoar" },
  { number: "03", title: "Lapor baru", eyebrow: "Suaramu punya dampak", caption: "Satu laporan, langkah awal perubahan", description: "Kirim foto dan lokasi masalah di kotamu. Kami bantu cek laporan serupa sebelum dikirim.", href: "/lapor-baru", image: "/report-new-submission.png", imageAlt: "Warga mendokumentasikan kerusakan trotoar untuk laporan baru" },
  { number: "04", title: "Metodologi", eyebrow: "Prioritas yang bisa dipahami", caption: "Cara kami menyusun antrean", description: "Pahami bobot, rumus, dan prinsip yang membuat setiap urutan laporan tetap adil dan terbuka.", href: "/metodologi", image: "/report-priority-methodology.png", imageAlt: "Peta dan data yang digunakan untuk menyusun prioritas laporan" },
];

//<---------- WorkStack -------------->
export default function WorkStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [showRing, setShowRing] = useState(false);
  const page = pages[activePage];

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
    <section id="work" ref={sectionRef} className="relative z-10 -mt-[75vh] overflow-hidden bg-white px-5 py-10 text-[#102c45] sm:px-8 md:px-12 md:py-16 lg:min-h-[720px] lg:px-16 lg:py-14">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,.52fr)] lg:gap-x-16">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-serif text-[clamp(2.9rem,6.1vw,6.5rem)] leading-[.86] tracking-[-0.065em]">
            <span>Warga melapor,</span><img src="/city-report-marker.png" alt="" className="h-[1.15em] w-[1.85em] object-contain lg:h-[0.72em] lg:w-[1.15em]" /><span>kota bergerak</span>
          </div>
          <div className="ml-[48%] mt-3 hidden rotate-[-4deg] font-serif text-xl italic text-[#e45b22] md:block">Mulai dari satu laporan</div>
        </div>

        <div className="lg:pt-1"><p className="max-w-[260px] text-sm leading-snug tracking-[-0.03em]">Laporan warga yang jelas, proses penanganan yang bisa dipantau setiap hari.</p><a href="/lapor-baru" className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#102c45] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">Buat laporan <MapPinned className="size-4" strokeWidth={1.7} /></a></div>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1440px] items-center gap-9 lg:grid-cols-[minmax(190px,.52fr)_minmax(350px,1fr)_minmax(260px,.62fr)] lg:gap-x-8">
        <div className="flex items-center gap-5 lg:justify-end"><span className="h-px w-20 bg-[#102c45]/15" /><button type="button" onClick={() => setActivePage((activePage + pages.length - 1) % pages.length)} className="rounded-full p-1 transition-colors hover:bg-[#102c45]/10" aria-label="Halaman sebelumnya"><ChevronLeft className="size-4" /></button><p className="text-[clamp(2.6rem,4vw,4.5rem)] leading-none tracking-[-0.07em]">Next</p><button type="button" onClick={() => setActivePage((activePage + 1) % pages.length)} className="rounded-full p-1 transition-colors hover:bg-[#102c45]/10" aria-label="Halaman berikutnya"><ChevronRight className="size-4" /></button></div>

        <article className="relative lg:w-[65%] lg:justify-self-center">{showRing && <span className="map-report-ring absolute -left-32 top-1/2 hidden size-64 -translate-y-1/2 lg:block"><svg viewBox="0 0 100 100" className="size-full" aria-hidden>{Array.from({ length: 40 }, (_, index) => <line key={index} x1="50" y1="2" x2="50" y2={index % 4 === 0 ? "11" : "7"} stroke="currentColor" strokeWidth="0.45" transform={`rotate(${index * 9} 50 50)`} />)}</svg></span>}<div className="relative aspect-square overflow-hidden bg-[#dbe8e7]"><img src={page.image} alt={page.imageAlt} className="size-full object-cover transition-transform duration-700 hover:scale-105" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102c45]/65 to-transparent px-5 pb-5 pt-14 text-white"><p className="text-xs uppercase tracking-[0.18em]">{page.eyebrow}</p><p className="mt-1 text-2xl tracking-[-0.05em]">{page.title}</p></div></div><div className="mt-3 flex items-center justify-between text-sm tracking-[-0.03em]"><span>{page.caption}</span><span>{page.number} / 04</span></div></article>

        <div className="lg:pl-3"><div className="flex -space-x-2" aria-label="Komunitas Aspiraku"><span className="grid size-9 place-items-center rounded-full border-2 border-white bg-[#e86f3c] text-xs font-bold text-white">A</span><span className="grid size-9 place-items-center rounded-full border-2 border-white bg-[#6da89b] text-xs font-bold text-white">K</span></div><p className="mt-4 max-w-[310px] text-base leading-snug tracking-[-0.045em]">{page.description}</p><a href={page.href} className="group mt-4 inline-flex items-center gap-1 border-b border-[#102c45] pb-0.5 text-sm font-semibold"><span>Jelajahi halaman</span><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a><div className="mt-8 flex gap-2" aria-label="Pilih halaman inti">{pages.map((item, index) => <button key={item.number} type="button" onClick={() => setActivePage(index)} aria-label={`Buka ${item.title}`} aria-current={index === activePage} className={`h-1.5 rounded-full transition-all ${index === activePage ? "w-9 bg-[#e45b22]" : "w-4 bg-[#102c45]/20 hover:bg-[#102c45]/45"}`} />)}</div></div>
      </div>
    </section>
  );
}
