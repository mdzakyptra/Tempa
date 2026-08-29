import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import Threads from "../backgrounds/Threads";
import GridBackground from "../backgrounds/GridBackground";
import SplitText from "../animations/SplitText";
import FlipWords from "../animations/FlipWords";
import TextScramble from "../animations/TextScramble";
import MagneticButton from "../animations/MagneticButton";

/** decorative corner tick */
function Corner({ className }: { className: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className={`absolute z-10 select-none font-mono text-lg text-black/25 ${className}`}
      aria-hidden
    >
      +
    </motion.span>
  );
}

//<---------- Hero -------------->
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, -160]);

  // mouse parallax — layers drift at different depths
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const smy = useSpring(my, { stiffness: 50, damping: 20 });
  const watermarkX = useTransform(smx, (v) => v * -60);
  const watermarkPy = useTransform(smy, (v) => v * -40);
  const headX = useTransform(smx, (v) => v * 18);
  const headY = useTransform(smy, (v) => v * 12);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <GridBackground />
      <Threads count={22} amplitude={0.35} className="opacity-70" />

      {/* giant watermark drifting behind everything */}
      <motion.div
        style={{ x: watermarkX, y: watermarkPy }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <motion.span
          style={{ y: watermarkY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.6 }}
          className="text-stroke whitespace-nowrap text-[24vw] font-black leading-none tracking-tighter opacity-[0.07]"
        >
          ANTREAN
        </motion.span>
      </motion.div>

      {/* frame ticks */}
      <Corner className="left-6 top-24 md:left-10" />
      <Corner className="right-6 top-24 md:right-10" />
      <Corner className="bottom-8 left-6 md:left-10" />
      <Corner className="bottom-8 right-6 md:right-10" />

      {/* fade to black at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-neutral-700"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
          <TextScramble text="Transparansi antrean kota" />
        </motion.span>

        <motion.h1
          style={{ x: headX, y: headY }}
          className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tighter sm:text-7xl md:text-8xl"
        >
          <SplitText by="chars" text="Antrean perbaikan kota," />
          <br />
          <span className="text-stroke">
            <SplitText by="chars" text="kini" delay={0.35} />{" "}
          </span>
          <FlipWords
            words={["terlihat", "transparan", "adil", "real-time"]}
            className="italic"
            shiny
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-8 max-w-xl text-balance text-lg text-neutral-600"
        >
          Warga melapor, lihat skor prioritas laporannya, dukung laporan
          orang lain, dan tanya langsung ke AI kenapa satu laporan
          didahulukan dari yang lain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="/lapor-baru"
            className="rounded-full bg-black px-8 py-4 text-sm font-semibold text-white"
          >
            Lapor Kerusakan →
          </MagneticButton>
          <MagneticButton
            href="#skor"
            className="rounded-full border border-black/25 px-8 py-4 text-sm font-semibold text-black"
          >
            Lihat Skor
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-black/30 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-black"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
