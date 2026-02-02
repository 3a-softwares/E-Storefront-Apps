import {
  getCurrentUser,
  ADMIN_APP_URL,
  SELLER_APP_URL,
  SUPPORT_APP_URL,
} from '@3asoftwares/utils/client';

// Configuration for micro-frontend mode
export const MFE_CONFIG = {
  useMicroFrontends: true,
  adminAppUrl: process.env.ADMIN_APP_URL || ADMIN_APP_URL,
  sellerAppUrl: process.env.SELLER_APP_URL || SELLER_APP_URL,
  supportAppUrl: process.env.SUPPORT_APP_URL || SUPPORT_APP_URL || 'http://localhost:3003',
};

export type ActiveApp = 'admin' | 'seller' | 'support' | null;

export const renderApp = (role: string, setActiveApp?: (app: ActiveApp) => void) => {
  const user = getCurrentUser();
  const userId = user?._id || user?.id || '';

  // If MFE mode is enabled and we have a state setter, use embedded mode
  if (MFE_CONFIG.useMicroFrontends && setActiveApp) {
    if (role === 'admin') {
      setActiveApp('admin');
    } else if (role === 'seller') {
      setActiveApp('seller');
    } else if (role === 'support') {
      setActiveApp('support');
    }
    return;
  }

  // Redirect mode - only pass userId, apps will fetch user details
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);

  if (role === 'admin') {
    window.location.href = `${MFE_CONFIG.adminAppUrl}?${params.toString()}`;
  } else if (role === 'seller') {
    window.location.href = `${MFE_CONFIG.sellerAppUrl}?${params.toString()}`;
  } else if (role === 'support') {
    window.location.href = `${MFE_CONFIG.supportAppUrl}?${params.toString()}`;
  }
};

export const changeTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export * from './remoteLoader';
