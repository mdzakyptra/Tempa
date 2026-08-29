import Marquee from "../animations/Marquee";
import RollingText from "../animations/RollingText";

//<---------- Footer -------------->
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/10">
      <Marquee speed={22} className="py-10">
        <span className="mx-6 text-6xl font-black uppercase tracking-tighter text-neutral-200 md:text-8xl">
          Let&apos;s talk —
        </span>
        <span className="mx-6 text-6xl font-black uppercase tracking-tighter text-black md:text-8xl">
          hello@monolith.studio —
        </span>
      </Marquee>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-neutral-500 md:flex-row">
        <span className="font-black tracking-tighter text-black">
          MONO<span className="text-neutral-400">/</span>LITH
        </span>
        <div className="flex gap-6">
          {["Twitter", "Instagram", "Dribbble", "GitHub"].map((s) => (
            <a
              key={s}
              href="#"
              className="group transition-colors hover:text-black"
            >
              <RollingText text={s} />
            </a>
          ))}
        </div>
        <span>© {new Date().getFullYear()} Built in monochrome.</span>
      </div>
    </footer>
  );
}
