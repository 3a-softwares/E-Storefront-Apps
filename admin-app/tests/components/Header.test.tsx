import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { render } from '../../tests/test-utils';
import { Header } from '../../src/components/Header';

// Mock the stores
jest.mock('../../src/store/uiStore', () => ({
  useUIStore: jest.fn(),
}));

jest.mock('../../src/store/store', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@3asoftwares/utils', () => ({
  SHELL_APP_URL: 'http://localhost:3000',
  clearAuth: jest.fn(),
}));

import { useUIStore } from '../../src/store/uiStore';
import { useAppDispatch, useAppSelector } from '../../src/store/store';
import { clearAuth } from '@3asoftwares/utils/client';

describe('Header Component', () => {
  const mockToggleTheme = jest.fn();
  const mockSetLanguage = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mocked(useUIStore).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      language: 'en',
      setLanguage: mockSetLanguage,
    } as any);

    jest.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    jest.mocked(useAppSelector).mockReturnValue({
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

    it('should not display user info when not logged in', () => {
      jest.mocked(useAppSelector).mockReturnValue(null);

      render(<Header />);

      expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
    });
  });
});
