"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Phone, Menu as MenuIcon, X } from "lucide-react";
import { SITE } from "@/lib/site-data";

const LINKS = [
  { href: "#signatures", label: "Signatures" },
  { href: "#menu", label: "Menu" },
  { href: "#traiteur", label: "Traiteur" },
  { href: "#avis", label: "Avis" },
  { href: "#contact", label: "Contact" },
];

export function scrollTo(target: string) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: -90, duration: 1.4 });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Dock façon Sylva — Living Green :
 * ─ panneau de verre translucide, SANS backdrop-filter global
 *   (sur un canvas qui se repeint chaque frame, le blur coûte ~20 fps —
 *   la page autho documente ce choix, on le respecte) ;
 * ─ items qui s'illuminent par PROXIMITÉ du pointeur (data-near),
 *   pas de curseur custom ni d'aimant : le pointeur existe, le dock répond ;
 * ─ un seul vrai frosted (blur 13 saturate 1.16) borné à la pilule CTA.
 */
export default function Dock() {
  const rootRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  /* ── Proximité : les items s'allument quand le pointeur approche ──
     Aucune garde de médium : pointermove tactile ne se déclenche que
     pendant un glissé et reste sans conséquence (simple survol lumineux). */
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const items = Array.from(dock.querySelectorAll<HTMLElement>(".dock-item"));
    let raf = 0;

    const applyProximity = (x: number, y: number) => {
      for (const item of items) {
        const r = item.getBoundingClientRect();
        const dx = x - (r.left + r.width / 2);
        const dy = y - (r.top + r.height / 2);
        // rayon d'influence généreux, à la manière du dock autho
        const near = Math.hypot(dx, dy) < Math.max(r.width, 72) * 0.85;
        if (item.dataset.near !== String(near)) item.dataset.near = String(near);
      }
    };

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyProximity(e.clientX, e.clientY));
    };
    const onLeaveWindow = () => {
      cancelAnimationFrame(raf);
      items.forEach((i) => (i.dataset.near = "false"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, []);

  /* ── Entrée du dock après le preloader ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { y: -70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : 2.2,
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ── Overlay mobile (clip-path circulaire, liens Lexend light) ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (open) {
      gsap.set(overlay, { display: "flex" });
      gsap
        .timeline()
        .fromTo(
          overlay,
          { clipPath: "circle(0% at 92% 5%)" },
          { clipPath: "circle(150% at 92% 5%)", duration: 0.7, ease: "power3.inOut" }
        )
        .fromTo(
          overlay.querySelectorAll(".mobile-link"),
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" },
          "-=0.25"
        );
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(overlay, {
        clipPath: "circle(0% at 92% 5%)",
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
      document.body.style.overflow = "";
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(href), open ? 550 : 0);
  };

  return (
    <>
      <header ref={rootRef} className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 opacity-0">
        <div
          ref={dockRef}
          className={`dock-panel flex items-center gap-1 rounded-full p-1.5 transition-transform duration-500 ${
            open ? "" : "scale-100"
          }`}
        >
          {/* dock-mark — le badge de marque */}
          <button
            onClick={() => go("#hero")}
            aria-label="Retour à l'accueil"
            className="dock-item flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4"
          >
            <img
              src="/brand/badge.png"
              alt="Logo Café Concept"
              className="h-8 w-8 object-contain"
            />
            <span className="hidden font-display text-[15px] font-light leading-none tracking-[0.02em] text-cream-soft sm:block">
              café <span className="text-caramel-light">concept</span>
            </span>
          </button>

          <span className="mx-1 hidden h-5 w-px bg-cream-soft/15 lg:block" aria-hidden="true" />

          {/* Liens — items du dock */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="dock-item rounded-full px-4 py-2 font-body text-[13.5px] font-light tracking-[0.01em] text-cream-soft/85 hover:text-cream-soft"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <span className="mx-1 h-5 w-px bg-cream-soft/15 lg:mx-1" aria-hidden="true" />

          {/* CTA — la seule vraie pilule frosted du dock */}
          <a
            href={SITE.phoneHref}
            className="frost-pill group hidden items-center gap-2.5 px-5 py-2.5 font-body text-[13.5px] font-light text-cream-soft transition-colors duration-300 hover:text-caramel-light sm:flex"
          >
            <Phone size={14} strokeWidth={2} aria-hidden="true" />
            {SITE.phone}
          </a>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="dock-item flex h-10 w-10 items-center justify-center rounded-full text-cream-soft lg:hidden"
          >
            {open ? <X size={18} strokeWidth={1.8} /> : <MenuIcon size={18} strokeWidth={1.8} />}
          </button>
        </div>
      </header>

      {/* Overlay mobile plein écran */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center bg-grad-espresso"
        style={{ display: "none" }}
      >
        <nav aria-label="Navigation mobile" className="flex flex-col items-center gap-1.5">
          {LINKS.map((l, i) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="mobile-link display-light py-2 text-5xl text-cream-soft transition-colors hover:text-caramel-light"
            >
              <span className="mr-4 align-middle font-body text-[11px] font-normal tracking-[0.3em] text-caramel-light/80">
                0{i + 1}
              </span>
              {l.label}
            </button>
          ))}
        </nav>
        <a
          href={SITE.phoneHref}
          className="frost-pill mobile-link mt-10 flex items-center gap-3 px-8 py-4 font-body text-lg font-light text-cream-soft"
        >
          <Phone size={17} strokeWidth={2} /> {SITE.phone}
        </a>
        <p className="mobile-link mt-8 max-w-xs text-center font-body text-sm font-light leading-relaxed text-cream-soft/55">
          {SITE.address}
        </p>
      </div>
    </>
  );
}
