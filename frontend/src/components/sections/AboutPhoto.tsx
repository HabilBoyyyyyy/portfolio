"use client";

import { useRef, useState } from "react";
import Tape from "@/components/scrapbook/Tape";

export default function AboutPhoto({ src }: { src: string }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  }

  return (
    <div
      className="relative w-full max-w-sm mx-auto group"
      style={{
        transform: "rotate(-2.5deg)",
      }}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative bg-ivory p-3 pb-14 md:p-4 md:pb-16 shadow-[0_4px_12px_rgba(32,28,26,0.12)] transition-all duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_12px_32px_rgba(32,28,26,0.2)] cursor-crosshair"
      >
        {/* Tape */}
        <Tape rotate={3} className="absolute -top-3 left-1/2 -translate-x-1/2 z-20" />
        
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-ink">
          
          {/* Base Layer: Vintage/Evidence style */}
          <img
            src={src}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 grayscale sepia-[0.4] contrast-125 brightness-90 group-hover:brightness-50"
          />

          {/* Top Layer: Full Color + Flashlight Mask */}
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isHovering ? 1 : 0,
              WebkitMaskImage: `radial-gradient(circle 140px at ${position.x}% ${position.y}%, black 0%, transparent 100%)`,
              maskImage: `radial-gradient(circle 140px at ${position.x}% ${position.y}%, black 0%, transparent 100%)`,
            }}
          >
            <img
              src={src}
              alt="Profile Reveal"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Optional: Add a subtle lens flare / ring on the cursor when hovering */}
          {isHovering && (
            <div 
              className="absolute pointer-events-none rounded-full border border-ivory/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] transition-opacity duration-300"
              style={{
                width: '280px',
                height: '280px',
                top: `${position.y}%`,
                left: `${position.x}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}

          {/* Film Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj4KICA8ZmlsdGVyIGlkPSJub2lzZSI+CiAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBydW09IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2UpIi8+Cjwvc3ZnPg==')]" />
        </div>

        {/* Polaroid Label */}
        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center justify-center pointer-events-none">
          <p className="font-display text-2xl text-ink/90 tracking-wide rotate-[-2deg]">
            Me.
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-sand-500 transition-opacity duration-300">
            {isHovering ? "Inspecting..." : "Hover to inspect"}
          </p>
        </div>
      </div>
    </div>
  );
}
