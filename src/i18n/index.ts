import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Locale, Translations } from './types';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';

const translations: Record<Locale, Translations> = { en, fr, es };

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
};

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem('waggly_locale');
    if (stored && (stored === 'en' || stored === 'fr' || stored === 'es')) {
      return stored;
    }
  } catch {
    // ignore
  }
  return 'en';
}

/** Returns true when the user has already explicitly chosen a language. */
export function hasChosenLocale(): boolean {
  try {
    const stored = localStorage.getItem('waggly_locale');
    return stored === 'en' || stored === 'fr' || stored === 'es';
  } catch {
    return false;
  }
}

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: en,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('waggly_locale', newLocale);
    } catch {
      // ignore
    }
  }, []);

  const value: I18nContextValue = {
    locale,
    t: translations[locale],
    setLocale,
  };

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export type { Locale, Translations } from './types';
