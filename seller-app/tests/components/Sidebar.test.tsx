import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Mock window resize
const mockWindowInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: width,
  });
};

// Mock the store
const mockClearAuth = jest.fn();
const mockUser = {
  id: 'seller123',
  email: 'seller@test.com',
  name: 'Test Seller',
  role: 'seller',
};

jest.mock('../../src/store/authStore', () => ({
  useSellerAuthStore: jest.fn(() => ({
    user: mockUser,
    clearAuth: mockClearAuth,
  })),
}));

// Import component after mocking
import { Sidebar } from '../../src/components/Sidebar';
import { useSellerAuthStore } from '../../src/store/authStore';

describe('Sidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowInnerWidth(1024); // Desktop by default
    (useSellerAuthStore as any).mockReturnValue({
      user: mockUser,
      clearAuth: mockClearAuth,
    });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  const renderSidebar = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Sidebar />
      </MemoryRouter>
    );
  };

  describe('Menu Items', () => {
    it('should render all navigation links', () => {
      renderSidebar();

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Products')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Earnings')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should have correct hrefs for navigation links', () => {
      renderSidebar();

      expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/');
      expect(screen.getByText('My Products').closest('a')).toHaveAttribute('href', '/products');
      expect(screen.getByText('Orders').closest('a')).toHaveAttribute('href', '/orders');
      expect(screen.getByText('Earnings').closest('a')).toHaveAttribute('href', '/earnings');
      expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile');
    });

    it('should highlight Dashboard link when on home route', () => {
      renderSidebar('/');

      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveClass('bg-gradient-to-r');
    });

    it('should highlight Products link when on products route', () => {
      renderSidebar('/products');

      const productsLink = screen.getByText('My Products').closest('a');
      expect(productsLink).toHaveClass('bg-gradient-to-r');
    });

    it('should highlight Products link when on sub-route', () => {
      renderSidebar('/products/new');

      const productsLink = screen.getByText('My Products').closest('a');
      expect(productsLink).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Mobile Behavior', () => {
    beforeEach(() => {
      mockWindowInnerWidth(768); // Mobile width
    });

    it('should render toggle button on mobile', () => {
      renderSidebar();

      const toggleButton = screen.getByRole('button', { name: /open menu|close menu/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it('should toggle sidebar visibility when button is clicked', async () => {
      renderSidebar();

      const toggleButton = screen.getByRole('button', { name: /open menu/i });

      // Initially sidebar should be closed on mobile
      const sidebar = document.querySelector('aside');
      expect(sidebar).toHaveClass('-translate-x-full');

      // Click to open
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(sidebar).toHaveClass('translate-x-0');
      });
    });

    it('should close sidebar when clicking overlay', async () => {
      renderSidebar();

      // Open sidebar first
      const toggleButton = screen.getByRole('button', { name: /open menu/i });
      fireEvent.click(toggleButton);

      // Find overlay and click it
      await waitFor(() => {
        const overlay = document.querySelector('.backdrop-blur-sm');
        expect(overlay).toBeInTheDocument();

        if (overlay) {
          fireEvent.click(overlay);
        }
      });

      // Sidebar should be closed
      const sidebar = document.querySelector('aside');
      await waitFor(() => {
        expect(sidebar).toHaveClass('-translate-x-full');
      });
    });

    it('should close sidebar on Escape key', async () => {
      renderSidebar();

      // Open sidebar
      const toggleButton = screen.getByRole('button', { name: /open menu/i });
      fireEvent.click(toggleButton);

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      const sidebar = document.querySelector('aside');
      await waitFor(() => {
        expect(sidebar).toHaveClass('-translate-x-full');
      });
    });
  });

  describe('Desktop Behavior', () => {
    beforeEach(() => {
      mockWindowInnerWidth(1280); // Desktop width
    });

    it('should show sidebar by default on desktop', () => {
      renderSidebar();

      const sidebar = document.querySelector('aside');
      expect(sidebar).toHaveClass('lg:translate-x-0');
    });

    it('should have proper width on desktop', () => {
      renderSidebar();

      const sidebar = document.querySelector('aside');
      expect(sidebar).toHaveClass('lg:w-64');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label on toggle button', () => {
      mockWindowInnerWidth(768);
      renderSidebar();

      const toggleButton = screen.getByRole('button', { name: /open menu/i });
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('should update aria-label when sidebar is open', async () => {
      mockWindowInnerWidth(768);
      renderSidebar();

      const toggleButton = screen.getByRole('button', { name: /open menu/i });
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
      });
    });
  });
});
