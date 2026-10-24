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
      className={`relative border border-sand-200/85 bg-[#fffdf9] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(32,28,26,0.08),0_14px_28px_-12px_rgba(32,28,26,0.22)] transition duration-300 [rotate:var(--r)] ${className}`}
      style={{"--r": `${rotate}deg`} as React.CSSProperties}>
      {tape && (
        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-20" />
      )}
      {children}
    </div>
  );
}
