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
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import HeroMapTexture from "../backgrounds/HeroMapTexture";
import { BEATS, beatRange } from "../backgrounds/globe-story/beats";
import { StepRail, ScoreCard, ScoreCardMobile, VoteCounter, VoteCounterMobile } from "./hero-overlays";
import SplitText from "../animations/SplitText";

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
  const [whiteTransitionLocked, setWhiteTransitionLocked] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setIntroVisible(v < 0.08);
    setWhiteTransitionLocked((current) => {
      const next = v >= 0.8;
      return current === next ? current : next;
    });
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
  // Globe starts centered over the ASPIRAKU wordmark, then remains centered
  // when the scroll narrative begins.
  const globeX = useTransform(scrollYProgress, [0, 0.08], ["0%", "0%"]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

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
    <section id="hero-stack" ref={ref} className="relative" style={{ height: "500vh" }}>
      <div
        onMouseMove={onMove}
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6"
      >
        <HeroMapTexture />
        <motion.div style={{ x: globeX }} className="absolute inset-0 z-10">
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
          <motion.p
            style={{ opacity: introOpacity, scale: introScale }}
            className="pointer-events-none absolute inset-x-0 top-20 z-0 select-none overflow-hidden text-center text-[17vw] font-black leading-none tracking-[-0.11em] text-black/[0.16] sm:top-7 sm:text-[15vw]"
            aria-hidden
          >
            ASPIRAKU
          </motion.p>
        )}

        {introVisible && (
          <motion.div
            style={{ opacity: introOpacity, scale: introScale }}
            className="absolute inset-0 z-20 mx-auto flex w-full max-w-7xl origin-bottom flex-col justify-between px-4 pb-7 sm:px-1 sm:pb-9 lg:px-1"
          >
            <div className="absolute inset-x-4 top-[23vh] flex items-start justify-between gap-6 sm:inset-x-1 sm:top-[30vh]">
              <p className="max-w-48 text-xs font-medium leading-relaxed text-black/65 sm:max-w-60 sm:text-sm">
                Ruang bersama untuk memantau dan mendorong perbaikan kota.
              </p>
              <p className="hidden max-w-52 text-right text-xs leading-relaxed text-black/55 sm:block">
                LAPORAN WARGA<br />TERHUBUNG SECARA TERBUKA
              </p>
            </div>

            <div className="relative mt-auto pt-0 sm:pt-[42vh]">
              <div className="max-w-sm">
                <p className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-[#177a78]">ASPIRASI UNTUK KOTA</p>
                <motion.h1
                  style={{ x: headX, y: headY }}
                  className="max-w-xs text-balance text-2xl font-bold leading-[0.96] tracking-[-0.06em] sm:max-w-sm sm:text-5xl"
                >
                  <SplitText by="chars" text="Suara warga, arah perubahan kota." />
                </motion.h1>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 sm:mt-9 sm:gap-6">
                <div className="flex gap-6 text-xs text-black/60 sm:gap-12">
                  <p><span className="block text-2xl font-bold leading-none text-black sm:text-4xl">20K+</span><span className="mt-2 block">aspirasi masuk</span></p>
                  <p><span className="block text-2xl font-bold leading-none text-black sm:text-4xl">34</span><span className="mt-2 block">kecamatan aktif</span></p>
                  <p className="hidden sm:block"><span className="block text-4xl font-bold leading-none text-black">24/7</span><span className="mt-2 block">terpantau</span></p>
                </div>
                <a href="/lapor-baru" className="group hidden items-center gap-2 font-semibold text-black transition-colors hover:text-[#177a78] sm:flex">
                  Buat laporan <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="mt-4 flex items-center gap-3 sm:mt-7 sm:gap-4">
                <a
                  href="#work"
                  className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#177a78]"
                >
                  Jelajahi
                  <ArrowDownRight className="size-4 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <p className="max-w-md text-xs leading-relaxed text-black/65 sm:text-sm">
                  Pantau laporan, dukung aspirasi warga lain, dan lihat proses perbaikannya secara terbuka.
                </p>
              </div>

              <a
                href="#work"
                className="group absolute bottom-0 right-0 hidden w-56 overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-2 shadow-lg backdrop-blur-md lg:block"
              >
                <img src="/city-report-inspection.png" alt="" className="h-24 w-full rounded-xl object-cover" />
                <span className="flex items-center justify-between px-1 pt-2 text-xs font-semibold text-black">
                  Aspirasi warga <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </div>
          </motion.div>
        )}

        {BEATS.map((_, i) => (
          <BeatPanel key={i} progress={scrollYProgress} index={i} />
        ))}

        <ScoreCard progress={scrollYProgress} markerX={markerX} markerY={markerY} />
        <VoteCounter progress={scrollYProgress} markerX={markerX} markerY={markerY} />
        <StepRail progress={scrollYProgress} />

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-black/30 p-1.5">
            <motion.span
              className="h-2 w-1 rounded-full bg-black"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div animate={{ opacity: whiteTransitionLocked ? 1 : 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="pointer-events-none absolute inset-0 z-[100] bg-white" />
      </div>
    </section>
  );
}
