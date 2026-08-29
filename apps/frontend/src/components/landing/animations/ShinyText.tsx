/**
 * ShinyText — text with a moving specular sweep. React Bits "ShinyText" style.
 * Uses a masked gradient that animates via the `shine` keyframes in globals.css.
 */

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

//<---------- ShinyText -------------->
export default function ShinyText({
  text,
  className = "",
  speed = 4,
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255,255,255,0.35) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.35) 70%)",
        backgroundSize: "200% 100%",
        animation: `shine ${speed}s linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
