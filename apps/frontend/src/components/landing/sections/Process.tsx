import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import SpotlightCard from "../animations/SpotlightCard";
import ScrollReveal from "../animations/ScrollReveal";
import SplitText from "../animations/SplitText";

/**
 * Process — a vertical timeline. A center line draws itself as you scroll,
 * step cards slide in from alternating sides, and a giant ghost number
 * sits behind each card.
 */

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "We strip the problem down to pure black and white — no noise, only signal.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Every frame is choreographed. Contrast, rhythm, and negative space do the talking.",
  },
  {
    n: "03",
    title: "Animate",
    desc: "Motion is the medium. WebGL, springs, and scroll turn static into alive.",
  },
  {
    n: "04",
    title: "Ship",
    desc: "Pixel-perfect, 60fps, accessible. Then we obsess over the details again.",
  },
];

//<---------- Process -------------->
export default function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
  });

  return (
    <section id="process" className="relative px-6 py-28">
      <div className="mx-auto mb-20 max-w-4xl text-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            How we work
          </span>
        </ScrollReveal>
        <h2 className="mt-4 text-4xl font-black tracking-tighter sm:text-6xl">
          <SplitText text="A four step ritual" />
        </h2>
      </div>

      <div ref={trackRef} className="relative mx-auto max-w-5xl">
        {/* rail + self-drawing line */}
        <div className="absolute bottom-0 left-4 top-0 w-px bg-black/10 md:left-1/2" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute bottom-0 left-4 top-0 w-px origin-top bg-black md:left-1/2"
        />

        <div className="flex flex-col gap-20 md:gap-28">
          {steps.map((s, i) => {
            const fromLeft = i % 2 === 0;
            return (
              <div
                key={s.n}
                className="relative grid items-center gap-6 pl-12 md:grid-cols-2 md:gap-0 md:pl-0"
              >
                {/* node on the line */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false, margin: "-25%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black md:left-1/2"
                />

                {/* ghost number on the empty side */}
                <div
                  className={`pointer-events-none hidden select-none items-center justify-center md:flex ${
                    fromLeft ? "md:order-2" : "md:order-1"
                  }`}
                  aria-hidden
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "-20%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-stroke text-[9rem] font-black leading-none opacity-40"
                  >
                    {s.n}
                  </motion.span>
                </div>

                {/* card */}
                <div
                  className={
                    fromLeft
                      ? "md:order-1 md:pr-14"
                      : "md:order-2 md:pl-14"
                  }
                >
                  <ScrollReveal direction={fromLeft ? "right" : "left"}>
                    <SpotlightCard className="p-8">
                      <span className="font-mono text-sm text-neutral-500">
                        {s.n} / 04
                      </span>
                      <h3 className="mt-4 text-2xl font-bold tracking-tight">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                        {s.desc}
                      </p>
                    </SpotlightCard>
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
