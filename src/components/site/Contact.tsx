"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SITE, HOURS } from "@/lib/site-data";

const SUBJECTS = [
  "Contact général",
  "Traiteur — Demande de devis",
  "Commande à emporter",
  "Autre demande",
] as const;

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const todayJs = new Date().getDay();

  /* Pré-sélection du sujet depuis la section traiteur */
  useEffect(() => {
    const handler = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if (SUBJECTS.includes(value as (typeof SUBJECTS)[number])) {
        setSubject(value);
      }
    };
    window.addEventListener("cc:subject", handler);
    return () => window.removeEventListener("cc:subject", handler);
  }, []);

  /* Animations d'entrée */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-col",
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 72%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || sending) return;

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      subject,
      message: String(fd.get("message") || ""),
    };

    setSending(true);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setSent(true);
        form.reset();
        toast({
          title: "Message envoyé !",
          description: "Nous vous recontactons très vite. À tout à l'heure !",
        });
        gsap.fromTo(
          ".contact-success",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }
        );
        setTimeout(() => setSent(false), 6000);
      } else {
        const fieldErrors: Record<string, string> = {};
        if (data.details) {
          Object.entries(data.details).forEach(([k, v]) => {
            fieldErrors[k] = (v as string[])?.[0] ?? "Champ invalide";
          });
        }
        setErrors(fieldErrors);
        toast({
          title: "Oups…",
          description: data.error ?? "Vérifiez le formulaire et réessayez.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connexion impossible",
        description: `Appelez-nous au ${SITE.phone} — c'est plus rapide !`,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-espresso/15 bg-cream-soft px-4.5 py-3.5 px-4 font-body text-[15px] text-ink placeholder:text-mocha/70 outline-none transition-all duration-300 focus:border-caramel focus:ring-4 focus:ring-caramel/15";

  return (
    <section
      ref={rootRef}
      id="contact"
      className="relative overflow-hidden bg-cream py-28 md:py-36"
    >
      <div className="absolute -left-32 top-20 h-96 w-96 blob-d bg-sand/50 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 inline-block rounded-full bg-sand px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-espresso">
            Nous trouver
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-espresso-deep sm:text-5xl md:text-6xl">
            Passez nous <span className="text-caramel">voir</span>
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-cocoa">
            Une question, une envie, un événement à organiser ? Écrivez-nous ou
            appelez — on répond vite, et toujours avec le sourire.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Colonne infos */}
          <div className="contact-col space-y-5">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-[1.6rem] border border-espresso/8 bg-cream-soft p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-caramel/40 hover:shadow-lg hover:shadow-caramel/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-grad-caramel text-espresso-deep">
                <MapPin size={19} aria-hidden="true" />
              </span>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-mocha">
                  Adresse
                </p>
                <p className="mt-0.5 font-body text-[15px] font-medium text-espresso-deep">
                  {SITE.address}
                </p>
                <p className="mt-1 font-body text-xs font-medium text-caramel group-hover:underline">
                  Ouvrir dans Google Maps
                </p>
              </div>
            </a>

            <a
              href={SITE.phoneHref}
              className="flex items-start gap-4 rounded-[1.6rem] border border-espresso/8 bg-cream-soft p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-caramel/40 hover:shadow-lg hover:shadow-caramel/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-grad-caramel text-espresso-deep">
                <Phone size={19} aria-hidden="true" />
              </span>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-mocha">
                  Téléphone
                </p>
                <p className="mt-0.5 font-body text-[15px] font-medium text-espresso-deep">
                  {SITE.phone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${SITE.email}`}
              className="flex items-start gap-4 rounded-[1.6rem] border border-espresso/8 bg-cream-soft p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-caramel/40 hover:shadow-lg hover:shadow-caramel/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-grad-caramel text-espresso-deep">
                <Mail size={19} aria-hidden="true" />
              </span>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-mocha">
                  Email
                </p>
                <p className="mt-0.5 font-body text-[15px] font-medium text-espresso-deep">
                  {SITE.email}
                </p>
              </div>
            </a>

            {/* Horaires */}
            <div className="rounded-[1.6rem] border border-espresso/8 bg-cream-soft p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-grad-espresso text-cream-soft">
                  <Clock size={19} aria-hidden="true" />
                </span>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-mocha">
                  Horaires d&apos;ouverture
                </p>
              </div>
              <ul className="mt-4 divide-y divide-espresso/6">
                {HOURS.map((h) => {
                  const isToday = h.jsDay === todayJs;
                  return (
                    <li
                      key={h.day}
                      className={`flex items-center justify-between py-2.5 font-body text-sm ${
                        isToday ? "font-semibold" : ""
                      }`}
                    >
                      <span className={isToday ? "text-caramel" : "text-cocoa"}>
                        {h.day}
                        {isToday && (
                          <span className="ml-2 rounded-full bg-caramel/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-caramel">
                            Aujourd&apos;hui
                          </span>
                        )}
                      </span>
                      <span className={h.hours === "Fermé" ? "text-paprika/80" : isToday ? "text-espresso-deep" : "text-cocoa"}>
                        {h.hours}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Carte Google Maps */}
            <div className="mask-blob overflow-hidden border-4 border-cream-soft shadow-lg shadow-espresso/10">
              <iframe
                title="Carte — Café Concept, 502 Avenue des Meuniers, Moissy-Cramayel"
                src={SITE.mapsEmbed}
                width="600"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-56 w-full grayscale-[35%] sepia-[18%]"
                allowFullScreen
              />
            </div>
          </div>

          {/* Colonne formulaire */}
          <div className="contact-col">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="relative overflow-hidden rounded-[2rem] border border-espresso/8 bg-cream-soft p-7 shadow-xl shadow-espresso/8 md:p-9"
            >
              <div className="absolute -right-14 -top-14 h-40 w-40 blob-a bg-sand/50" aria-hidden="true" />

              <h3 className="relative font-display text-2xl font-bold text-espresso-deep">
                Envoyez-nous un message
              </h3>
              <p className="relative mt-1.5 font-body text-sm text-mocha">
                Réponse sous 24h — devis traiteur gratuit.
              </p>

              <div className="relative mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-cocoa">
                    Nom *
                  </label>
                  <input id="name" name="name" type="text" required placeholder="Votre nom" className={inputCls} />
                  {errors.name && <p className="mt-1 font-body text-xs text-paprika">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-cocoa">
                    Téléphone *
                  </label>
                  <input id="phone" name="phone" type="tel" required placeholder="06 12 34 56 78" className={inputCls} />
                  {errors.phone && <p className="mt-1 font-body text-xs text-paprika">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-cocoa">
                    Email *
                  </label>
                  <input id="email" name="email" type="email" required placeholder="vous@exemple.fr" className={inputCls} />
                  {errors.email && <p className="mt-1 font-body text-xs text-paprika">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <span className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-cocoa">
                    Sujet *
                  </span>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Sujet du message">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={subject === s}
                        onClick={() => setSubject(s)}
                        className={`rounded-full px-4 py-2 font-body text-[13px] font-medium transition-all duration-300 ${
                          subject === s
                            ? "bg-grad-espresso text-cream-soft shadow-md shadow-espresso/20"
                            : "bg-cream text-cocoa hover:bg-sand"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-cocoa">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={
                      subject.startsWith("Traiteur")
                        ? "Type d'événement, date souhaitée, nombre de personnes, envies…"
                        : "Votre message…"
                    }
                    className={`${inputCls} resize-none`}
                  />
                  {errors.message && <p className="mt-1 font-body text-xs text-paprika">{errors.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="relative mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-grad-caramel py-4 font-body text-base font-semibold text-espresso-deep shadow-lg shadow-caramel/25 transition-all duration-300 hover:shadow-xl hover:shadow-caramel/40 disabled:opacity-70"
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Message bien reçu !
                  </>
                ) : sending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send size={17} aria-hidden="true" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
