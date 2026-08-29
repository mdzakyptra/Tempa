import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import ScrollReveal from "../animations/ScrollReveal";
import SplitText from "../animations/SplitText";

/**
 * Gallery — a pinned horizontal-scroll strip. The section is tall; while
 * it's pinned, vertical scroll translates the track sideways. A giant
 * outlined title drifts behind at a slower rate, and each image pans
 * against the travel direction for parallax depth.
 */

const shots = [
  { seed: "mono-a", w: "wide", label: "Kinetic type" },
  { seed: "mono-b", w: "tall", label: "Grain study" },
  { seed: "mono-c", w: "wide", label: "Editorial grid" },
  { seed: "mono-d", w: "tall", label: "3D void" },
  { seed: "mono-e", w: "wide", label: "Contrast" },
  { seed: "mono-f", w: "tall", label: "Long form" },
];

function Shot({
  seed,
  label,
  wide,
  index,
  progress,
}: {
  seed: string;
  label: string;
  wide: boolean;
  index: number;
  progress: MotionValue<number>;
}) {
  // pan each image against the travel direction for depth
  const imgX = useTransform(progress, [0, 1], ["6%", "-6%"]);

  return (
    <div
      data-cursor-label="View"
      className={`group relative shrink-0 overflow-hidden rounded-2xl border border-black/10 ${
        wide
          ? "h-[52vh] w-[80vw] md:w-[44vw]"
          : "h-[62vh] w-[62vw] md:w-[26vw]"
      }`}
    >
      <motion.div style={{ x: imgX }} className="h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${seed}/900/1100?grayscale`}
          alt={label}
          loading="lazy"
          className="h-full w-full scale-[1.15] object-cover grayscale transition-transform duration-700 group-hover:scale-[1.25]"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <span className="text-sm font-semibold tracking-tight">{label}</span>
        <span className="font-mono text-xs text-neutral-600">
          0{index + 1} / 0{shots.length}
        </span>
      </div>
    </div>
  );
}

//<---------- Gallery -------------->
export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["8%", "-45%"]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="gallery" ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* giant outlined title drifting slower than the track */}
        <motion.span
          style={{ x: ghostX }}
          aria-hidden
          className="text-stroke pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] font-black leading-none tracking-tighter opacity-10"
        >
          FRAMES FROM THE VOID
        </motion.span>

        <div className="mb-10 px-6 md:px-[8vw]">
          <ScrollReveal>
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Visual language
            </span>
          </ScrollReveal>
          <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-6xl">
            <SplitText text="Frames from the void" />
          </h2>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center gap-6 pl-6 pr-[10vw] md:gap-8 md:pl-[8vw]"
        >
          {shots.map((s, i) => (
            <Shot
              key={s.seed}
              seed={s.seed}
              label={s.label}
              wide={s.w === "wide"}
              index={i}
              progress={scrollYProgress}
            />
          ))}

          {/* end card */}
          <a
            href="#contact"
            className="group flex h-[52vh] w-[70vw] shrink-0 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/20 transition-colors hover:border-black/50 md:w-[24vw]"
          >
            <span className="text-3xl font-black tracking-tighter">
              Your project
            </span>
            <span className="text-sm text-neutral-600 transition-transform duration-500 group-hover:translate-x-2">
              could live here →
            </span>
          </a>
        </motion.div>

        {/* travel progress */}
        <div className="mt-10 flex items-center gap-4 px-6 md:px-[8vw]">
          <div className="relative h-px w-44 bg-black/15">
            <motion.div
              style={{ scaleX: barScale }}
              className="absolute inset-0 origin-left bg-black"
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Scroll to travel
          </span>
        </div>
      </div>
    </section>
  );
}
