import { motion } from "motion/react";
import type { Variants } from "motion/react";

/**
 * SplitText — reveals text when it scrolls into view.
 * `by="words"` (default): each word rises + fades in.
 * `by="chars"`: each letter swings up out of a clipping mask with a
 * slight rotation, staggered left to right.
 */

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  by?: "words" | "chars";
}

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const char: Variants = {
  hidden: { y: "115%", rotate: 8, opacity: 0 },
  visible: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

//<---------- SplitText -------------->
export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger,
  once = false,
  by = "words",
}: SplitTextProps) {
  const words = text.split(" ");
  const staggerAmount = stagger ?? (by === "chars" ? 0.028 : 0.06);

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      custom={staggerAmount}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10%" }}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, wi) =>
        by === "chars" ? (
          <span key={wi} className="inline-block whitespace-nowrap">
            {w.split("").map((c, ci) => (
              <span
                key={ci}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.08em" }}
              >
                <motion.span
                  variants={char}
                  className="inline-block origin-bottom-left"
                >
                  {c}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        ) : (
          <span key={wi}>
            <span
              className="inline-block overflow-hidden align-bottom"
              style={{ paddingBottom: "0.08em" }}
            >
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
            {wi < words.length - 1 ? " " : ""}
          </span>
        )
      )}
    </motion.span>
  );
}
