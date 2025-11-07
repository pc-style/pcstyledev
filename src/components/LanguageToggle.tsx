"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "pl" ? "en" : "pl");
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] transition-colors hover:bg-[var(--color-magenta)] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-magenta)]"
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch language to ${language === "pl" ? "English" : "Polish"}`}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "pl" ? "EN" : "PL"}</span>
    </motion.button>
  );
}

