// i18n utility — browser detection + manual override
import plTranslations from "@/i18n/pl.json";
import enTranslations from "@/i18n/en.json";

export type Language = "pl" | "en";

export type Translations = typeof plTranslations;

const translations: Record<Language, Translations> = {
  pl: plTranslations,
  en: enTranslations,
};

// detect browser language, fallback to pl
export function detectLanguage(): Language {
  if (typeof window === "undefined") return "pl"; // SSR fallback

  // check localStorage first (user preference)
  const stored = localStorage.getItem("pcstyle-language") as Language | null;
  if (stored && (stored === "pl" || stored === "en")) {
    return stored;
  }

  // detect from browser
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("en")) {
    return "en";
  }
  return "pl"; // default
}

// get translations for current language
export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

// save language preference
export function saveLanguagePreference(lang: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("pcstyle-language", lang);
  }
}

