import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type MutableRefObject } from "react";


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
          </div>
        ))}
      </div>
    </motion.div>
  );
}

//<---------- ScoreItem ------------>
function ScoreItem({
  label,
  weight,
  progress,
  compact = false,
}: {
  label: string;
  weight: number;
  progress: MotionValue<number>;
  compact?: boolean;
}) {
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
      <p className={compact ? "mt-1 text-3xl font-black tracking-tighter" : "mt-1 text-5xl font-black tracking-tighter md:text-6xl"}>
        <motion.span>{rounded}</motion.span>%
      </p>
    </div>
  );
}

//<---------- ScoreCardMobile ------------>
export function ScoreCardMobile({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-5 text-left">
      {SCORE_WEIGHTS.map((item) => (
        <ScoreItem key={item.label} label={item.label} weight={item.weight} progress={progress} compact />
      ))}
    </div>
  );
}

//<---------- ScoreConnectionLine ------------>
function ScoreConnectionLine({
  markerX,
  markerY,
  target,
  index,
}: {
  markerX: MotionValue<number>;
  markerY: MotionValue<number>;
  target: { x: number; y: number };
  index: number;
}) {
  const path = useTransform([markerX, markerY], ([x, y]: number[]) => {
    const markerScreenX = (x / 100) * window.innerWidth;
    const markerScreenY = (y / 100) * window.innerHeight;
    const spread = index - 1.5;
    const startX = markerScreenX + 7;
    const startY = markerScreenY + spread * 6;
    const arrivalX = target.x - 96;
    const controlOneX = startX + (arrivalX - startX) * 0.28;
    const controlOneY = startY + spread * 58;
    const controlTwoX = arrivalX - 56;
    const controlTwoY = target.y - spread * 18;
    return `M ${startX} ${startY} C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${arrivalX} ${target.y} H ${target.x}`;
  });

  return (
    <motion.path
      d={path}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: "easeOut" }}
      fill="none"
      stroke="rgba(23, 23, 23, 0.45)"
      strokeDasharray={index % 2 === 0 ? "3 5" : "1 4"}
      strokeWidth="1"
    />
  );
}

//<---------- ScoreConnectionLines ------------>
function ScoreConnectionLines({
  progress,
  markerX,
  markerY,
  scoreRefs,
}: {
  progress: MotionValue<number>;
  markerX: MotionValue<number>;
  markerY: MotionValue<number>;
  scoreRefs: MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  const [targets, setTargets] = useState<{ x: number; y: number }[]>([]);
  const [start, end] = beatRange(1);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  useEffect(() => {
    const updateTargets = () => {
      setTargets(scoreRefs.current.flatMap((score) => {
        if (!score) return [];
        const rect = score.getBoundingClientRect();
        return [{ x: rect.left - 18, y: rect.top + rect.height / 2 }];
      }));
    };

    updateTargets();
    const observer = new ResizeObserver(updateTargets);
    scoreRefs.current.forEach((score) => score && observer.observe(score));
    window.addEventListener("resize", updateTargets);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTargets);
    };
  }, [scoreRefs]);

  return (
    <motion.svg
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-[9] h-full w-full overflow-visible"
      aria-hidden
    >
      {targets.map((target, index) => (
        <ScoreConnectionLine
          key={index}
          markerX={markerX}
          markerY={markerY}
          target={target}
          index={index}
        />
      ))}
    </motion.svg>
  );
}

//<---------- ScoreCard ------------>
export function ScoreCard({
  progress,
  markerX,
  markerY,
}: {
  progress: MotionValue<number>;
  markerX: MotionValue<number>;
  markerY: MotionValue<number>;
}) {
  const [start, end] = beatRange(1);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const scoreRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <>
      <ScoreConnectionLines progress={progress} markerX={markerX} markerY={markerY} scoreRefs={scoreRefs} />
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute right-6 top-[42%] z-10 hidden -translate-y-1/2 flex-col gap-8 sm:flex md:right-14 lg:right-20"
      >
        {SCORE_WEIGHTS.map((item, index) => (
          <div
            key={item.label}
            ref={(element) => { scoreRefs.current[index] = element; }}
            className={index === 0 ? "-translate-x-8" : index === 1 || index === 3 ? "-translate-x-4" : ""}
          >
            <ScoreItem label={item.label} weight={item.weight} progress={progress} />
          </div>
        ))}
      </motion.div>
    </>
  );
}

//<---------- VoteConnectionLine ------------>
function VoteConnectionLine({
  markerX,
  markerY,
}: {
  markerX: MotionValue<number>;
  markerY: MotionValue<number>;
}) {
  const path = useTransform([markerX, markerY], ([x, y]: number[]) => {
    const startX = (x / 100) * window.innerWidth;
    const startY = (y / 100) * window.innerHeight;
    const endX = startX + 40;
    const endY = startY - 34;
    return `M ${startX} ${startY} C ${startX + 16} ${startY - 4}, ${endX - 14} ${endY + 8}, ${endX} ${endY}`;
  });

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="rgba(23, 23, 23, 0.45)"
      strokeWidth="1"
    />
  );
}

//<---------- VoteCounter ------------>
export function VoteCounter({
  progress,
  markerX,
  markerY,
}: {
  progress: MotionValue<number>;
  markerX: MotionValue<number>;
  markerY: MotionValue<number>;
}) {
  const [start, end] = beatRange(2);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
  const local = useTransform(progress, (v) => beatLocalProgress(v, 2));
  const count = useTransform(local, [0, 0.8], [0, 42]);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const left = useTransform(markerX, (x) => `${x}%`);
  const top = useTransform(markerY, (y) => `${y}%`);

  return (
    <>
      <motion.svg
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 z-[9] h-full w-full overflow-visible"
        aria-hidden
      >
        <VoteConnectionLine markerX={markerX} markerY={markerY} />
      </motion.svg>
      <motion.div
        style={{ opacity, left, top, x: 40, y: -142 }}
        className="pointer-events-none absolute z-10 hidden w-72 rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur-md sm:block"
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          {MARKER.label}
        </p>
        <div className="flex items-baseline gap-2">
          <motion.span className="text-4xl font-black tracking-tighter">{rounded}</motion.span>
          <span className="text-sm text-neutral-500">warga mendukung</span>
        </div>
      </motion.div>
    </>
  );
}

//<---------- VoteCounterMobile ------------>
export function VoteCounterMobile({ progress }: { progress: MotionValue<number> }) {
  const local = useTransform(progress, (v) => beatLocalProgress(v, 2));
  const count = useTransform(local, [0, 0.8], [0, 42]);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  return (
    <div className="mt-6 w-full max-w-sm rounded-2xl border border-black/10 bg-white/80 p-5 text-left backdrop-blur-md">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
        {MARKER.label}
      </p>
      <div className="flex items-baseline gap-2">
        <motion.span className="text-4xl font-black tracking-tighter">{rounded}</motion.span>
        <span className="text-sm text-neutral-500">warga mendukung</span>
      </div>
    </div>
  );
}

