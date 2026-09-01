import Marquee from "../animations/Marquee";
import RollingText from "../animations/RollingText";

//<---------- Footer -------------->
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/10">
      <Marquee speed={22} className="py-5 sm:py-10">
        <span className="mx-3 text-3xl font-black uppercase tracking-tighter text-neutral-200 sm:mx-6 sm:text-6xl md:text-8xl">
          Aspiraku —
        </span>
        <span className="mx-3 text-3xl font-black uppercase tracking-tighter text-black sm:mx-6 sm:text-6xl md:text-8xl">
          transparansi aspirasi kota —
        </span>
      </Marquee>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-neutral-500 md:flex-row">
        <span className="font-black tracking-tighter text-black">
          Aspiraku
        </span>
        <div className="flex gap-6">
          <a
            href="https://github.com/mdzakyptra/Tempa"
            target="_blank"
            rel="noreferrer"
            className="group transition-colors hover:text-black"
          >
            <RollingText text="GitHub" />
          </a>
        </div>
        <span>© {new Date().getFullYear()} Aspiraku.</span>
      </div>
    </footer>
  );
}
