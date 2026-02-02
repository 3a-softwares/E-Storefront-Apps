/**
 * i18n React Context and Hooks
 * Provides React integration for internationalization
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
    Language,
    DEFAULT_LANGUAGE,
    getTranslations,
    getNestedValue,
    interpolate,
    getSavedLanguage,
    saveLanguage,
    SUPPORTED_LANGUAGES,
    LanguageOption,
} from './index';
import en from './locales/en.json';

type TranslationType = typeof en;

interface I18nContextValue {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, variables?: Record<string, string | number>) => string;
    translations: TranslationType;
    supportedLanguages: LanguageOption[];
    isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
    children: React.ReactNode;
    defaultLanguage?: Language;
}

/**
 * I18n Provider Component
 * Wrap your app with this provider to enable translations
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
    children,
    defaultLanguage,
}) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return defaultLanguage || getSavedLanguage();
    });

    const translations = useMemo(() => getTranslations(language), [language]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        saveLanguage(lang);

        // Update document lang attribute for accessibility
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
            // Set direction (currently all supported languages are LTR)
            document.documentElement.dir = 'ltr';
        }
    }, []);

    // Set initial document language
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    /**
     * Translation function
     * @param key - Dot-notation key (e.g., 'header.title')
     * @param variables - Optional variables for interpolation
     */
    const t = useCallback(
        (key: string, variables?: Record<string, string | number>): string => {
            const value = getNestedValue(translations, key);

            if (variables) {
                return interpolate(value, variables);
            }

            return value;
        },
        [translations]
    );

    // Currently all supported languages are LTR
    const isRTL = false;

    const contextValue = useMemo<I18nContextValue>(
        () => ({
            language,
            setLanguage,
            t,
            translations,
            supportedLanguages: SUPPORTED_LANGUAGES,
            isRTL,
        }),
        [language, setLanguage, t, translations, isRTL]
    );

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
};

/**
 * Hook to access i18n context
 */
export function useI18n(): I18nContextValue {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }

    return context;
}

/**
 * Hook to get just the translation function
 * Useful for components that only need translations
 */
export function useTranslation() {
    const { t, language } = useI18n();
    return { t, language };
}

/**
 * Hook to get and set the current language
 */
export function useLanguage() {
    const { language, setLanguage, supportedLanguages } = useI18n();
    return { language, setLanguage, supportedLanguages };
}

export { I18nContext };
