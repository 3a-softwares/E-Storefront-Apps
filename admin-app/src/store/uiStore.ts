import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState } from '@3asoftwares/types';

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      language: 'en',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'admin-ui-store',
    }
  )
);
