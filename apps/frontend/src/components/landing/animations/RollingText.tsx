/**
 * RollingText — on hover of the nearest `.group` ancestor, each letter
 * rolls up and is replaced by a duplicate rising from below, staggered
 * left to right. Pure CSS, no re-renders.
 *
 * Usage: <a className="group"><RollingText text="Work" /></a>
 */

interface RollingTextProps {
  text: string;
  className?: string;
  staggerMs?: number;
}

//<---------- RollingText -------------->
export default function RollingText({
  text,
  className = "",
  staggerMs = 18,
}: RollingTextProps) {
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {text.split("").map((c, i) => {
        const char = c === " " ? " " : c;
        const delay = { transitionDelay: `${i * staggerMs}ms` };
        return (
          <span
            key={i}
            aria-hidden
            className="relative inline-block overflow-hidden"
          >
            <span
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
              style={delay}
            >
              {char}
            </span>
            <span
              className="absolute left-0 top-full inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full"
              style={delay}
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
}
