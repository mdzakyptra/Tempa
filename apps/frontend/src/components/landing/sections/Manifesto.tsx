import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * Manifesto — a pinned statement whose words light up one by one as you
 * scroll through the section. Key words flip to inverted (white chip)
 * the moment the highlight reaches them.
 */

const TEXT =
  "Motion is not decoration. It is the grammar of attention — every frame either earns focus or wastes it. So we strip away color until only rhythm remains, then choreograph black, white, and the silence between them.";

// words rendered as inverted chips once lit
const INVERTED = new Set(["grammar", "rhythm", "choreograph", "silence"]);

function Word({
  children,
  progress,
  range,
  inverted,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  inverted: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const lit = useTransform(progress, range, [0, 1]);
  const backgroundColor = useTransform(
    lit,
    (v) => `rgba(0,0,0,${inverted ? v : 0})`
  );
  const color = useTransform(lit, (v) =>
    inverted && v > 0.6 ? "#fff" : "#000"
  );

  return (
    <motion.span
      style={
        inverted
          ? { opacity, backgroundColor, color }
          : { opacity }
      }
      className={`inline-block ${
        inverted ? "rounded-lg px-2 md:rounded-xl md:px-3" : ""
      }`}
    >
      {children}
    </motion.span>
  );
}

//<---------- Manifesto -------------->
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const words = TEXT.split(" ");
  // words finish lighting up at 90% so the last ones are readable a while
  const per = 0.9 / words.length;

  const counter = useTransform(scrollYProgress, (v) =>
    String(Math.min(100, Math.round(v * 100))).padStart(3, "0")
  );

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-10 flex items-center justify-between font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">
            <span>Manifesto</span>
            <span className="tabular-nums">
              <motion.span>{counter}</motion.span> / 100
            </span>
          </div>

          <p className="text-3xl font-bold leading-snug tracking-tight md:text-5xl md:leading-snug">
            {words.map((w, i) => {
              const clean = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
              return (
                <span key={i}>
                  <Word
                    progress={scrollYProgress}
                    range={[i * per, i * per + per]}
                    inverted={INVERTED.has(clean)}
                  >
                    {w}
                  </Word>{" "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
