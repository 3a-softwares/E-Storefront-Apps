import React, { useEffect, useState, Suspense } from 'react';
import { clearAuth, getCurrentUser } from '@3asoftwares/utils/client';
import { Modal, ToasterBox } from '@3asoftwares/ui';
import { useUIStore } from './store/uiStore';
import { useTokenValidator } from './store/useTokenValidator';
import { changeTheme, renderApp, MFE_CONFIG, ActiveApp } from './utils';
import { I18nProvider, useTranslation } from './i18n/I18nContext';
import { LanguageSelector } from './components/LanguageSelector';
import { IframeContainer } from './components/IframeContainer';
import { Header } from './components/Header';

console.log('NODE_ENV:', process.env.NODE_ENV);

const Footer = React.lazy(() =>
  import('./components/Footer').then((m) => ({ default: (m as any).Footer ?? (m as any).default }))
);
const WelcomePage = React.lazy(() =>
  import('./components/WelcomePage').then((m) => ({
    default: (m as any).WelcomePage ?? (m as any).default,
  }))
) as React.LazyExoticComponent<
  React.ComponentType<{
    onSignupClick: () => void;
    onLoginClick: () => void;
  }>
>;
const AuthForm = React.lazy(() =>
  import('./components/AuthForm').then((m) => ({
    default: (m as any).AuthForm ?? (m as any).default,
  }))
) as React.LazyExoticComponent<
  React.ComponentType<{
    initialMode: 'login' | 'signup';
    setAuthMode: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
    onSuccess: () => void;
  }>
>;

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const { t } = useTranslation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showToaster, setShowToaster] = useState(false);
  const [user, setUser] = useState<{ name: string } | undefined>(undefined);
  const [activeApp, setActiveApp] = useState<ActiveApp>(null);

  // Periodically validate token to implement sliding expiration
  useTokenValidator((updatedUser) => {
    if (updatedUser) {
      setUser({ name: updatedUser.name || updatedUser.email || 'User' });
    }
  });

  // Check user login status
  const checkUser = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({ name: currentUser.name || currentUser.email || 'User' });
    } else {
      setUser(undefined);
    }
  };

  const verifyLogin = () => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role) {
      renderApp(currentUser.role, setActiveApp);
      return true;
    }
    return false;
  };

  const login = () => {
    const isLogin = verifyLogin();
    if (!isLogin) {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  const signup = () => {
    const isLogin = verifyLogin();
    if (!isLogin) {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setUser(undefined);
    setActiveApp(null);
    window.location.reload();
  };

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  useEffect(() => {
    checkUser();
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
      clearAuth();
      setUser(undefined);
    }
    // Open auth modal for reset-password URL
    if (window.location.pathname === '/reset-password' && params.get('token')) {
      setAuthMode('login');
      setShowAuthModal(true);
    }
    // Open auth modal for external app login request (e.g., support-app)
    const returnTo = params.get('returnTo');
    const appType = params.get('app');
    if (returnTo && appType) {
      // Store returnTo URL in sessionStorage for use after login
      sessionStorage.setItem('auth_returnTo', returnTo);
      sessionStorage.setItem('auth_app', appType);
      setAuthMode('login');
      setShowAuthModal(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Embedded Apps via Iframe */}
      {activeApp === 'support' && (
        <IframeContainer
          src={MFE_CONFIG.supportAppUrl}
          title="Support Portal"
          onClose={() => setActiveApp(null)}
        />
      )}

      {!activeApp && (
        <>
          <Header
            onLoginClick={login}
            onSignupClick={signup}
            onBackToHome={handleLogout}
            activeApp={activeApp}
          />
          <div className="flex flex-1">
            <main className="flex-1">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                }
              >
                <WelcomePage onSignupClick={signup} onLoginClick={login} />
              </Suspense>
            </main>
          </div>
          <Suspense fallback={<div />}>
            <Footer />
          </Suspense>
        </>
      )}

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authMode === 'login' ? t('auth.login') : t('auth.signUp')}
        size="md"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          }
        >
          <AuthForm
            initialMode={authMode}
            setAuthMode={setAuthMode}
            onSuccess={() => setShowAuthModal(false)}
          />
        </Suspense>
      </Modal>

      {showToaster && (
        <ToasterBox
          message={t('auth.sessionExpired')}
          type="error"
          onClose={() => setShowToaster(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};

export default App;
