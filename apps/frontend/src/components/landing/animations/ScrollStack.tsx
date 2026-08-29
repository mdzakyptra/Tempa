import { useRef, useState, Children, isValidElement } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * ScrollStack — sticky cards dealt onto a pile as you scroll.
 * Each incoming card flies in from an alternating side with a tilt and
 * straightens as it pins. Covered cards fan out left/right like a messy
 * deck, their top edges peeking above the active card. A giant rolling
 * index sits on the left, a progress rail on the right.
 *
 * Usage:
 *   <ScrollStack>
 *     <ScrollStackItem>...</ScrollStackItem>
 *     <ScrollStackItem>...</ScrollStackItem>
 *   </ScrollStack>
 */

//<---------- ScrollStackItem -------------->
export function ScrollStackItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`h-full w-full rounded-3xl border border-white/15 bg-neutral-950 p-8 md:p-12 ${className}`}
    >
      {children}
    </div>
  );
}

function Card({
  child,
  index,
  total,
  progress,
}: {
  child: ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;
  // deal direction alternates per card
  const side = index % 2 === 0 ? 1 : -1;

  // deal-in: approach from an alternating side with a tilt, land straight
  const enterStart = start - 0.6 / total;
  const enterX = useTransform(progress, [enterStart, start], [side * 110, 0]);
  const enterRot = useTransform(progress, [enterStart, start], [side * 6, 0]);

  // covered: settle into the pile — shrink a touch, dim, fan out
  const scale = useTransform(progress, [start, end], [1, 0.94]);
  const y = useTransform(progress, [start, end], [0, -12]);
  const coverRot = useTransform(progress, [start, end], [0, side * -2.5]);
  const rotateX = useTransform(progress, [start, end], [0, 5]);
  const brightness = useTransform(progress, [start, end], [1, 0.45]);
  const filter = useTransform(brightness, (br) => `brightness(${br})`);

  const rotate = useTransform(
    [enterRot, coverRot],
    ([a, b]: number[]) => a + b
  );

  // ambient glow ring: peaks while this card is the active (topmost) one
  const glowPad = 1 / total / 2;
  const glow = useTransform(
    progress,
    [
      Math.max(0, start - glowPad),
      start,
      end - glowPad * 0.6,
      Math.min(1, end),
    ],
    [0, 1, 1, 0]
  );
  const boxShadow = useTransform(
    glow,
    (g) =>
      `0 -24px 60px -20px rgba(0,0,0,${0.9 * g}), 0 ${40 * g}px ${90 * g}px -30px rgba(255,255,255,${0.16 * g}), 0 0 0 1px rgba(255,255,255,${0.05 * g})`
  );

  return (
    <div
      className="sticky flex justify-center"
      style={{
        top: `calc(5.5rem + ${index * 2.2}rem)`,
        zIndex: index + 1,
        perspective: 1400,
      }}
    >
      <motion.div
        style={{
          x: isLast ? 0 : enterX,
          rotate: isLast ? 0 : rotate,
          scale: isLast ? 1 : scale,
          y: isLast ? 0 : y,
          rotateX: isLast ? 0 : rotateX,
          filter: isLast ? "none" : filter,
          boxShadow,
          transformOrigin: "center top",
          transformStyle: "preserve-3d",
        }}
        className="w-full max-w-4xl rounded-3xl"
      >
        {child}
      </motion.div>
    </div>
  );
}

/** fades in/out with the section, like the rail */
function useSectionOpacity(progress: MotionValue<number>) {
  return useTransform(progress, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);
}

function useActiveIndex(progress: MotionValue<number>, total: number) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    setActive(idx);
  });
  return active;
}

function BigIndex({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const opacity = useSectionOpacity(progress);
  const active = useActiveIndex(progress, total);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block 2xl:left-14"
      aria-hidden
    >
      <div className="flex items-end overflow-hidden font-black leading-none tracking-tighter">
        <span className="text-stroke text-[9rem] opacity-40">0</span>
        <span className="relative inline-grid h-[9rem] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={active}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-stroke col-start-1 row-start-1 text-[9rem] opacity-40"
            >
              {active + 1}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </motion.div>
  );
}

function ProgressRail({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const railOpacity = useSectionOpacity(progress);
  const fillScale = useTransform(progress, [0, 1], [0, 1]);
  const active = useActiveIndex(progress, total);

  return (
    <motion.div
      style={{ opacity: railOpacity }}
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex xl:right-10"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-40 w-px bg-white/10">
          <motion.div
            style={{ scaleY: fillScale }}
            className="absolute left-0 top-0 w-px origin-top bg-white"
          />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "scale-150 bg-white" : "bg-white/25"
                }`}
              />
              <span
                className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                  i === active ? "text-white" : "text-white/25"
                }`}
              >
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

//<---------- ScrollStack -------------->
export default function ScrollStack({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const items = Children.toArray(children).filter(isValidElement);
  const total = items.length;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <BigIndex progress={scrollYProgress} total={total} />
      <ProgressRail progress={scrollYProgress} total={total} />
      <div className="flex flex-col gap-[45vh] pb-[30vh]">
        {items.map((child, i) => (
          <Card
            key={i}
            child={child}
            index={i}
            total={total}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
