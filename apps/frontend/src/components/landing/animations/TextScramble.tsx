import { useCallback, useEffect, useRef, useState } from "react";

/**
 * TextScramble — text decodes from random glyphs into the real string
 * when it enters the viewport, and re-scrambles on hover.
 */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number; // ms for the full decode
  scrambleOnHover?: boolean;
}

//<---------- TextScramble -------------->
export default function TextScramble({
  text,
  className = "",
  duration = 1100,
  scrambleOnHover = true,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);

  const play = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();

    function tick(now: number) {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out =
          out +
          (c === " " || i < settled
            ? c
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      }
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [play]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={scrambleOnHover ? play : undefined}
    >
      {display}
    </span>
  );
}
