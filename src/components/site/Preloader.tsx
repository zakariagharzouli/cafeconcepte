"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Preloader Café Concept — voile espresso, badge qui fume,
 * compteur % puis rideau qui se soulève.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      const id = window.setTimeout(() => {
        setGone(true);
        window.dispatchEvent(new Event("cc:intro"));
      }, 0);
      return () => window.clearTimeout(id);
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setGone(true),
      });

      tl.fromTo(
        badgeRef.current,
        { scale: 0.6, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7 }
      )
        .to(
          counter,
          {
            v: 100,
            duration: 1.15,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current)
                counterRef.current.textContent = String(
                  Math.round(counter.v)
                ).padStart(3, "0");
            },
          },
          0.15
        )
        .fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.15, ease: "power2.inOut" },
          0.15
        )
        .to(badgeRef.current, { y: -14, duration: 0.35 }, "+=0.1")
        .to(root, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onStart: () => window.dispatchEvent(new Event("cc:intro")),
        });
    }, root);

    return () => ctx.revert();
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-grad-espresso"
    >
      {/* blobs décoratifs */}
      <div className="absolute -top-24 -left-24 h-96 w-96 blob-b bg-caramel/15" />
      <div className="absolute -bottom-32 -right-20 h-[28rem] w-[28rem] blob-c bg-espresso/60" />

      <div ref={badgeRef} className="relative">
        <div className="absolute inset-0 blur-2xl bg-caramel/30 blob-a" />
        <img
          src="/brand/badge-cream.png"
          alt=""
          className="relative h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-2xl"
        />
        {/* volutes de vapeur */}
        <span className="absolute left-1/2 -translate-x-1/2 -top-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-8 w-1.5 rounded-full bg-cream-soft/70 blur-[3px] origin-bottom"
              style={{
                animation: `steam-rise 1.6s ease-out ${i * 0.35}s infinite`,
              }}
            />
          ))}
        </span>
      </div>

      <p className="display-light mt-8 text-xl uppercase tracking-[0.42em] text-cream-soft md:text-2xl">
        Café Concept
      </p>

      <div className="mt-6 h-px w-44 md:w-60 bg-cream-soft/15 overflow-hidden rounded-full">
        <div ref={barRef} className="h-full w-full origin-left bg-grad-caramel" />
      </div>

      <span
        ref={counterRef}
        className="mt-3 font-body text-sm font-light tracking-[0.3em] text-caramel-light"
      >
        000
      </span>
    </div>
  );
}
