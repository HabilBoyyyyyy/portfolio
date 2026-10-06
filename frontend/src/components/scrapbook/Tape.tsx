export default function Tape({
  className = "",
  rotate = -3,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`block h-6 w-24 bg-terracotta-200/70 shadow-[0_1px_2px_rgba(32,28,26,0.15)] ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        // Slightly uneven edges so it looks torn, not like a perfect rectangle
        clipPath: "polygon(2% 0, 98% 6%, 100% 50%, 97% 100%, 3% 94%, 0 50%)",
      }}
    />
  );
}
