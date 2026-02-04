import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../tests/test-utils';
import { Sidebar } from './Sidebar';

// Mock the UI store
vi.mock('../store/uiStore', () => ({
  useUIStore: vi.fn(),
}));

import { useUIStore } from '../store/uiStore';

describe('Sidebar Component', () => {
  const mockToggleSidebar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Expanded State', () => {
    beforeEach(() => {
      vi.mocked(useUIStore).mockReturnValue({
        sidebarOpen: true,
        toggleSidebar: mockToggleSidebar,
      } as any);
    });

    it('should render navigation title when expanded', () => {
      render(<Sidebar />);

      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('should display all navigation items with labels', () => {
      render(<Sidebar />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Coupons')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should have correct navigation links', () => {
      render(<Sidebar />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(6);
    });

    it('should call toggleSidebar when toggle button clicked', async () => {
      render(<Sidebar />);

      // The button exists but doesn't have an accessible name
      const toggleButton = screen.getByRole('button');
      await userEvent.click(toggleButton);

      expect(mockToggleSidebar).toHaveBeenCalled();
    });
  });

  describe('Collapsed State', () => {
    beforeEach(() => {
      vi.mocked(useUIStore).mockReturnValue({
        sidebarOpen: false,
        toggleSidebar: mockToggleSidebar,
      } as any);
    });

    it('should not show navigation title when collapsed', () => {
      render(<Sidebar />);

      expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    });

    it('should show icons only when collapsed', () => {
      render(<Sidebar />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(6);
    });

    it('should call toggleSidebar when toggle button clicked', async () => {
      render(<Sidebar />);

      // The button exists but doesn't have an accessible name
      const openButton = screen.getByRole('button');
      await userEvent.click(openButton);

      expect(mockToggleSidebar).toHaveBeenCalled();
    });
  });
});
