import ScrollStack, { ScrollStackItem } from "../animations/ScrollStack";
import SplitText from "../animations/SplitText";
import ScrollReveal from "../animations/ScrollReveal";

const projects = [
  {
    n: "01",
    title: "Aether OS",
    tag: "Product · Interface",
    desc: "A monochrome operating shell with buttery 120fps transitions and a physics-driven dock.",
    img: "https://picsum.photos/seed/aether9/900/600?grayscale",
  },
  {
    n: "02",
    title: "Noir Editorial",
    tag: "Web · Motion",
    desc: "An award-winning editorial platform where typography breathes and scroll tells the story.",
    img: "https://picsum.photos/seed/noir42/900/600?grayscale",
  },
  {
    n: "03",
    title: "Vanta Commerce",
    tag: "E-commerce · 3D",
    desc: "Products float in a WebGL void. Every hover ripples, every add-to-cart feels physical.",
    img: "https://picsum.photos/seed/vanta17/900/600?grayscale",
  },
  {
    n: "04",
    title: "Obsidian Labs",
    tag: "Brand · Identity",
    desc: "A living identity system rendered entirely in grayscale, animated end to end.",
    img: "https://picsum.photos/seed/obsidian5/900/600?grayscale",
  },
];

//<---------- WorkStack -------------->
export default function WorkStack() {
  return (
    <section id="work" className="relative px-6 py-28">
      <div className="mx-auto mb-16 max-w-4xl text-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Selected work
          </span>
        </ScrollReveal>
        <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-6xl">
          <SplitText text="Projects that move" />
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
                      View case study
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
                  data-cursor-label="View"
                  className={`group/img relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 ${
                    flipped ? "md:order-1" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover/img:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </section>
  );
}
