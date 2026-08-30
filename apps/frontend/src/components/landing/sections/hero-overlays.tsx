import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useState } from "react";
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

//<---------- ScoreBar -------------->
function ScoreBar({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const item = SCORE_WEIGHTS[index];
  const local = useTransform(progress, (v) => beatLocalProgress(v, 1));
  const start = index * 0.18;
  const fill = useTransform(local, [start, start + 0.35], [0, item.weight]);
  const width = useTransform(fill, (v) => `${(v / 35) * 100}%`);

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-wider text-neutral-500">
        {item.label}
      </span>
      <div className="h-1.5 flex-1 rounded-full bg-black/10">
        <motion.div style={{ width }} className="h-full rounded-full bg-black" />
      </div>
      <motion.span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums text-neutral-500">
        {item.weight}%
      </motion.span>
    </div>
  );
}

//<---------- ScoreCard -------------->
export function ScoreCard({ progress }: { progress: MotionValue<number> }) {
  const [start, end] = beatRange(1);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-10 right-6 z-10 hidden w-72 rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-md sm:block md:right-12"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        Rincian skor terbuka
      </p>
      <div className="flex flex-col gap-3">
        {SCORE_WEIGHTS.map((_, i) => (
          <ScoreBar key={i} progress={progress} index={i} />
        ))}
      </div>
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
