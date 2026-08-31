import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { BEATS, MARKER, beatRange, beatLocalProgress } from "../backgrounds/globe-story/beats";

const SCORE_WEIGHTS = [
  { label: "Tingkat bahaya", weight: 35 },
  { label: "Warga terdampak", weight: 25 },
  { label: "Lama menunggu", weight: 20 },
  { label: "Jalur vital", weight: 20 },
];


//<---------- useActiveBeat -------------->
function useActiveBeat(progress: MotionValue<number>) {
  const [active, setActive] = useState(-1);
  useMotionValueEvent(progress, "change", (v) => {
    if (v < beatRange(0)[0]) return setActive((prev) => (prev === -1 ? prev : -1));
    const idx = BEATS.findIndex((_, i) => {
      const [start, end] = beatRange(i);
      return v >= start && v < end;
    });
    setActive(idx === -1 ? BEATS.length - 1 : idx);
  });
  return active;
}

//<---------- StepRail -------------->
export function StepRail({ progress }: { progress: MotionValue<number> }) {
  const active = useActiveBeat(progress);
  const railOpacity = useTransform(progress, [0, 0.12, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity: railOpacity }}
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex xl:right-10"
    >
      <div className="flex flex-col gap-4">
        {BEATS.map((beat, i) => (
          <div key={beat.id} className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                i === active ? "scale-150 bg-black" : "bg-black/25"
              }`}
            />
            <span
              className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                i === active ? "text-black" : "text-black/25"
              }`}
            >
              0{i + 1}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

//<---------- ScoreCard -------------->
function ScoreItem({ label, weight, progress }: { label: string; weight: number; progress: MotionValue<number> }) {
  const [start, end] = beatRange(1);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const hasAnimated = useRef(false);

  useMotionValueEvent(progress, "change", (v) => {
    if (v >= start && v < end) {
      if (!hasAnimated.current) {
        hasAnimated.current = true;
        animate(count, weight, { duration: 1, ease: "easeOut" });
      }
    } else if (v < start) {
      hasAnimated.current = false;
      count.set(0);
    }
  });

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">{label}</p>
      <p className="mt-1 text-5xl font-black tracking-tighter md:text-6xl">
        <motion.span>{rounded}</motion.span>%
      </p>
    </div>
  );
}

export function ScoreCard({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = beatRange(1);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-8 sm:flex md:right-14 lg:right-20"
    >
      {SCORE_WEIGHTS.map((item) => (
        <ScoreItem key={item.label} label={item.label} weight={item.weight} progress={progress} />
      ))}
    </motion.div>
  );
}

//<---------- VoteCounter -------------->
export function VoteCounter({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = beatRange(2);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const local = useTransform(progress, (v) => beatLocalProgress(v, 2));
  const count = useTransform(local, [0, 0.8], [0, 42]);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-10 right-6 z-10 hidden w-72 rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-md sm:block md:right-12"
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        {MARKER.label}
      </p>
      <div className="flex items-baseline gap-2">
        <motion.span className="text-4xl font-black tracking-tighter">{rounded}</motion.span>
        <span className="text-sm text-neutral-500">warga mendukung</span>
      </div>
    </motion.div>
  );
}

//<---------- ChatBubble -------------->
export function ChatBubble({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = beatRange(3);
  const opacity = useTransform(progress, [start, start + 0.06, end - 0.06, end], [0, 1, 1, 1]);
  const y = useTransform(progress, [start, start + 0.06], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute bottom-10 right-6 z-10 hidden w-80 rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-md sm:block md:right-12"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        Asisten antrean
      </p>
      <p className="mb-3 ml-auto w-fit rounded-full bg-black px-4 py-2 text-xs text-white">
        Kenapa laporan ini di posisi #3?
      </p>
      <p className="rounded-2xl bg-black/5 px-4 py-3 text-xs leading-relaxed text-neutral-700">
        Skor bahaya tinggi (35%) dan lokasinya di jalur sekolah (+20%) — total
        82/100, di atas laporan lain di kawasanmu.
      </p>
    </motion.div>
  );
}
