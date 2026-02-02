/**
 * Admin App Bootstrap
 * This file handles both standalone and micro-frontend modes
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import '@3asoftwares/ui/styles.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Initialize theme from localStorage - default to light
const initTheme = () => {
  // Remove dark class first to ensure light is default
  document.documentElement.classList.remove('dark');

  const savedTheme = localStorage.getItem('admin-ui-store');
  if (savedTheme) {
    try {
      const store = JSON.parse(savedTheme);
      if (store.state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
};

/**
 * Wrapped App component for use in micro-frontend mode
 * Uses MemoryRouter to avoid conflicts with host router
 */
export const AdminAppWrapper: React.FC<{ basePath?: string }> = ({ basePath = '/admin' }) => {
  React.useEffect(() => {
    initTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[basePath]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

/**
 * Mount function for standalone mode
 */
export const mount = (element: HTMLElement) => {
  initTheme();

  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );

  return {
    unmount: () => root.unmount(),
  };
};

// Auto-mount in standalone mode if root element exists
const rootElement = document.getElementById('root');
if (rootElement) {
  mount(rootElement);
}

export default AdminAppWrapper;
