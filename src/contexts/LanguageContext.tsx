"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { detectLanguage, saveLanguagePreference, type Language, type Translations } from "@/lib/i18n";
import plTranslations from "@/i18n/pl.json";
import enTranslations from "@/i18n/en.json";

const translations: Record<Language, Translations> = {
  pl: plTranslations,
  en: enTranslations,
};

type LanguageContextType = {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pl");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // detect language on mount (client-side only)
    const detected = detectLanguage();
    setLanguageState(detected);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguagePreference(lang);
    // update html lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  // update html lang when language changes
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations: translations[language],
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

