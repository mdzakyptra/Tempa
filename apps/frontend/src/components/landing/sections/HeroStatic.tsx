import { motion } from "motion/react";
import { useRef } from "react";
import GlobeStoryScene from "../backgrounds/globe-story/Scene";
import { BEATS } from "../backgrounds/globe-story/beats";
import SplitText from "../animations/SplitText";
import FlipWords from "../animations/FlipWords";
import TextScramble from "../animations/TextScramble";
import MagneticButton from "../animations/MagneticButton";


//<---------- HeroStatic -------------->
export default function HeroStatic() {
  const progressRef = useRef(0);

  return (
    <section id="top" className="relative">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <GlobeStoryScene progressRef={progressRef} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-white to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-neutral-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" />
            <TextScramble text="Transparansi aspirasi kota" />
          </span>

          <h1 className="max-w-md text-4xl font-black leading-[1] tracking-tighter">
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
          </h1>

          <p className="mt-6 max-w-sm text-balance text-base text-neutral-600">
            Warga melapor, lihat skor prioritas laporannya, dukung laporan
            orang lain, dan tanya langsung ke AI kenapa satu laporan
            didahulukan dari yang lain.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="/lapor-baru"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
            >
              Lapor Kerusakan →
            </MagneticButton>
            <MagneticButton
              href="#work"
              className="rounded-full border border-black/25 px-6 py-3 text-sm font-semibold text-black"
            >
              Lihat Skor
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-5 bg-white px-6 pb-16 pt-4">
        {BEATS.map((beat, i) => (
          <motion.div
            key={beat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur-md"
          >
            <span className="mb-3 inline-block font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              {beat.eyebrow}
            </span>
            <h2 className="mb-2 text-2xl font-black leading-tight tracking-tighter">
              {beat.title}
            </h2>
            <p className="text-balance text-sm text-neutral-600">{beat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
