import { useRef } from "react";
import type { ReactNode } from "react";

/**
 * SpotlightCard — card with a radial highlight that follows the cursor.
 * React Bits "SpotlightCard" style. Writes the highlight position straight
 * to CSS custom properties via a ref, so moving the pointer never re-renders.
 */

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

//<---------- SpotlightCard -------------->
export default function SpotlightCard({
  children,
  className = "",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const rect = el.getBoundingClientRect();
    glow.style.background = `radial-gradient(420px circle at ${
      e.clientX - rect.left
    }px ${e.clientY - rect.top}px, rgba(255,255,255,0.12), transparent 45%)`;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => {
        if (glowRef.current) glowRef.current.style.opacity = "1";
      }}
      onMouseLeave={() => {
        if (glowRef.current) glowRef.current.style.opacity = "0";
      }}
      className={`relative overflow-hidden rounded-2xl border border-white/12 bg-neutral-950 ${className}`}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
      />
      {children}
    </div>
  );
}
