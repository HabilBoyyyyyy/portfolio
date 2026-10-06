"use client";

import {useEffect, type RefObject} from "react";

type Options = {
  maxTilt?: number; // max rotation in degrees
  parallax?: number; // max photo shift in px
};

export function useTilt(
  ref: RefObject<HTMLElement | null>,
  {maxTilt = 14, parallax = 16}: Options = {},
) {
  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;

    // "cur" is what is drawn now; "target" is where the pointer actually is.
    // Each frame, cur moves a fraction of the way toward target.
    const cur = {x: 0.5, y: 0.5, engage: 0};
    const target = {x: 0.5, y: 0.5, engage: 0};
    let raf = 0;
    let last = 0;

    // Writes the 7 custom properties the CSS reads
    const write = () => {
      const dx = cur.x - 0.5;
      const dy = cur.y - 0.5;
      const fromCenter = Math.min(1, Math.hypot(dx, dy) * 2);
      const set = (name: string, value: number) =>
        stage.style.setProperty(name, value.toFixed(3));

      set("--rx", -dy * 2 * maxTilt); // tilt around the horizontal axis (deg)
      set("--ry", dx * 2 * maxTilt); // tilt around the vertical axis (deg)
      set("--px", cur.x * 100); // pointer x as 0-100 (%)
      set("--py", cur.y * 100); // pointer y as 0-100 (%)
      set("--dist", cur.engage * (0.35 + 0.65 * fromCenter)); // shine/glare strength, 0-1
      set("--tx", -dx * 2 * parallax); // photo parallax x (px)
      set("--ty", -dy * 2 * parallax); // photo parallax y (px)
    };

    write(); // start from a clean resting state

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return; // visitors who ask for less motion get a still card

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      // Exponential decay: each frame closes a fixed fraction of the gap, so
      // movement is fast when far from the target and eases in as it arrives.
      // tau is the time constant in seconds (smaller = snappier).
      const tau = target.engage > 0 ? 0.08 : 0.45; // snappy on hover, slow settle on release
      const k = 1 - Math.exp(-dt / tau);
      const kEngage = 1 - Math.exp(-dt / 0.2);

      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      cur.engage += (target.engage - cur.engage) * kEngage;
      write();

      const settled =
        Math.abs(target.x - cur.x) < 0.0005 &&
        Math.abs(target.y - cur.y) < 0.0005 &&
        Math.abs(target.engage - cur.engage) < 0.002;

      raf = settled ? 0 : requestAnimationFrame(frame); // stop looping when idle
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      target.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      target.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      target.engage = 1;
      kick();
    };

    const onLeave = () => {
      target.x = 0.5;
      target.y = 0.5;
      target.engage = 0;
      kick();
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") onLeave(); // on phones, release the card when the finger lifts
    };

    stage.addEventListener("pointerenter", onMove);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointercancel", onLeave);
    stage.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointerenter", onMove);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointercancel", onLeave);
      stage.removeEventListener("pointerup", onUp);
    };
  }, [ref, maxTilt, parallax]);
}
