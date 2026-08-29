import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

/**
 * FlipWords — cycles through a list of words; each one rolls up and out
 * while the next rolls in. Width is reserved for the longest word so the
 * surrounding line never jumps.
 */

interface FlipWordsProps {
  words: string[];
  interval?: number; // ms per word
  className?: string;
  shiny?: boolean; // apply the moving specular sweep from ShinyText
}

const shinyStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(120deg, rgba(255,255,255,0.35) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.35) 70%)",
  backgroundSize: "200% 100%",
  animation: "shine 4s linear infinite",
};

//<---------- FlipWords -------------->
export default function FlipWords({
  words,
  interval = 2400,
  className = "",
  shiny = false,
}: FlipWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval
    );
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className={`relative inline-grid justify-items-center overflow-hidden align-bottom ${className}`}
      style={{ paddingBottom: "0.08em" }}
    >
      {/* invisible sizers reserve the width of the longest word */}
      {words.map((w) => (
        <span
          key={w}
          aria-hidden
          className="invisible col-start-1 row-start-1"
        >
          {w}
        </span>
      ))}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={words[index]}
          initial={{ y: "110%", rotate: 5, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          exit={{ y: "-110%", rotate: -5, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={`col-start-1 row-start-1 inline-block ${
            shiny ? "bg-clip-text text-transparent" : ""
          }`}
          style={shiny ? shinyStyle : undefined}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
