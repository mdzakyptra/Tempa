import { motion } from "motion/react";

/**
 * GridBackground — animated perspective grid + drifting radial glow.
 * Pure CSS/SVG, no WebGL. Sits behind content as a subtle B&W texture.
 */
//<---------- GridBackground -------------->
export default function GridBackground({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* static grid */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #fff 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #fff 40%, transparent 100%)",
        }}
      />
      {/* drifting glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0.10) 0%, transparent 60%)",
        }}
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["-8%", "8%", "-8%"],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
