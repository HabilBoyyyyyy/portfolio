"use client";

import { useEffect, useRef, useState } from "react";
import Paper from "@/components/scrapbook/Paper";
import type { TimelineItem } from "@/lib/api";

function TimelineNode({
  item,
  index,
  isLeft,
}: {
  item: TimelineItem;
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -15% 0px" } // trigger slightly before it hits the bottom
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex items-center mb-16 w-full md:w-1/2 ${
        isLeft ? "md:pr-12 md:justify-end" : "md:pl-12 md:self-end md:ml-auto"
      } pl-12 md:pl-0`} // On mobile, always pad left. On desktop, alternate.
    >
      {/* Node Dot (Mobile) */}
      <div className="md:hidden absolute left-0 top-6 w-6 h-6 flex items-center justify-center z-10">
        <span 
           className={`w-3 h-3 rounded-full bg-ivory border-2 border-terracotta-600 transition-all duration-500 delay-150 ${visible ? "scale-100 bg-terracotta-600 shadow-[0_0_12px_rgba(193,80,46,0.8)]" : "scale-50"}`}
        />
      </div>

      {/* Node Dot (Desktop) */}
      <div 
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center z-10"
        style={{ [isLeft ? "right" : "left"]: "-16px" }}
      >
        <span 
           className={`w-3.5 h-3.5 rounded-full bg-ivory border-2 border-terracotta-600 transition-all duration-500 delay-150 ${visible ? "scale-100 bg-terracotta-600 shadow-[0_0_12px_rgba(193,80,46,0.8)]" : "scale-50"}`}
        />
      </div>

      {/* Connecting branch line (Desktop only) */}
      <div 
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-px border-t-2 border-dashed border-terracotta-300 transition-all duration-700 delay-300 ${visible ? "w-10 opacity-100" : "w-0 opacity-0"}`}
        style={{ [isLeft ? "right" : "left"]: "-40px" }}
      />

      {/* The Card */}
      <div 
         className={`w-full transition-all duration-700 ease-out ${
           visible 
             ? "opacity-100 translate-y-0 md:translate-x-0" 
             : `opacity-0 translate-y-8 md:translate-y-0 ${isLeft ? "md:translate-x-8" : "md:-translate-x-8"}`
         }`}
      >
        <Paper
          tape
          rotate={index % 2 === 0 ? -1.5 : 1.5}
          className="relative w-full !p-6 hover:-translate-y-1 hover:[--r:0deg] transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[11px] font-bold tracking-widest text-terracotta-700 bg-terracotta-100/50 inline-block px-2.5 py-1 rounded border border-terracotta-200">
              {item.year}
            </span>
          </div>
          
          <h3 className="font-display text-xl text-ink leading-tight">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-2.5 text-sm text-sand-700 leading-relaxed">
              {item.description}
            </p>
          )}
        </Paper>
      </div>
    </div>
  );
}

export default function TimelineList({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
       setLineProgress(100);
       return;
    }
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // We want the line to start filling when the top of the timeline is mid-screen,
      // and end when the bottom of the timeline hits mid-screen.
      const scrollY = viewportHeight / 2 - rect.top;
      const progress = (scrollY / rect.height) * 100;
      
      setLineProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto py-8">
      {/* Background track line */}
      <div className="absolute left-[11px] md:left-1/2 md:-ml-[1.5px] top-4 bottom-4 w-[3px] bg-sand-200 rounded-full" />
      
      {/* Scroll-filled active line */}
      <div 
        className="absolute left-[11px] md:left-1/2 md:-ml-[1.5px] top-4 bottom-4 w-[3px] rounded-full overflow-hidden"
      >
        <div 
          className="w-full bg-terracotta-600 rounded-full transition-transform duration-200 ease-out origin-top"
          style={{ height: "100%", transform: `scaleY(${lineProgress / 100})` }}
        />
      </div>

      <div className="flex flex-col relative z-10 w-full pt-10">
        {items.map((item, i) => (
          <TimelineNode key={item.id} item={item} index={i} isLeft={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
}
