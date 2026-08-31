"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Star, Phone, UtensilsCrossed } from "lucide-react";
import Magnetic from "./Magnetic";
import { SITE } from "@/lib/site-data";
import { scrollTo } from "./Navbar";

const CoffeeScene = dynamic(() => import("./three/CoffeeScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-grad-espresso" aria-hidden="true" />
  ),
});

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      /* ── Intro déclenchée par le preloader ── */
      const q = gsap.utils.selector(root);

      const play = () => {
        // attend que le DOM des éléments hero soit bien là
        if (q(".hero-char").length === 0) {
          requestAnimationFrame(play);
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          q(".hero-eyebrow"),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 }
        )
          .fromTo(
            q(".hero-char"),
            { yPercent: 120, rotate: 6 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 0.9,
              stagger: 0.028,
              ease: "power4.out",
            },
            "-=0.35"
          )
          .fromTo(
            q(".hero-sub"),
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            q(".hero-cta"),
            { y: 24, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
            "-=0.4"
          )
          .fromTo(
            q(".hero-stat"),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.09 },
            "-=0.35"
          )
          .fromTo(
            q(".hero-badge-rotating"),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.6)" },
            "-=0.5"
          )
          .fromTo(
            q(".hero-scroll"),
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            "-=0.3"
          );
      };

      let started = false;
      const onStart = () => {
        if (started) return;
        started = true;
        // léger délai pour laisser le rideau se lever
        gsap.delayedCall(0.25, play);
      };
      window.addEventListener("cc:intro", onStart);

      if (reduced) {
        gsap.set(root.querySelectorAll<HTMLElement>("[class*='hero-']"), {
          clearProps: "all",
          opacity: 1,
        });
      }

      // secours : si l'événement n'arrive pas (motion réduit, etc.)
      const fallback = gsap.delayedCall(3.4, onStart);

      /* ── Parallaxe de sortie au scroll ── */
      if (!reduced) {
        gsap.to(q(".hero-content"), {
          yPercent: -14,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(q(".hero-canvas-wrap"), {
          yPercent: 12,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      return () => {
        window.removeEventListener("cc:intro", onStart);
        fallback.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const line1 = "Le vrai goût";
  const line2 = "du fait-maison";

  return (
    <section
      ref={rootRef}
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Scène WebGL */}
      <div className="hero-canvas-wrap absolute inset-0 will-change-transform">
        <CoffeeScene />
      </div>

      {/* Voiles de lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso-deep/45 via-espresso-deep/60 to-espresso-deep/88 md:hidden" aria-hidden="true" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-espresso-deep/78 via-espresso-deep/30 to-transparent md:block" aria-hidden="true" />

      {/* Contenu */}
      <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-24 md:px-10 md:pt-24">
        <p className="hero-eyebrow mb-6 inline-flex items-center gap-2 rounded-full glass-espresso px-4 py-2 font-body text-[11px] font-medium uppercase tracking-[0.28em] text-caramel-light md:text-xs">
          <UtensilsCrossed size={13} aria-hidden="true" />
          {SITE.baseline}
        </p>

        <h1 className="max-w-4xl font-display text-[13.5vw] font-bold leading-[0.95] tracking-tight text-cream-soft sm:text-7xl md:text-8xl">
          <span className="block overflow-hidden pb-1">
            {line1.split("").map((c, i) => (
              <span key={i} className="hero-char inline-block will-change-transform">
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
          </span>
          <span className="block overflow-hidden pb-2">
            {line2.split("").map((c, i) => (
              <span
                key={i}
                className={`hero-char inline-block will-change-transform ${
                  i >= 3 ? "text-caramel-light" : ""
                }`}
              >
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
          </span>
        </h1>

        <p className="hero-sub mt-7 max-w-xl font-body text-base leading-relaxed text-cream-soft/85 md:text-lg">
          Saveurs asiatiques, burgers gourmands, salades fraîches et
          viennoiseries — tout est préparé sur place, chaque matin, avec des
          produits frais sélectionnés avec soin.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Magnetic>
            <button
              onClick={() => scrollTo("#menu")}
              data-cursor="Menu"
              className="hero-cta group flex items-center gap-3 rounded-full bg-grad-caramel px-8 py-4 font-body text-base font-semibold text-espresso-deep shadow-2xl shadow-caramel/30 transition-shadow hover:shadow-caramel/50"
            >
              <UtensilsCrossed
                size={18}
                strokeWidth={2.4}
                className="transition-transform duration-500 group-hover:rotate-[20deg]"
                aria-hidden="true"
              />
              Découvrir le menu
            </button>
          </Magnetic>

          <Magnetic>
            <a
              href={SITE.phoneHref}
              className="hero-cta flex items-center gap-3 rounded-full border border-cream-soft/25 px-8 py-4 font-body text-base font-semibold text-cream-soft glass-espresso transition-colors duration-300 hover:border-caramel-light/60 hover:text-caramel-light"
            >
              <Phone size={17} strokeWidth={2.4} aria-hidden="true" />
              {SITE.phone}
            </a>
          </Magnetic>
        </div>

        {/* Stats */}
        <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-6 md:gap-x-14">
          <div className="hero-stat">
            <dt className="sr-only">Note Google</dt>
            <dd className="flex items-center gap-2 font-display text-4xl font-bold text-cream-soft md:text-5xl">
              {SITE.rating}
              <Star size={22} className="fill-caramel-light text-caramel-light" aria-hidden="true" />
            </dd>
            <dd className="mt-1 font-body text-xs uppercase tracking-[0.22em] text-cream-soft/60">
              Note Google
            </dd>
          </div>
          <div className="hero-stat">
            <dt className="sr-only">Avis clients</dt>
            <dd className="font-display text-4xl font-bold text-cream-soft md:text-5xl">
              {SITE.reviewsCount}
            </dd>
            <dd className="mt-1 font-body text-xs uppercase tracking-[0.22em] text-cream-soft/60">
              Avis clients
            </dd>
          </div>
          <div className="hero-stat">
            <dt className="sr-only">Spécialités</dt>
            <dd className="font-display text-4xl font-bold text-cream-soft md:text-5xl">
              {SITE.dishesCount}
            </dd>
            <dd className="mt-1 font-body text-xs uppercase tracking-[0.22em] text-cream-soft/60">
              Spécialités maison
            </dd>
          </div>
        </dl>
      </div>

      {/* Badge rotatif */}
      <div className="hero-badge-rotating absolute right-10 top-28 z-10 hidden lg:block xl:right-24">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_14s_linear_infinite]">
            <defs>
              <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text className="fill-cream-soft/80 font-body text-[8.2px] font-semibold uppercase tracking-[0.24em]">
              <textPath href="#circlePath">
                Fait maison • Produits frais • Sur place • À emporter •
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
              <img src="/brand/badge-cream.png" alt="" className="h-14 w-14 object-contain" />
          </div>
        </div>
      </div>

      {/* Indicateur scroll */}
      <button
        onClick={() => scrollTo("#engagements")}
        aria-label="Faire défiler vers la section suivante"
        className="hero-scroll absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-cream-soft/70 transition-colors hover:text-caramel-light"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-cream-soft/20 glass-espresso">
          <ArrowDown size={18} className="animate-bounce" aria-hidden="true" />
        </span>
      </button>
    </section>
  );
}
