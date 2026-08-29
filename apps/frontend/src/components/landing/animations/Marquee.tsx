import type { ReactNode } from "react";

/**
 * Marquee — seamless infinite horizontal scroller.
 * Duplicates its children once and translates -50% for a gapless loop.
 */

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number; // seconds per loop
  reverse?: boolean;
  pauseOnHover?: boolean;
}

//<---------- Marquee -------------->
export default function Marquee({
  children,
  className = "",
  speed = 26,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={`flex shrink-0 items-center ${
            pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
          }`}
          style={{
            animation: `marquee ${speed}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
