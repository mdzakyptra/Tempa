//<---------- HeroMapTexture ------------>
export default function HeroMapTexture({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <img src="/hero-sky-background.png" alt="" className="size-full object-cover object-center" />
    </div>
  );
}
