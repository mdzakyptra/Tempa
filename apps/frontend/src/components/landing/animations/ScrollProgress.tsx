import { motion, useScroll, useSpring } from "motion/react";

/**
 * ScrollProgress — thin bar at the very top that fills as the page scrolls.
 */
//<---------- ScrollProgress -------------->
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-black"
      style={{ scaleX }}
    />
  );
}
