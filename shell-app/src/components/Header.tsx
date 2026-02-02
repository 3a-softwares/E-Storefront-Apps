import React from 'react';
import { useUIStore } from '../store/uiStore';
import { clearAuth, getCurrentUser } from '@3asoftwares/utils/client';
import { Header as UIHeader } from '@3asoftwares/ui';
import { useLanguage } from '../i18n/I18nContext';
import { Language } from '../i18n';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onBackToHome?: () => void;
  activeApp?: 'admin' | 'seller' | null;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onSignupClick,
  onBackToHome,
  activeApp,
}) => {
  const { theme, toggleTheme } = useUIStore();
  const { language, setLanguage } = useLanguage();

  const user = getCurrentUser();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    clearAuth();
    if (onBackToHome) {
      onBackToHome();
    }
    window.location.reload();
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };

  // Get app title based on active app
  const getAppName = () => {
    if (activeApp === 'admin') return 'Admin Dashboard';
    if (activeApp === 'seller') return 'Seller Portal';
    return '3A Softwares';
  };

  // Build extra content for back button when in embedded app
  const extraContent = activeApp && onBackToHome ? (
    <button
      onClick={onBackToHome}
      className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="hidden sm:inline">Back</span>
    </button>
  ) : undefined;

  return (
    <UIHeader
      user={isLoggedIn && user ? { name: user.name || user.email || 'User' } : undefined}
      onLogin={onLoginClick}
      onLogout={handleLogout}
      onCreateAccount={onSignupClick}
      appName={getAppName()}
      theme={theme}
      onToggleTheme={toggleTheme}
      showThemeToggle={true}
      showLanguageSelector={true}
      language={language}
      onLanguageChange={handleLanguageChange}
      extraContent={extraContent}
      languageOptions={[
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'Hindi' },
        { value: 'es', label: 'Spanish' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'fr', label: 'French' },
      ]}
    />
  );
};
