//<---------- HeroMapTexture ------------>
export default function HeroMapTexture({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute -bottom-1/3 -left-1/4 h-[75%] w-[70%] rounded-full bg-sky-100/45 blur-3xl" />
      <div className="absolute -right-1/4 top-1/4 h-[45%] w-[45%] rounded-full bg-emerald-50/50 blur-3xl" />
      <svg className="absolute inset-0 h-full w-full text-sky-950/[0.055]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hero-coordinate-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#hero-coordinate-grid)" />
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M-80 668C148 512 256 768 491 624S841 428 1058 564s314 33 462-78" />
          <path d="M-64 722c201-133 338 82 536-53s358-220 574-72 253 63 460-54" />
          <path d="M-34 178c192 109 263-66 456 71s355 65 544-41 313 19 527 118" />
          <path d="M147 25c55 190 191 242 338 147s294-91 425 36 292 132 486 13" />
          <path d="M1017-35c-71 172 17 263 171 318s191 188 102 365" />
        </g>
      </svg>
    </div>
  );
}
