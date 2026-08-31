"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Curseur custom Café Concept : point espresso + blob caramel qui suit
 * avec inertie. S'agrandit sur les éléments interactifs [data-cursor].
 * Désactivé sur tactile (pointer: coarse).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const dot = dotRef.current!;
    const blob = blobRef.current!;
    const label = labelRef.current!;

    gsap.set([dot, blob], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const blobX = gsap.quickTo(blob, "x", { duration: 0.45, ease: "power3" });
    const blobY = gsap.quickTo(blob, "y", { duration: 0.45, ease: "power3" });

    let visible = false;

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        gsap.to([dot, blob], { opacity: 1, duration: 0.3 });
        visible = true;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      blobX(e.clientX);
      blobY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]"
      );
      if (target) {
        const text = target.dataset.cursor || "";
        label.textContent = text;
        gsap.to(blob, {
          scale: text ? 3.2 : 1.9,
          duration: 0.4,
          ease: "back.out(2)",
        });
        gsap.to(dot, { scale: 0.4, duration: 0.3 });
        gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 });
      } else {
        gsap.to(blob, { scale: 1, duration: 0.4, ease: "power3.out" });
        gsap.to(dot, { scale: 1, duration: 0.3 });
        gsap.to(label, { opacity: 0, duration: 0.2 });
      }
    };

    const onLeave = () => {
      gsap.to([dot, blob], { opacity: 0, duration: 0.3 });
      visible = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={blobRef}
        className="fixed top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full bg-caramel/25 backdrop-blur-[2px] border border-caramel/40 will-change-transform"
      >
        <span
          ref={labelRef}
          className="font-display text-[7px] font-bold uppercase tracking-widest text-espresso-deep opacity-0 select-none"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-espresso-deep will-change-transform"
      />
    </div>
  );
}
