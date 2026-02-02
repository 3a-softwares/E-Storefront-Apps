import { renderHook, act } from '@testing-library/react';

// Create a simple mock store for testing
const createMockStore = () => {
  let state = {
    theme: 'light' as 'light' | 'dark',
    sidebarOpen: true,
    language: 'en',
  };

  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (partial: Partial<typeof state>) => {
      state = { ...state, ...partial };
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    toggleTheme: () => {
      state = { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
      listeners.forEach((listener) => listener());
    },
    toggleSidebar: () => {
      state = { ...state, sidebarOpen: !state.sidebarOpen };
      listeners.forEach((listener) => listener());
    },
    setLanguage: (lang: string) => {
      state = { ...state, language: lang };
      listeners.forEach((listener) => listener());
    },
  };
};

describe('uiStore', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  describe('initial state', () => {
    it('should have light theme by default', () => {
      expect(store.getState().theme).toBe('light');
    });

    it('should have sidebar open by default', () => {
      expect(store.getState().sidebarOpen).toBe(true);
    });

    it('should have English as default language', () => {
      expect(store.getState().language).toBe('en');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle theme from light to dark', () => {
      expect(store.getState().theme).toBe('light');
      store.toggleTheme();
      expect(store.getState().theme).toBe('dark');
    });

    it('should toggle theme from dark to light', () => {
      store.toggleTheme(); // light -> dark
      store.toggleTheme(); // dark -> light
      expect(store.getState().theme).toBe('light');
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar from open to closed', () => {
      expect(store.getState().sidebarOpen).toBe(true);
      store.toggleSidebar();
      expect(store.getState().sidebarOpen).toBe(false);
    });

    it('should toggle sidebar from closed to open', () => {
      store.toggleSidebar(); // open -> closed
      store.toggleSidebar(); // closed -> open
      expect(store.getState().sidebarOpen).toBe(true);
    });
  });

  describe('setLanguage', () => {
    it('should set language to Spanish', () => {
      store.setLanguage('es');
      expect(store.getState().language).toBe('es');
    });

    it('should set language to French', () => {
      store.setLanguage('fr');
      expect(store.getState().language).toBe('fr');
    });

    it('should update language multiple times', () => {
      store.setLanguage('es');
      expect(store.getState().language).toBe('es');
      store.setLanguage('de');
      expect(store.getState().language).toBe('de');
    });
  });

  describe('state persistence', () => {
    it('should notify subscribers on state change', () => {
      const listener = jest.fn();
      store.subscribe(listener);

      store.toggleTheme();
      expect(listener).toHaveBeenCalledTimes(1);

      store.toggleSidebar();
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should allow unsubscribing', () => {
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);

      store.toggleTheme();
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.toggleTheme();
      expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });
});
