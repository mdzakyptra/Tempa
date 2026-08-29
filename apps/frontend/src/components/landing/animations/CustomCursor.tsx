import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * CustomCursor — a soft ring that trails the pointer, grows over
 * interactive elements, and expands into a labelled disc over anything
 * carrying `data-cursor-label="View"`. Hidden on touch devices.
 * Pure B&W (blend mode difference so it inverts whatever is underneath).
 */
//<---------- CustomCursor -------------->
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    let isHover = false;
    let currentLabel: string | null = null;
    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;

      const labelEl = el.closest("[data-cursor-label]") as HTMLElement | null;
      const nextLabel = labelEl?.dataset.cursorLabel ?? null;
      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel;
        setLabel(nextLabel);
      }

      const next = !!el.closest("a, button, [data-cursor='hover']");
      if (next !== isHover) {
        isHover = next;
        setHovering(next);
      }
    }
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 56 : 22;
  const filled = hovering || !!label;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden items-center justify-center overflow-hidden rounded-full border border-white mix-blend-difference md:flex"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: size,
        height: size,
        backgroundColor: filled
          ? "rgba(255,255,255,1)"
          : "rgba(255,255,255,0)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.span
        animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.5 }}
        transition={{ duration: 0.25 }}
        className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-black"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
