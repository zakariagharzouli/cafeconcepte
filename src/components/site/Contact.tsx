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
        { y: 44, opacity: 0 },
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
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
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
    "w-full rounded-xl border border-espresso/15 bg-transparent px-4 py-3.5 font-body text-[15px] font-light text-ink placeholder:text-mocha/60 outline-none transition-all duration-300 focus:border-caramel focus:ring-4 focus:ring-caramel/10";

  return (
    <section
      ref={rootRef}
      id="contact"
      className="relative overflow-hidden bg-cream py-28 md:py-36"
    >
      <div
        className="absolute -left-32 top-20 h-80 w-80 blob-d bg-sand/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        {/* En-tête */}
        <div className="contact-col mb-16 max-w-2xl">
          <p className="micro-caps mb-6 flex items-center gap-4 text-caramel">
            <span className="inline-block h-px w-10 bg-caramel/60" aria-hidden="true" />
            Nous trouver
          </p>
          <h2 className="display-light text-4xl leading-[1.08] text-espresso-deep sm:text-5xl md:text-[3.4rem]">
            Passez nous <span className="text-caramel">voir</span>
          </h2>
          <p className="mt-5 max-w-lg font-body text-[15px] font-light leading-[1.75] text-cocoa">
            Une question, une envie, un événement à organiser ? Écrivez-nous ou
            appelez — on répond vite, et toujours avec le sourire.
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Colonne infos — liste sur filets */}
          <div className="contact-col">
            <ul className="divide-y divide-espresso/10 border-y border-espresso/10">
              <li>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="flex items-center gap-4">
                    <MapPin size={17} strokeWidth={1.6} className="shrink-0 text-caramel" aria-hidden="true" />
                    <span>
                      <span className="micro-caps block text-mocha">Adresse</span>
                      <span className="mt-1 block font-body text-[15px] font-light text-espresso-deep">
                        {SITE.address}
                      </span>
                    </span>
                  </span>
                  <span className="font-body text-xs font-light text-caramel opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Maps →
                  </span>
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-4 py-5 transition-colors duration-300 hover:text-caramel">
                  <Phone size={17} strokeWidth={1.6} className="shrink-0 text-caramel" aria-hidden="true" />
                  <span>
                    <span className="micro-caps block text-mocha">Téléphone</span>
                    <span className="mt-1 block font-body text-[15px] font-light text-espresso-deep">
                      {SITE.phone}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 py-5 transition-colors duration-300 hover:text-caramel">
                  <Mail size={17} strokeWidth={1.6} className="shrink-0 text-caramel" aria-hidden="true" />
                  <span>
                    <span className="micro-caps block text-mocha">Email</span>
                    <span className="mt-1 block font-body text-[15px] font-light text-espresso-deep">
                      {SITE.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>

            {/* Horaires */}
            <div className="mt-9">
              <p className="micro-caps mb-3 flex items-center gap-3 text-mocha">
                <Clock size={15} strokeWidth={1.6} className="text-caramel" aria-hidden="true" />
                Horaires d&rsquo;ouverture
              </p>
              <ul className="divide-y divide-espresso/8">
                {HOURS.map((h) => {
                  const isToday = h.jsDay === todayJs;
                  return (
                    <li
                      key={h.day}
                      className={`flex items-center justify-between py-2.5 font-body text-sm font-light ${
                        isToday ? "text-espresso-deep" : "text-cocoa"
                      }`}
                    >
                      <span>
                        {h.day}
                        {isToday && (
                          <span className="ml-3 rounded-full border border-caramel/40 px-2 py-0.5 text-[9px] font-normal uppercase tracking-[0.18em] text-caramel">
                            Aujourd&rsquo;hui
                          </span>
                        )}
                      </span>
                      <span className={h.hours === "Fermé" ? "text-paprika/80" : ""}>
                        {h.hours}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Carte Google Maps */}
            <div className="mt-9 overflow-hidden rounded-[1.6rem] border border-espresso/10 shadow-sm shadow-espresso/8">
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
              className="relative rounded-[1.6rem] border border-espresso/10 bg-cream-soft p-7 shadow-lg shadow-espresso/6 md:p-10"
            >
              <h3 className="display-light text-2xl text-espresso-deep md:text-[1.7rem]">
                Envoyez-nous un message
              </h3>
              <p className="mt-2 font-body text-sm font-light text-mocha">
                Réponse sous 24h — devis traiteur gratuit.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="micro-caps mb-2 block text-cocoa">
                    Nom *
                  </label>
                  <input id="name" name="name" type="text" required placeholder="Votre nom" className={inputCls} />
                  {errors.name && <p className="mt-1.5 font-body text-xs font-light text-paprika">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="micro-caps mb-2 block text-cocoa">
                    Téléphone *
                  </label>
                  <input id="phone" name="phone" type="tel" required placeholder="06 12 34 56 78" className={inputCls} />
                  {errors.phone && <p className="mt-1.5 font-body text-xs font-light text-paprika">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="micro-caps mb-2 block text-cocoa">
                    Email *
                  </label>
                  <input id="email" name="email" type="email" required placeholder="vous@exemple.fr" className={inputCls} />
                  {errors.email && <p className="mt-1.5 font-body text-xs font-light text-paprika">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <span className="micro-caps mb-2 block text-cocoa">Sujet *</span>
                  <div className="flex flex-wrap gap-x-6 gap-y-2.5" role="radiogroup" aria-label="Sujet du message">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={subject === s}
                        onClick={() => setSubject(s)}
                        className={`relative py-1 font-body text-[13.5px] font-light transition-colors duration-300 ${
                          subject === s ? "text-espresso-deep" : "text-espresso/45 hover:text-espresso"
                        }`}
                      >
                        {s}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-caramel transition-transform duration-300 ${
                            subject === s ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="micro-caps mb-2 block text-cocoa">
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
                  {errors.message && <p className="mt-1.5 font-body text-xs font-light text-paprika">{errors.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="contact-success mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-espresso-deep py-4 font-body text-[15px] font-light text-cream-soft transition-all duration-300 hover:bg-espresso disabled:opacity-70"
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={17} strokeWidth={1.8} aria-hidden="true" />
                    Message bien reçu !
                  </>
                ) : sending ? (
                  <>
                    <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send size={16} strokeWidth={1.8} aria-hidden="true" />
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
