"use client";

import {useEffect, useRef} from "react";

export type BackgroundVariant = "dot-grid" | "squares" | "waves";

interface InteractiveBackgroundProps {
  /**
   * Choose between three React Bits-inspired interactive backgrounds
   * tailored to the warm ivory / terracotta / green / ink portfolio theme:
   * - "dot-grid" (default): Springy dot matrix + drafting crosshairs + cursor lens + click shockwaves
   * - "squares": Drifting architectural blueprint grid with trailing terracotta hover cells
   * - "waves": Flowing topographic contour lines that bend around the cursor
   */
  variant?: BackgroundVariant;
}

export default function InteractiveBackground({
  variant = "dot-grid",
}: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initScene();
    };

    const pointer = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      lastX: -9999,
      lastY: -9999,
      active: false,
    };

    // Shockwaves triggered on click (React Bits DotGrid style)
    const ripples: Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      strength: number;
    }> = [];

    // State for "dot-grid"
    type Dot = {
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      isCrosshair: boolean;
    };
    let dots: Dot[] = [];

    // State for "squares"
    let gridOffset = {x: 0, y: 0};
    const trailCells = new Map<string, number>();

    const initScene = () => {
      if (variant === "dot-grid") {
        dots = [];
        const spacing = width < 640 ? 32 : 28;
        const cols = Math.ceil(width / spacing) + 1;
        const rows = Math.ceil(height / spacing) + 1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ox = c * spacing;
            const oy = r * spacing;
            dots.push({
              ox,
              oy,
              x: ox,
              y: oy,
              vx: 0,
              vy: 0,
              isCrosshair: r % 4 === 0 && c % 4 === 0,
            });
          }
        }
      }
    };

    resize();

    const onPointerMove = (e: PointerEvent) => {
      if (pointer.lastX !== -9999) {
        pointer.vx = e.clientX - pointer.lastX;
        pointer.vy = e.clientY - pointer.lastY;
      }
      pointer.lastX = pointer.x = e.clientX;
      pointer.lastY = pointer.y = e.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (reducedMotion) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 260,
        strength: 18,
      });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, {passive: true});
    window.addEventListener("pointerleave", onPointerLeave, {passive: true});
    window.addEventListener("pointerdown", onPointerDown, {passive: true});

    let rafId = 0;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Soft warm cursor spotlight under all variants
      if (pointer.active && pointer.x > -1000) {
        const grad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          10,
          pointer.x,
          pointer.y,
          280,
        );
        grad.addColorStop(0, "rgba(193, 80, 46, 0.065)");
        grad.addColorStop(0.5, "rgba(217, 146, 125, 0.025)");
        grad.addColorStop(1, "rgba(250, 246, 240, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Advance click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 9;
        rp.strength *= 0.94;
        if (rp.radius > rp.maxRadius) {
          ripples.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(193, 80, 46, ${(
            (1 - rp.radius / rp.maxRadius) *
            0.18
          ).toFixed(3)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      if (variant === "dot-grid") {
        const influenceRadius = 135;
        const influenceSq = influenceRadius * influenceRadius;
        const spring = 0.085;
        const damping = 0.82;

        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          let fx = (d.ox - d.x) * spring;
          let fy = (d.oy - d.y) * spring;
          let proximity = 0;

          if (pointer.active && !reducedMotion) {
            const dx = d.x - pointer.x;
            const dy = d.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < influenceSq && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / influenceRadius;
              proximity = factor;
              // Gently push & flick dots with cursor motion
              const push = factor * factor * 2.4;
              fx += (dx / dist) * push + pointer.vx * factor * 0.06;
              fy += (dy / dist) * push + pointer.vy * factor * 0.06;
            }
          }

          // Apply click shockwaves
          for (let r = 0; r < ripples.length; r++) {
            const rp = ripples[r];
            const dx = d.x - rp.x;
            const dy = d.y - rp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const band = Math.abs(dist - rp.radius);
            if (band < 36 && dist > 0.1) {
              const wave = (1 - band / 36) * rp.strength * 0.15;
              fx += (dx / dist) * wave;
              fy += (dy / dist) * wave;
              proximity = Math.max(proximity, (1 - band / 36) * 0.85);
            }
          }

          if (!reducedMotion) {
            d.vx = (d.vx + fx) * damping;
            d.vy = (d.vy + fy) * damping;
            d.x += d.vx;
            d.y += d.vy;
          }

          if (d.isCrosshair) {
            const arm = 3.2 + proximity * 1.8;
            ctx.strokeStyle =
              proximity > 0.15
                ? `rgba(193, 80, 46, ${(0.22 + proximity * 0.55).toFixed(2)})`
                : "rgba(32, 28, 26, 0.14)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(d.x - arm, d.y);
            ctx.lineTo(d.x + arm, d.y);
            ctx.moveTo(d.x, d.y - arm);
            ctx.lineTo(d.x, d.y + arm);
            ctx.stroke();
          } else {
            const radius = 1.05 + proximity * 1.45;
            ctx.fillStyle =
              proximity > 0.1
                ? `rgba(193, 80, 46, ${(0.18 + proximity * 0.6).toFixed(2)})`
                : "rgba(32, 28, 26, 0.11)";
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (variant === "squares") {
        const cellSize = 46;
        if (!reducedMotion) {
          gridOffset.x = (gridOffset.x + 0.18) % cellSize;
          gridOffset.y = (gridOffset.y + 0.12) % cellSize;
        }

        // Record hovered cell in trail map
        if (pointer.active) {
          const hc = Math.floor((pointer.x + gridOffset.x) / cellSize);
          const hr = Math.floor((pointer.y + gridOffset.y) / cellSize);
          trailCells.set(`${hc}:${hr}`, 1);
        }

        // Draw decaying trail cells
        trailCells.forEach((alpha, key) => {
          const [cStr, rStr] = key.split(":");
          const c = Number(cStr);
          const r = Number(rStr);
          const x = c * cellSize - gridOffset.x;
          const y = r * cellSize - gridOffset.y;

          ctx.fillStyle = `rgba(193, 80, 46, ${(alpha * 0.11).toFixed(3)})`;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          ctx.strokeStyle = `rgba(193, 80, 46, ${(alpha * 0.32).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);

          const next = alpha * 0.94;
          if (next < 0.02) trailCells.delete(key);
          else trailCells.set(key, next);
        });

        // Draw crisp architectural grid lines
        ctx.strokeStyle = "rgba(32, 28, 26, 0.055)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = -gridOffset.x; x < width; x += cellSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = -gridOffset.y; y < height; y += cellSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      } else if (variant === "waves") {
        const lineCount = 18;
        const stepX = 24;
        const spacingY = height / (lineCount - 1);

        for (let i = 0; i < lineCount; i++) {
          const baseY = i * spacingY;
          const isAccent = i % 4 === 0;
          ctx.beginPath();
          for (let x = 0; x <= width + stepX; x += stepX) {
            let waveY =
              Math.sin(x * 0.004 + time + i * 0.45) * 14 +
              Math.cos(x * 0.009 - time * 0.7 + i) * 6;

            if (pointer.active && !reducedMotion) {
              const dx = x - pointer.x;
              const dy = baseY + waveY - pointer.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 180) {
                const pull = (1 - dist / 180) * 28;
                waveY += (dy >= 0 ? 1 : -1) * pull;
              }
            }

            if (x === 0) ctx.moveTo(x, baseY + waveY);
            else ctx.lineTo(x, baseY + waveY);
          }
          ctx.strokeStyle = isAccent
            ? "rgba(193, 80, 46, 0.13)"
            : "rgba(32, 28, 26, 0.065)";
          ctx.lineWidth = isAccent ? 1.25 : 1;
          ctx.stroke();
        }
      }

      pointer.vx *= 0.8;
      pointer.vy *= 0.8;

      if (!document.hidden) {
        rafId = requestAnimationFrame(render);
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [variant]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none">
      {/* 1. Warm Ambient Corner Glows (Terracotta Top-Right & Deep Green Bottom-Left) */}
      <div
        className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(229, 182, 167, 0.38) 0%, rgba(250, 246, 240, 0) 70%)",
        }}
      />
      <div
        className="absolute -bottom-48 -left-40 h-[560px] w-[560px] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 182, 169, 0.34) 0%, rgba(250, 246, 240, 0) 70%)",
        }}
      />

      {/* 2. Interactive React Bits-Style Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />

      {/* 3. Subtle Editorial Margin Ruler Marks (Visible on wide screens) */}
      <div className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 flex-col items-start gap-6 opacity-25 font-mono text-[9px] tracking-widest text-ink">
        <span>00 // N</span>
        <span className="h-12 w-[1px] bg-ink/40 ml-1" />
        <span>06°12&apos;S</span>
        <span className="h-12 w-[1px] bg-ink/40 ml-1" />
        <span>106°59&apos;E</span>
      </div>

      {/* 4. Tactile Paper-Fiber SVG Grain Overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.028]"
        xmlns="http://www.w3.org/2000/svg">
        <filter id="portfolio-paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#portfolio-paper-grain)" />
      </svg>
    </div>
  );
}
