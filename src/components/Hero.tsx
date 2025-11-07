"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { ContactModal } from "@/components/ContactModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Github,
  Mail,
  Sparkles,
  Zap,
  Code2,
  Brain,
  Palette,
  MessageCircle,
  Facebook,
  CalendarClock,
} from "lucide-react";

type HeroFact = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

function drawBanner(text: string) {
  // tak, to jest tylko ozdoba, ale vibe > purity
  return `▮ ${text.toUpperCase()} ▮`;
}

function clearBuffer() {
  // udajemy że to robi mega dużo, wink ;)
  return undefined;
}

function ctaMatrix() {
  // mini helper bo grid mi jeździł jak pijany // serio
  return "grid w-full gap-4 text-sm min-[520px]:grid-cols-2 xl:grid-cols-4";
}

export function Hero() {
  clearBuffer();

  const { translations, language } = useLanguage();
  const pulse = useMotionValue(0);
  const shadow = useTransform(pulse, (val) => `drop-shadow(10px 10px 0 rgba(0,0,0,${val}))`);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const minimizeMotion = prefersReducedMotion || isMobile;
  const [showNotification, setShowNotification] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const heroFacts: HeroFact[] = [
    { label: translations.hero.facts.age.label, value: translations.hero.facts.age.value, icon: Sparkles },
    { label: translations.hero.facts.major.label, value: translations.hero.facts.major.value, icon: Brain },
    { label: translations.hero.facts.mix.label, value: translations.hero.facts.mix.value, icon: Palette },
  ];

  // copy discord username
  const handleDiscordClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(translations.hero.discordCopyText);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    // quick sanity ping — hej, działa
    console.info("pcstyle intro bootuje się // spoko");
  }, []);

  return (
    <motion.section
      id="intro"
      aria-labelledby="hero-heading"
      initial={minimizeMotion ? false : { opacity: 0, y: 120, rotateX: -12 }}
      animate={minimizeMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
      transition={minimizeMotion ? { duration: 0.2 } : { type: "spring", stiffness: 120, damping: 16 }}
      className="relative flex w-full flex-col gap-12 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper)] p-12 brutal-border brutal-shadow noisy-paper text-[color:var(--color-ink)]"
    >
      <motion.span
        className="inline-block text-xs uppercase tracking-[0.4em] text-[color:var(--color-magenta)]"
        initial={minimizeMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          minimizeMotion ? { duration: 0.2 } : { delay: 0.2, type: "spring", stiffness: 220, damping: 18 }
        }
      >
        {drawBanner(translations.hero.banner)}
      </motion.span>

      <div className="flex flex-wrap items-end gap-6">
        <motion.h1
          id="hero-heading"
          className="neo-pulse text-balance text-[clamp(3.8rem,9vw,8.5rem)] font-black uppercase leading-[0.85]"
          whileHover={minimizeMotion ? undefined : { rotate: -1.5, scale: 1.02 }}
        >
          <motion.span
            className="block text-[color:var(--color-ink)]"
            whileHover={
              minimizeMotion
                ? undefined
                : { color: "var(--color-magenta)", textShadow: "6px 6px 0 var(--color-magenta)" }
            }
            transition={minimizeMotion ? { duration: 0.2 } : { type: "spring", stiffness: 180, damping: 20 }}
          >
            pcstyle
          </motion.span>
        </motion.h1>
        <motion.div
          className="flex max-w-sm flex-col gap-3 text-sm sm:text-base"
          initial={minimizeMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimizeMotion ? { duration: 0.2 } : { delay: 0.25, duration: 0.5 }}
        >
          <p className="font-medium uppercase tracking-wide text-[color:var(--color-ink)]">{translations.hero.name}</p>
          <p className="text-pretty text-[color:var(--color-ink)]/90">
            {translations.hero.description}
          </p>
        </motion.div>
      </div>

      <motion.ul
        key={`facts-${language}`}
        className="flex flex-wrap gap-4 text-xs sm:text-sm"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.08, delayChildren: 0.3 },
          },
        }}
      >
        {heroFacts.map((fact) => {
          const Icon = fact.icon;
          return (
            <motion.li
              key={fact.label}
              className="relative z-10 flex items-start gap-3 brutal-border brutal-shadow bg-[var(--color-paper)] px-4 py-3 font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              whileHover={minimizeMotion ? undefined : { rotate: 2.5, scale: 1.05 }}
            >
              <Icon className="h-5 w-5 text-[var(--color-magenta)]" />
              <div>
                <span className="block text-[0.65em] opacity-60">{fact.label}</span>
                <span className="block">{fact.value}</span>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      <div className="flex flex-col gap-6 text-sm">
        <motion.div
          className={ctaMatrix()}
          initial={minimizeMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={minimizeMotion ? { duration: 0.2 } : { delay: 0.35, duration: 0.5 }}
        >
          <motion.button
            onClick={() => setShowContactModal(true)}
            className="relative flex w-full items-center justify-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-magenta)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[6px_6px_0_var(--color-ink)] cursor-pointer transition-all hover:bg-[var(--color-cyan)] hover:text-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-ink)]"
            whileHover={minimizeMotion ? undefined : { scale: 1.05, rotate: -1 }}
            whileTap={minimizeMotion ? undefined : { scale: 0.95 }}
            transition={minimizeMotion ? { duration: 0.1 } : { type: "spring", stiffness: 200 }}
          >
            <MessageCircle className="h-4 w-4" />
            {translations.hero.contactMe}
          </motion.button>
          <MagneticButton
            className="flex w-full items-center justify-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)] px-6 py-3 font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] transition-colors hover:bg-[var(--color-paper)] hover:text-[color:var(--color-magenta)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-magenta)]"
            strength={0.2}
            onClick={() => {
              const section = document.getElementById("projects");
              section?.scrollIntoView({ behavior: minimizeMotion ? "auto" : "smooth" });
            }}
          >
            <Code2 className="h-4 w-4" />
            {translations.hero.seeProjects}
          </MagneticButton>
          <motion.a
            href="mailto:adamkrupa@tuta.io?subject=Hello%20from%20pcstyle.dev"
            className="flex w-full items-center justify-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)] px-6 py-3 font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] transition-colors hover:bg-[var(--color-magenta)] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-magenta)]"
            target="_blank"
            rel="noreferrer noopener"
            whileHover={minimizeMotion ? undefined : { scale: 1.05, rotate: -1 }}
            whileTap={minimizeMotion ? undefined : { scale: 0.95 }}
            aria-label={translations.hero.sendEmail}
          >
            <Mail className="h-4 w-4" />
            {translations.hero.sendEmail}
          </motion.a>
          <motion.a
            href="https://cal.com/pcstyle"
            className="flex w-full items-center justify-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)] px-6 py-3 font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] transition-colors hover:bg-[var(--color-cyan)] hover:text-[color:var(--color-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-cyan)]"
            target="_blank"
            rel="noreferrer noopener"
            whileHover={minimizeMotion ? undefined : { scale: 1.05, rotate: 1 }}
            whileTap={minimizeMotion ? undefined : { scale: 0.95 }}
            aria-label={translations.hero.bookCall}
          >
            <CalendarClock className="h-4 w-4" />
            {translations.hero.bookCall}
          </motion.a>
        </motion.div>

        {/* social links z ikonami — actual working links */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={minimizeMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={minimizeMotion ? { duration: 0.2 } : { delay: 0.5, duration: 0.4 }}
        >
          <motion.a
            href="https://github.com/pcstyle"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="brutal-border brutal-shadow grid size-12 place-items-center rounded-full bg-[var(--color-paper)] transition-colors hover:bg-[var(--color-ink)] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-ink)]"
            whileHover={minimizeMotion ? undefined : { scale: 1.05, rotate: -1.5 }}
          >
            <Github className="h-5 w-5" />
          </motion.a>
          <motion.a
            href="https://www.facebook.com/adam.krupa.771/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="brutal-border brutal-shadow grid size-12 place-items-center rounded-full bg-[var(--color-paper)] transition-colors hover:bg-[#1877F2] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1877F2]"
            whileHover={minimizeMotion ? undefined : { scale: 1.05, rotate: 1.5 }}
          >
            <Facebook className="h-5 w-5" />
          </motion.a>
          <motion.button
            onClick={handleDiscordClick}
            aria-label="Copy Discord handle"
            className="brutal-border brutal-shadow grid size-12 place-items-center rounded-full bg-[var(--color-paper)] transition-colors hover:bg-[#5865F2] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#5865F2]"
            whileHover={minimizeMotion ? undefined : { scale: 1.05, rotate: -1 }}
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute -right-16 -top-20 hidden aspect-square w-48 rotate-6 border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] brutal-shadow md:block grid place-items-center"
        initial={minimizeMotion ? false : { scale: 0, rotate: -40 }}
        animate={minimizeMotion ? { opacity: 0.8 } : { scale: 1, rotate: 6 }}
        transition={minimizeMotion ? { duration: 0.2 } : { delay: 0.4, type: "spring", stiffness: 160 }}
      >
        <Sparkles className="h-20 w-20 text-[var(--color-ink)] opacity-30" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -bottom-16 left-8 hidden h-32 w-32 -rotate-3 border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] brutal-shadow sm:block grid place-items-center"
        initial={minimizeMotion ? false : { y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={minimizeMotion ? { duration: 0.2 } : { delay: 0.55, type: "spring", stiffness: 140 }}
        style={{ filter: shadow }}
        onMouseEnter={() => pulse.set(0.4)}
        onMouseLeave={() => pulse.set(0)}
      >
        <Zap className="h-16 w-16 text-[var(--color-ink)] opacity-30" />
      </motion.div>

      {/* notification popup dla discord copy */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed bottom-8 right-8 z-50 brutal-border brutal-shadow bg-[var(--color-paper)] px-6 py-4 text-sm font-semibold uppercase tracking-wider"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="h-3 w-3 rounded-full bg-[var(--color-magenta)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <span className="text-[var(--color-ink)]">
                {translations.hero.discordCopied}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </motion.section>
  );
}
