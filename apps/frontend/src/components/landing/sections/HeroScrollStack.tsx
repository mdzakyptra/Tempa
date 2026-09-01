import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeroMapTexture from "../backgrounds/HeroMapTexture";
import { BEATS, beatRange } from "../backgrounds/globe-story/beats";
import { StepRail, ScoreCard, ScoreCardMobile, VoteCounter, VoteCounterMobile } from "./hero-overlays";
import SplitText from "../animations/SplitText";
import FlipWords from "../animations/FlipWords";
import MagneticButton from "../animations/MagneticButton";

// react-three-fiber + three (~230KB gzip) gak boleh ikut blokir first paint
// landing page — splash LoadingScreen udah nutup ~2.6 detik duluan, cukup
// buat chunk ini kefetch di background sebelum keliatan.
const GlobeStoryScene = lazy(() => import("../backgrounds/globe-story/Scene"));


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

//<---------- BeatPanel -------------->
function BeatPanel({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const [start, end] = beatRange(index);
  const fadeIn = start + (end - start) * 0.18;
  const fadeOut = end - (end - start) * 0.18;
  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, fadeIn, fadeOut, end], ["100vh", "0vh", "0vh", "-100vh"]);
  const beat = BEATS[index];
  const withCard = index >= 2;

  const title = (
    <h2 className="text-3xl font-black leading-[1.05] tracking-tighter sm:text-4xl md:text-5xl">
      {beat.title}
    </h2>
  );
  const description = (
    <p className="max-w-sm text-balance text-neutral-600">{beat.desc}</p>
  );
  const desktopContent = (
    <>
      <div className="mb-4">{title}</div>
      {description}
    </>
  );

  return (
    <>
      <motion.div
        style={{ opacity, y }}
        className="pointer-events-none absolute inset-x-6 top-20 z-10 text-center md:hidden"
      >
        {title}
      </motion.div>
      <motion.div
        style={{ opacity, y }}
        className="pointer-events-none absolute inset-x-6 bottom-20 z-10 flex flex-col items-center text-center md:hidden"
      >
        {description}
        {index === 1 && <ScoreCardMobile progress={progress} />}
        {index === 2 && <VoteCounterMobile progress={progress} />}
      </motion.div>
      <motion.div
        style={{ opacity, y }}
        className="pointer-events-none absolute left-6 top-1/2 z-10 hidden max-w-md -translate-y-1/2 md:block md:left-16"
      >
        {withCard ? (
          <div className="rounded-2xl border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur-md">
            {desktopContent}
          </div>
        ) : (
          desktopContent
        )}
      </motion.div>
    </>
  );
}

//<---------- HeroScrollStack -------------->
export default function HeroScrollStack() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const progressRef = useRef(0);
  const markerX = useMotionValue(50);
  const markerY = useMotionValue(50);
  const [introVisible, setIntroVisible] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setIntroVisible(v < 0.08);
  });

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const introScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.9]);
  // globe drifts in from the left on desktop to clear space for the
  // right-aligned intro text; on mobile the text sits above/below the
  // globe instead, so it stays centered from the start.
  const globeX = useTransform(scrollYProgress, [0, 0.08], isDesktop ? ["-24%", "0%"] : ["0%", "0%"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.93, 1], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.93, 1], [16, 0]);

  // mouse parallax on the intro headline
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const smy = useSpring(my, { stiffness: 50, damping: 20 });
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
    <section id="top" ref={ref} className="relative" style={{ height: "500vh" }}>
      <div
        onMouseMove={onMove}
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6"
      >
        <HeroMapTexture />
        <motion.div style={{ x: globeX }} className="absolute inset-0">
          <Suspense fallback={null}>
            <GlobeStoryScene
              progressRef={progressRef}
              screenAnchor={{ x: markerX, y: markerY }}
              compact={!isDesktop}
            />
          </Suspense>
        </motion.div>

        <Corner className="left-6 top-24 md:left-10" />
        <Corner className="right-6 top-24 md:right-10" />
        <Corner className="bottom-8 left-6 md:left-10" />
        <Corner className="bottom-8 right-6 md:right-10" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

        {introVisible && (
          <motion.div
            style={{ opacity: introOpacity, scale: introScale }}
            className="pointer-events-none absolute inset-x-0 inset-y-0 z-10 flex origin-top flex-col items-center justify-between px-6 pb-20 pt-16 text-center md:inset-x-auto md:inset-y-0 md:right-6 md:top-0 md:w-full md:max-w-2xl md:origin-right md:items-end md:justify-center md:px-0 md:py-0 md:text-right lg:right-16 lg:max-w-3xl"
          >
            

            <motion.h1
              style={{ x: headX, y: headY }}
              className="max-w-xs text-4xl font-black leading-[0.95] tracking-tighter sm:max-w-xl sm:text-5xl md:max-w-2xl md:text-4xl lg:max-w-3xl lg:text-5xl xl:text-6xl"
            >
              <span className="block md:whitespace-nowrap">
                <SplitText by="chars" text="Antrean perbaikan kota," />
              </span>
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
              className="mt-8 max-w-xl text-balance text-lg text-neutral-600 md:max-w-md"
            >
              Warga melapor, lihat skor prioritas laporannya, dukung laporan
              orang lain, dan tanya langsung ke AI kenapa satu laporan
              didahulukan dari yang lain.
            </motion.p>
          </motion.div>
        )}

        {BEATS.map((_, i) => (
          <BeatPanel key={i} progress={scrollYProgress} index={i} />
        ))}

        <ScoreCard progress={scrollYProgress} markerX={markerX} markerY={markerY} />
        <VoteCounter progress={scrollYProgress} markerX={markerX} markerY={markerY} />
        <StepRail progress={scrollYProgress} />

        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="/lapor-baru"
              className="rounded-full bg-black px-8 py-4 text-sm font-semibold text-white"
            >
              Lapor Kerusakan →
            </MagneticButton>
            <MagneticButton
              href="#work"
              className="rounded-full border border-black/25 px-8 py-4 text-sm font-semibold text-black"
            >
              Lihat Skor
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: hintOpacity }}
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
      </div>
    </section>
  );
}
