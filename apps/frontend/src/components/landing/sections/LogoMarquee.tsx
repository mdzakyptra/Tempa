import Marquee from "../animations/Marquee";
import ScrollVelocity from "../animations/ScrollVelocity";

const brands = [
  "AETHER",
  "NOIR",
  "VANTA",
  "OBSIDIAN",
  "GRAPHITE",
  "ECLIPSE",
  "MONO",
  "CARBON",
];

//<---------- LogoMarquee -------------->
export default function LogoMarquee() {
  return (
    <section className="relative border-y border-black/10 py-14">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
        Trusted by studios everywhere
      </p>

      <Marquee speed={30} className="mb-10">
        {brands.map((b) => (
          <span
            key={b}
            className="mx-10 text-2xl font-black tracking-tighter text-neutral-500 transition-colors hover:text-black md:text-3xl"
          >
            {b}
          </span>
        ))}
      </Marquee>

      <div className="text-5xl font-black uppercase tracking-tighter text-neutral-200 md:text-7xl">
        <ScrollVelocity
          text="MOTION · CONTRAST · MONOCHROME · DESIGN · "
          baseVelocity={3}
        />
      </div>
    </section>
  );
}
