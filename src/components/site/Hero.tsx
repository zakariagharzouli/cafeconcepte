"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Phone } from "lucide-react";
import { SITE } from "@/lib/site-data";
import { scrollTo } from "./Dock";

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
        if (q(".hero-char").length === 0) {
          requestAnimationFrame(play);
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          q(".hero-eyebrow"),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
          .fromTo(
            q(".hero-char"),
            { yPercent: 120, rotate: 4 },
            {
              yPercent: 0,
              rotate: 0,
              duration: 1,
              stagger: 0.026,
              ease: "power4.out",
            },
            "-=0.4"
          )
          .fromTo(
            q(".hero-sub"),
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            "-=0.55"
          )
          .fromTo(
            q(".hero-cta"),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
            "-=0.45"
          )
          .fromTo(
            q(".hero-stat"),
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
            "-=0.35"
          )
          .fromTo(
            q(".hero-scroll"),
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            "-=0.3"
          );
      };

      let started = false;
      const onStart = () => {
        if (started) return;
        started = true;
        gsap.delayedCall(0.25, play);
      };
      window.addEventListener("cc:intro", onStart);

      if (reduced) {
        gsap.set(root.querySelectorAll<HTMLElement>("[class*='hero-']"), {
          clearProps: "all",
          opacity: 1,
        });
      }

      const fallback = gsap.delayedCall(3.4, onStart);

      /* ── Parallaxe de sortie au scroll ── */
      if (!reduced) {
        gsap.to(q(".hero-content"), {
          yPercent: -12,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(q(".hero-canvas-wrap"), {
          yPercent: 10,
          scale: 1.05,
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
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Scène WebGL — le monde vivant */}
      <div className="hero-canvas-wrap absolute inset-0 will-change-transform">
        <CoffeeScene />
      </div>

      {/* Voiles de lisibilité — légers, orientés bas (pas de slabs lourds) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-espresso-deep/85 via-espresso-deep/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-espresso-deep/40 to-transparent"
        aria-hidden="true"
      />

      {/* Contenu — ancré bas, composition Sylva */}
      <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 md:px-10 md:pb-16">
        <p className="hero-eyebrow micro-caps mb-7 flex items-center gap-4 text-cream-soft/70">
          <span className="inline-block h-px w-10 bg-caramel-light/70" aria-hidden="true" />
          {SITE.baseline}
        </p>

        <h1 className="display-light max-w-4xl text-[11.8vw] leading-[1.05] text-cream-soft sm:text-7xl md:text-[4.6rem] xl:text-[5.1rem]">
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

        <p className="hero-sub mt-6 max-w-xl font-body text-[15px] font-light leading-[1.75] text-cream-soft/75 md:text-[16.5px]">
          Saveurs asiatiques, burgers gourmands, salades fraîches et
          viennoiseries — tout est préparé sur place, chaque matin, avec des
          produits frais sélectionnés avec soin.
        </p>

        {/* CTA — pilule frosted bornée + cercle téléphone */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={() => scrollTo("#menu")}
            className="frost-pill hero-cta group flex items-center gap-3 px-8 py-4 font-body text-[15px] font-light text-cream-soft transition-colors duration-300 hover:border-caramel-light/50 hover:text-caramel-light"
          >
            Découvrir la carte
            <ArrowDown
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-500 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </button>

          <a
            href={SITE.phoneHref}
            aria-label={`Appeler le Café Concept au ${SITE.phone}`}
            className="frost-pill hero-cta flex h-[52px] w-[52px] items-center justify-center text-cream-soft transition-colors duration-300 hover:border-caramel-light/50 hover:text-caramel-light"
          >
            <Phone size={17} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <span className="hero-cta hidden font-body text-sm font-light text-cream-soft/50 sm:block">
            ou appelez le {SITE.phone}
          </span>
        </div>

        {/* Baseline stats — fine, séparée par filets */}
        <dl className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream-soft/12 pt-6 md:gap-x-12">
          <div className="hero-stat flex items-baseline gap-2.5">
            <dd className="display-light text-3xl text-cream-soft md:text-4xl">
              {String(SITE.rating).replace(".", ",")}
            </dd>
            <dt className="micro-caps text-cream-soft/55">Note Google</dt>
          </div>
          <span className="hero-stat hidden h-6 w-px bg-cream-soft/15 sm:block" aria-hidden="true" />
          <div className="hero-stat flex items-baseline gap-2.5">
            <dd className="display-light text-3xl text-cream-soft md:text-4xl">
              {SITE.reviewsCount}
            </dd>
            <dt className="micro-caps text-cream-soft/55">Avis clients</dt>
          </div>
          <span className="hero-stat hidden h-6 w-px bg-cream-soft/15 sm:block" aria-hidden="true" />
          <div className="hero-stat flex items-baseline gap-2.5">
            <dd className="display-light text-3xl text-cream-soft md:text-4xl">
              {SITE.dishesCount}
            </dd>
            <dt className="micro-caps text-cream-soft/55">Spécialités maison</dt>
          </div>
        </dl>
      </div>

      {/* Indicateur scroll — filet vertical + point animé */}
      <button
        onClick={() => scrollTo("#engagements")}
        aria-label="Faire défiler vers la section suivante"
        className="hero-scroll absolute bottom-24 right-6 z-10 hidden flex-col items-center gap-3 md:right-10 lg:flex"
      >
        <span className="micro-caps rotate-90 text-cream-soft/50">défiler</span>
        <span className="relative block h-16 w-px overflow-hidden bg-cream-soft/15">
          <span
            className="absolute left-0 top-0 h-5 w-px bg-caramel-light"
            style={{ animation: "scroll-drip 2.2s ease-in-out infinite" }}
            aria-hidden="true"
          />
        </span>
      </button>
    </section>
  );
}
