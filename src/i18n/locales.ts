// src/i18n/locales.ts
export const LOCALES = ['en', 'fr', 'es', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  nl: 'Nederlands',
};

// Optional: metadata you might need later (flags, dir, etc.)
export const LOCALE_META: Record<Locale, { label: string; dir: 'ltr' | 'rtl'; flag?: string }> = {
  en: { label: 'English', dir: 'ltr', flag: '🇬🇧' },
  fr: { label: 'Français', dir: 'ltr', flag: '🇫🇷' },
  es: { label: 'Español', dir: 'ltr', flag: '🇪🇸' },
  nl: { label: 'Nederlands', dir: 'ltr', flag: '🇳🇱' },
};

// Small helper to keep call sites tidy
export const getLocaleLabel = (l: Locale) => LOCALE_LABELS[l];
