"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ExternalLink } from "lucide-react";
import { REVIEWS, SITE } from "@/lib/site-data";

function Stars({ size = 14 }: { size?: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label="5 étoiles sur 5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} className="fill-caramel text-caramel" aria-hidden="true" />
      ))}
    </span>
  );
}

/* Témoignages éditoriaux — plus de cartes boxées à avatars :
   trois citations en colonnes sur filets, note géante en Lexend light. */
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
        { y: 36, opacity: 0 },
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
        ".rev-quote",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: { trigger: ".rev-grid", start: "top 82%" },
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
      <div
        className="absolute -right-32 top-24 h-80 w-80 blob-b bg-sand/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="rev-header mb-16 flex flex-col gap-10 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="micro-caps mb-6 flex items-center gap-4 text-caramel">
              <span className="inline-block h-px w-10 bg-caramel/60" aria-hidden="true" />
              Témoignages
            </p>
            <h2 className="display-light text-4xl leading-[1.08] text-espresso-deep sm:text-5xl md:text-[3.4rem]">
              Ce que disent
              <br />
              <span className="text-caramel">nos clients</span>
            </h2>
          </div>

          {/* Score — géant et light, sans boîte */}
          <div className="rev-score flex items-end gap-5">
            <span className="rev-score-num display-light leading-none text-espresso-deep text-8xl md:text-[7.5rem]">
              4,9
            </span>
            <div className="pb-3 md:pb-5">
              <Stars size={16} />
              <p className="mt-2 font-body text-[13px] font-light tracking-[0.06em] text-cocoa">
                {SITE.reviewsCount} avis Google
              </p>
            </div>
          </div>
        </div>

        {/* Citations en colonnes sur filets */}
        <div className="rev-grid grid gap-x-12 gap-y-10 md:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <figure key={review.name} className="rev-quote border-t border-espresso/12 pt-7">
              <div className="flex items-center justify-between">
                <Stars />
                <span
                  className="numeral-espresso display-light select-none text-3xl leading-none"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
              </div>
              <blockquote className="mt-5 font-body text-[16.5px] font-light leading-[1.8] text-espresso/85">
                « {review.text} »
              </blockquote>
              <figcaption className="mt-6">
                <p className="micro-caps text-espresso-deep">{review.name}</p>
                <p className="mt-1 font-body text-xs font-light text-mocha">
                  {review.context}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="https://www.google.com/maps/place/Café+Concept"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-2 font-body text-sm font-light tracking-[0.04em] text-espresso transition-colors duration-300 hover:text-caramel"
          >
            Voir tous les avis sur Google
            <ExternalLink size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
