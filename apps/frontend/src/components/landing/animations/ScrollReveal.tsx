import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * ScrollReveal — generic fade / blur / slide-in wrapper triggered on scroll.
 * Wrap any block to animate it into view.
 */

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
  left: { x: 48, y: 0 },
  right: { x: -48, y: 0 },
  none: { x: 0, y: 0 },
};

//<---------- ScrollReveal -------------->
export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  blur = true,
  once = false,
}: ScrollRevealProps) {
  const off = offsets[direction];
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: off.x,
        y: off.y,
        filter: blur ? "blur(12px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12%" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
