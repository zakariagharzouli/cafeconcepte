"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, ExternalLink } from "lucide-react";
import { REVIEWS, SITE } from "@/lib/site-data";

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label="5 étoiles sur 5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} className="fill-caramel text-caramel" aria-hidden="true" />
      ))}
    </span>
  );
}

export default function Reviews() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Compteur de note
      const counter = { v: 0 };
      gsap.to(counter, {
        v: 4.9,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ".rev-score", start: "top 80%" },
        onUpdate: () => {
          const el = root.querySelector<HTMLElement>(".rev-score-num");
          if (el) el.textContent = counter.v.toFixed(1).replace(".", ",");
        },
      });

      gsap.fromTo(
        ".rev-header > *",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      gsap.fromTo(
        ".rev-card",
        { y: 64, opacity: 0, rotate: (i) => (i === 1 ? 0 : i === 0 ? -2 : 2) },
        {
          y: 0,
          opacity: 1,
          rotate: (i) => (i === 1 ? 0 : i === 0 ? -1.5 : 1.5),
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: ".rev-grid", start: "top 80%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="avis"
      className="relative overflow-hidden bg-cream-soft py-28 md:py-36"
    >
      <div className="absolute -right-32 top-24 h-96 w-96 blob-b bg-sand/50 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-28 bottom-16 h-80 w-80 blob-c bg-caramel/8 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="rev-header mb-16 flex flex-col items-center gap-8 text-center md:mb-20 md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="mb-4 inline-block rounded-full bg-sand px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso">
              Témoignages
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-espresso-deep sm:text-5xl md:text-6xl">
              Ce que disent
              <span className="text-caramel"> nos clients</span>
            </h2>
          </div>

          <div className="rev-score flex items-center gap-5 rounded-[1.8rem] bg-cream px-7 py-5 shadow-lg shadow-espresso/8">
            <span className="rev-score-num font-display text-6xl font-bold leading-none text-espresso-deep">
              4,9
            </span>
            <div className="text-left">
              <Stars size={18} />
              <p className="mt-1.5 font-body text-sm font-medium text-cocoa">
                {SITE.reviewsCount} avis Google
              </p>
            </div>
          </div>
        </div>

        {/* Cartes */}
        <div className="rev-grid grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="rev-card group relative flex flex-col rounded-[2rem] border border-espresso/6 bg-cream p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-caramel/15"
            >
              <Quote
                size={44}
                className="absolute right-6 top-6 text-sand transition-colors duration-500 group-hover:text-caramel/35"
                aria-hidden="true"
              />
              <Stars />
              <blockquote className="mt-4 flex-1 font-body text-[15px] leading-relaxed text-cocoa">
                « {review.text} »
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-espresso/8 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-grad-caramel font-display text-lg font-bold text-espresso-deep">
                  {review.initial}
                </span>
                <div>
                  <p className="font-body text-sm font-semibold text-espresso-deep">
                    {review.name}
                  </p>
                  <p className="font-body text-xs text-mocha">{review.context}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/maps/place/Café+Concept"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border-2 border-espresso/15 px-7 py-3.5 font-body text-sm font-semibold text-espresso transition-all duration-300 hover:border-caramel hover:text-caramel"
          >
            Voir tous les avis sur Google
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
