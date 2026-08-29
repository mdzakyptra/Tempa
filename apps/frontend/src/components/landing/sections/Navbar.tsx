import { useEffect, useState } from "react";
import { motion } from "motion/react";
import MagneticButton from "../animations/MagneticButton";
import RollingText from "../animations/RollingText";

const links = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

//<---------- Navbar -------------->
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const isScrolled = y > 40;
      setScrolled(isScrolled);

      if (!isScrolled) {
        setHidden(false);
      } else {
        const delta = y - lastY;
        if (delta > 0) {
          setHidden(true);
        } else if (delta < 0) {
          setHidden(false);
        }
      }

      lastY = y;
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "border-white/15 bg-black/60 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="text-lg font-black tracking-tighter">
          MONO<span className="text-neutral-500">/</span>LITH
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-sm text-neutral-300 transition-colors hover:text-white"
              >
                <RollingText text={l.label} />
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <MagneticButton
          href="#contact"
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
        >
          Let&apos;s talk
        </MagneticButton>
      </nav>
    </motion.header>
  );
}
