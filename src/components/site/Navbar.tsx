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

export default function Navbar() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animation d'entrée de la navbar après le preloader
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { y: -90, opacity: 0 },
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

  // Overlay mobile
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
    // attendre la fermeture de l'overlay avant de scroller
    setTimeout(() => scrollTo(href), open ? 550 : 0);
  };

  return (
    <>
      <header ref={rootRef} className="fixed inset-x-0 top-0 z-50 opacity-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 pt-4 md:px-8">
          {/* Pilule logo */}
          <button
            onClick={() => go("#hero")}
            aria-label="Retour à l'accueil"
            className={`group flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 transition-all duration-500 glass-warm shadow-lg shadow-espresso/5 ${
              scrolled ? "scale-[0.96]" : ""
            }`}
          >
            <img
              src="/brand/badge.png"
              alt="Logo Café Concept"
              className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-[15deg]"
            />
            <span className="font-display text-lg font-bold leading-none text-espresso-deep">
              café <span className="text-caramel">concept</span>
            </span>
          </button>

          {/* Pilule desktop */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 rounded-full p-1.5 glass-warm shadow-lg shadow-espresso/5 lg:flex"
          >
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-full px-4 py-2 font-body text-sm font-medium text-espresso transition-colors duration-300 hover:bg-espresso hover:text-cream-soft"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTA téléphone */}
          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="group hidden items-center gap-2.5 rounded-full bg-grad-caramel p-1.5 pr-5 font-body text-sm font-semibold text-espresso-deep shadow-lg shadow-caramel/30 transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-espresso-deep text-cream-soft transition-transform duration-500 group-hover:rotate-12">
                <Phone size={14} strokeWidth={2.4} />
              </span>
              {SITE.phone}
            </a>

            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full glass-warm text-espresso-deep shadow-lg shadow-espresso/5 lg:hidden"
            >
              {open ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay mobile plein écran */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center bg-grad-espresso"
        style={{ display: "none" }}
      >
        <nav aria-label="Navigation mobile" className="flex flex-col items-center gap-2">
          {LINKS.map((l, i) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="mobile-link font-display text-5xl font-bold text-cream-soft py-2 tracking-tight transition-colors hover:text-caramel-light"
            >
              <span className="mr-3 align-middle font-body text-xs font-medium tracking-[0.3em] text-caramel">
                0{i + 1}
              </span>
              {l.label}
            </button>
          ))}
        </nav>
        <a
          href={SITE.phoneHref}
          className="mobile-link mt-10 flex items-center gap-3 rounded-full bg-grad-caramel px-8 py-4 font-body text-lg font-semibold text-espresso-deep shadow-2xl shadow-caramel/25"
        >
          <Phone size={18} strokeWidth={2.4} /> {SITE.phone}
        </a>
        <p className="mobile-link mt-8 max-w-xs text-center font-body text-sm text-cream-soft/60">
          {SITE.address}
        </p>
      </div>
    </>
  );
}
