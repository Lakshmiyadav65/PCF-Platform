import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import hi from "./locales/hi.json";
import de from "./locales/de.json";
import zh from "./locales/zh.json";

// Languages offered in the questionnaire language switcher. English is the
// source language (the keys themselves), so it needs no resource bundle.
export const SUPPORTED_LANGUAGES: { code: string; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
];

export const LANGUAGE_STORAGE_KEY = "pcf_lang";

// English source strings are used directly as i18next keys (keySeparator /
// nsSeparator disabled so sentences containing "." and ":" are literal keys).
// Any key missing from a bundle falls back to English automatically.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      hi: { translation: hi as Record<string, string> },
      de: { translation: de as Record<string, string> },
      zh: { translation: zh as Record<string, string> },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "de", "zh"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    keySeparator: false,
    nsSeparator: false,
    returnNull: false,
    interpolation: { escapeValue: false },
    detection: {
      // Only honour an explicit saved choice; otherwise default to English
      // (we intentionally do NOT auto-detect from the browser language).
      order: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

export default i18n;
