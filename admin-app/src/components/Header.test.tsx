import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '../../tests/test-utils';
import { Header } from './Header';

// Mock the stores
vi.mock('../store/uiStore', () => ({
  useUIStore: vi.fn(),
}));

vi.mock('../store/store', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('@3asoftwares/utils', () => ({
  SHELL_APP_URL: 'http://localhost:3000',
  clearAuth: vi.fn(),
}));

import { useUIStore } from '../store/uiStore';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearAuth } from '@3asoftwares/utils/client';

describe('Header Component', () => {
  const mockToggleTheme = vi.fn();
  const mockSetLanguage = vi.fn();
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUIStore).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      language: 'en',
      setLanguage: mockSetLanguage,
    } as any);

    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useAppSelector).mockReturnValue({
      name: 'Admin User',
      email: 'admin@example.com',
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('should display app name', () => {
      render(<Header />);

      expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    });

    it('should display user name when logged in', () => {
      render(<Header />);

      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    it('should not display user info when not logged in', () => {
      vi.mocked(useAppSelector).mockReturnValue(null);

      render(<Header />);

      expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
    });
  });

  describe('Logout', () => {
    it('should have logout button', () => {
      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should dispatch logout action when clicked', async () => {
      render(<Header />);

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      await userEvent.click(logoutButton);

      expect(mockDispatch).toHaveBeenCalled();
      expect(clearAuth).toHaveBeenCalled();
    });
  });
});
