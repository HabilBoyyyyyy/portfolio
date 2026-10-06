import Tape from "./Tape";

export default function Paper({
  children,
  rotate = 0,
  tape = false,
  className = "",
}: {
  children: React.ReactNode;
  rotate?: number;
  tape?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-white p-5 shadow-[0_1px_2px_rgba(32,28,26,0.12),0_12px_24px_-12px_rgba(32,28,26,0.28)] transition duration-300 [rotate:var(--r)] ${className}`}
      style={{"--r": `${rotate}deg`} as React.CSSProperties}>
      {tape && <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />}
      {children}
    </div>
  );
}
