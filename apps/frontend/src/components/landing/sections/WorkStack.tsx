import ScrollStack, { ScrollStackItem } from "../animations/ScrollStack";
import SplitText from "../animations/SplitText";
import ScrollReveal from "../animations/ScrollReveal";

const projects = [
  {
    n: "01",
    title: "Beranda / Antrean",
    tag: "Halaman · Antrean",
    desc: "Daftar laporan terurut skor, filter kawasan dan jenis kerusakan, data langsung dari basis data.",
  },
  {
    n: "02",
    title: "Detail Laporan",
    tag: "Halaman · Transparansi",
    desc: "Rincian skor terbuka, tombol dukung, riwayat status, dan foto laporan.",
  },
  {
    n: "03",
    title: "Lapor Baru",
    tag: "Halaman · Pelaporan",
    desc: "Formulir laporan, unggah foto, deteksi laporan serupa berbasis AI, posisi antrean setelah tersimpan.",
  },
  {
    n: "04",
    title: "Metodologi",
    tag: "Halaman · Metodologi",
    desc: "Rumus skor, bobot tiap komponen, dan batasan sistem dijelaskan terbuka.",
  },
];

//<---------- WorkStack -------------->
export default function WorkStack() {
  return (
    <section
      id="work"
      className="relative z-10 bg-white px-6 py-28 md:-mt-[105vh]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[35vh] hidden h-[35vh] bg-gradient-to-b from-transparent to-white md:block"
      />

      <div className="relative mx-auto mb-16 max-w-4xl text-center md:rounded-3xl md:border md:border-black/10 md:bg-white/85 md:p-8 md:backdrop-blur-md">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Yang bisa kamu lakukan
          </span>
        </ScrollReveal>
        <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-6xl">
          <SplitText text="Empat halaman inti" />
        </h2>
      </div>

      <ScrollStack className="mx-auto max-w-4xl">
        {projects.map((p, i) => {
          const flipped = i % 2 === 1;
          return (
            <ScrollStackItem key={p.n} className="relative overflow-hidden">
              {/* giant ghost index behind the content */}
              <span
                aria-hidden
                className={`text-stroke pointer-events-none absolute -top-8 select-none text-[11rem] font-black leading-none tracking-tighter opacity-15 ${
                  flipped ? "-left-4" : "-right-4"
                }`}
              >
                {p.n}
              </span>

              <div className="relative grid items-center gap-8 md:grid-cols-2">
                <div className={flipped ? "md:order-2" : ""}>
                  <span className="font-mono text-sm text-neutral-500">
                    {p.n} — {p.tag}
                  </span>
                  <h3 className="mt-3 text-3xl font-black tracking-tighter md:text-5xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-neutral-600">{p.desc}</p>
                  <div className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black">
                    <span className="relative">
                      Lihat halaman
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
                    </span>
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </div>
                </div>
                <div
                  className={`group/img relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-neutral-50 ${
                    flipped ? "md:order-1" : ""
                  }`}
                >
                  <span className="text-stroke text-6xl font-black tracking-tighter opacity-40 transition-transform duration-700 group-hover/img:scale-105 md:text-7xl">
                    {p.n}
                  </span>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </section>
  );
}
