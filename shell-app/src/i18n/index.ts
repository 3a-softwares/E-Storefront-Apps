/**
 * Internationalization (i18n) Configuration
 * Provides translation support for the shell-app
 */

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import hi from './locales/hi.json';

export type Language = 'en' | 'es' | 'fr' | 'pt' | 'hi';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export const DEFAULT_LANGUAGE: Language = 'en';

const translations: Record<Language, typeof en> = {
  en,
  es,
  fr,
  pt,
  hi,
};

/**
 * Get the translation object for a specific language
 */
export function getTranslations(language: Language): typeof en {
  return translations[language] || translations[DEFAULT_LANGUAGE];
}

/**
 * Interpolate variables in translation strings
 * Example: "Hello {{name}}" with { name: "John" } => "Hello John"
 */
export function interpolate(text: string, variables: Record<string, string | number>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key]?.toString() ?? `{{${key}}}`;
  });
}

/**
 * Get a nested translation value using dot notation
 * Example: t('features.adminPortal.title') => "Admin Portal"
 */
export function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the path if translation not found
    }
  }

  return typeof current === 'string' ? current : path;
}

/**
 * Detect browser language and return supported language code
 */
export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const browserLang = navigator.language.split('-')[0].toLowerCase();

  if (SUPPORTED_LANGUAGES.some((lang) => lang.code === browserLang)) {
    return browserLang as Language;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Get language from localStorage or browser preference
 */
export function getSavedLanguage(): Language {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const saved = localStorage.getItem('language') as Language | null;

  if (saved && SUPPORTED_LANGUAGES.some((lang) => lang.code === saved)) {
    return saved;
  }

  return detectBrowserLanguage();
}

/**
 * Save language preference to localStorage
 */
export function saveLanguage(language: Language): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('language', language);
  }
}

export { en, es, fr, pt, hi };
