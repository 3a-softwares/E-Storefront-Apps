import React from 'react';
import { useTranslation } from '../i18n/I18nContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 mt-auto">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
            {t('footer.copyright', { year: currentYear.toString() })}
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400">
              {t('footer.privacy')}
            </a>
            <a href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400">
              {t('footer.terms')}
            </a>
            <a href="/help" className="hover:text-primary-600 dark:hover:text-primary-400">
              {t('footer.help')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
