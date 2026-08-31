import { useEffect } from "react";
import { cancelFrame, frame } from "motion/react";
import Lenis from "lenis";


//<---------- SmoothScroll -------------->
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis();

    function update(data: { timestamp: number }) {
      lenis.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
