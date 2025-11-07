"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

type LanguageToggleProps = {
  compact?: boolean;
};

function pickButtonStyles(compact: boolean | undefined) {
  // mini helper bo w mobile wszystko chce się rozjechać, chillujemy literki
  const base =
    "flex items-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] transition-colors hover:bg-[var(--color-magenta)] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-magenta)]";
  if (!compact) return `${base} px-4 py-2 text-xs`;
  return `${base} px-3 py-2 text-[0.7rem] tracking-[0.16em] shadow-[4px_4px_0_var(--color-ink)] sm:px-4 sm:text-xs`;
}

export function LanguageToggle({ compact }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
      // sorry future me, taki switch jest szybki jak espresso
    setLanguage(language === "pl" ? "en" : "pl");
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className={pickButtonStyles(compact)}
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch language to ${language === "pl" ? "English" : "Polish"}`}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "pl" ? "EN" : "PL"}</span>
    </motion.button>
  );
}

