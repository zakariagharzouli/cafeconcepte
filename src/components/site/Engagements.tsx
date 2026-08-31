"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChefHat, Zap, Award } from "lucide-react";
import { ENGAGEMENTS } from "@/lib/site-data";

const ICONS = [ChefHat, Zap, Award];

export default function Engagements() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Titre en lettres qui montent
      gsap.fromTo(
        ".eng-title .word",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: { trigger: ".eng-title", start: "top 82%" },
        }
      );

      // Cartes engagements
      gsap.fromTo(
        ".eng-card",
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".eng-grid", start: "top 80%" },
        }
      );

      // Image principale : révélation par clip-path organique
      gsap.fromTo(
        ".eng-photo",
        { clipPath: "inset(18% 18% 18% 18% round 200px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 200px)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".eng-photo", start: "top 78%" },
        }
      );

      // Parallaxe interne de la photo
      gsap.fromTo(
        ".eng-photo img",
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger: ".eng-photo",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Carte flottante latte
      gsap.fromTo(
        ".eng-float",
        { scale: 0, rotate: -14, opacity: 0 },
        {
          scale: 1,
          rotate: -6,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: ".eng-photo", start: "top 55%" },
        }
      );

      // blobs décoratifs flottants
      gsap.to(".eng-blob-1", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="engagements"
      className="relative overflow-hidden bg-cream-soft py-28 md:py-36"
    >
      {/* blobs décoratifs */}
      <div className="eng-blob-1 absolute -left-40 top-24 h-[26rem] w-[26rem] blob-b bg-sand/50 blur-2xl" aria-hidden="true" />
      <div className="absolute -right-32 bottom-10 h-96 w-96 blob-c bg-caramel/10 blur-2xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="mb-16 max-w-3xl md:mb-20">
          <p className="mb-4 inline-block rounded-full bg-sand px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso">
            Nos engagements
          </p>
          <h2 className="eng-title font-display text-4xl font-bold leading-[1.05] tracking-tight text-espresso-deep sm:text-5xl md:text-6xl">
            <span className="block overflow-hidden pb-1">
              <span className="word inline-block">Pourquoi</span>{" "}
              <span className="word inline-block">le</span>{" "}
              <span className="word inline-block text-caramel">Café</span>{" "}
              <span className="word inline-block text-caramel">Concept</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="word inline-block">fait</span>{" "}
              <span className="word inline-block">la</span>{" "}
              <span className="word inline-block">différence&nbsp;?</span>
            </span>
          </h2>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Photo ambiance */}
          <div className="relative order-2 lg:order-1">
            <div className="eng-photo mask-blob relative aspect-[4/5] overflow-hidden shadow-2xl shadow-espresso/20">
              <Image
                src="/food/cafe-interior.png"
                alt="L'intérieur chaleureux du Café Concept à Moissy-Cramayel"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover will-change-transform"
                priority={false}
              />
            </div>

            {/* Carte flottante latte */}
            <div className="eng-float absolute -bottom-8 -right-4 w-40 rotate-[-6deg] md:-right-10 md:w-52">
              <div className="overflow-hidden rounded-[2rem] border-4 border-cream-soft shadow-xl shadow-espresso/25">
                <Image
                  src="/food/latte.png"
                  alt="Latte avec latte art servi au Café Concept"
                  width={520}
                  height={520}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

            {/* Pastille fait maison */}
            <div className="absolute -top-6 -left-4 flex h-24 w-24 items-center justify-center rounded-full bg-grad-espresso text-center shadow-lg md:-left-8 md:h-28 md:w-28">
              <span className="font-display text-xs font-bold uppercase leading-tight tracking-wider text-caramel-light">
                100%
                <br />
                maison
              </span>
            </div>
          </div>

          {/* Cartes engagements */}
          <div className="eng-grid order-1 space-y-6 lg:order-2">
            {ENGAGEMENTS.map((eng, i) => {
              const Icon = ICONS[i];
              return (
                <article
                  key={eng.title}
                  className="eng-card group relative overflow-hidden rounded-[2.2rem] border border-espresso/8 bg-cream p-7 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-caramel/15 md:p-8"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 blob-a bg-sand/60 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-125" aria-hidden="true" />
                  <div className="relative flex items-start gap-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-grad-caramel text-espresso-deep shadow-md shadow-caramel/30">
                      <Icon size={24} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-espresso-deep">
                        {eng.title}
                      </h3>
                      <p className="mt-2 font-body text-[15px] leading-relaxed text-cocoa">
                        {eng.text}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}

            <p className="eng-card px-2 pt-2 font-body text-sm italic text-mocha">
              « Très bon café-resto de quartier. Les portions sont généreuses
              et de qualité. » — Jonathan K., avis Google
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
