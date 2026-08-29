import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from "motion/react";

/**
 * ScrollVelocity — a text strip that scrolls on its own and skews / speeds up
 * based on scroll velocity. React Bits "ScrollVelocity" style.
 */

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

interface ScrollVelocityProps {
  text: string;
  baseVelocity?: number;
  className?: string;
}

//<---------- ScrollVelocity -------------->
export default function ScrollVelocity({
  text,
  baseVelocity = 4,
  className = "",
}: ScrollVelocityProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-75, -25, v)}%`);
  const skew = useTransform(velocityFactor, [-5, 5], [-6, 6], { clamp: true });
  const smoothSkew = useSpring(skew, { damping: 30, stiffness: 200 });

  const directionFactor = useRef(1);
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div
      className={`flex flex-nowrap overflow-hidden whitespace-nowrap ${className}`}
      style={{ skewX: smoothSkew }}
    >
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="block pr-8">
            {text}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
