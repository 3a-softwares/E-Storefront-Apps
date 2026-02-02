/**
 * Language Selector Component
 * Dropdown to select the application language
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/I18nContext';
import { Language } from '../i18n';

interface LanguageSelectorProps {
    className?: string;
    showLabel?: boolean;
    compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    className = '',
    showLabel = false,
    compact = false,
}) => {
    const { language, setLanguage, supportedLanguages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = supportedLanguages.find((l) => l.code === language);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleLanguageSelect = (langCode: Language) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
          ${compact ? 'text-sm' : 'text-base'}
        `}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
            >
                <span className="text-lg" role="img" aria-label={currentLanguage?.name}>
                    {currentLanguage?.flag}
                </span>
                {!compact && (
                    <span className="text-gray-700 dark:text-gray-200">
                        {showLabel ? currentLanguage?.nativeName : currentLanguage?.code.toUpperCase()}
                    </span>
                )}
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className={`
            absolute z-50 mt-1 ${compact ? 'right-0' : 'left-0'}
            min-w-[180px] py-1
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            animate-in fade-in slide-in-from-top-1 duration-200
          `}
                    role="listbox"
                    aria-label="Available languages"
                >
                    {supportedLanguages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`
                w-full flex items-center gap-3 px-4 py-2.5
                text-left text-sm
                hover:bg-gray-100 dark:hover:bg-gray-700
                focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
                transition-colors duration-150
                ${language === lang.code
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-200'
                                }
              `}
                            role="option"
                            aria-selected={language === lang.code}
                        >
                            <span className="text-lg" role="img" aria-label={lang.name}>
                                {lang.flag}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-medium">{lang.nativeName}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {lang.name}
                                </span>
                            </div>
                            {language === lang.code && (
                                <svg
                                    className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
