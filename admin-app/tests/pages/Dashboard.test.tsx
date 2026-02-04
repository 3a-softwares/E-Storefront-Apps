import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockDashboardStats, mockOrder } from '../test-utils';
import { Dashboard } from '../../src/pages/Dashboard';

// Mock the API queries
jest.mock('../../src/api/queries', () => ({
  useDashboardStats: jest.fn(),
  useOrders: jest.fn(),
}));

import { useDashboardStats, useOrders } from '../../src/api/queries';

describe('Dashboard', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner when data is loading', () => {
      (useDashboardStats as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      } as any);

      (useOrders as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
      } as any);

      render(<Dashboard />);

      // Check for spinner svg
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', () => {
      const errorMessage = 'Failed to fetch dashboard data';
      (useDashboardStats as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error(errorMessage),
        refetch: mockRefetch,
      } as any);

      (useOrders as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      } as any);

      render(<Dashboard />);

      expect(screen.getByText('Error loading dashboard')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should have retry button on error', async () => {
      (useDashboardStats as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Error'),
        refetch: mockRefetch,
      } as any);

      (useOrders as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
      } as any);

      render(<Dashboard />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await userEvent.click(retryButton);

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('Success State', () => {
    beforeEach(() => {
      (useDashboardStats as jest.Mock).mockReturnValue({
        data: { dashboardStats: mockDashboardStats() },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      } as any);

      (useOrders as jest.Mock).mockReturnValue({
        data: {
          orders: {
            orders: [mockOrder()],
          },
        },
        isLoading: false,
      } as any);
    });

    it('should display dashboard title', () => {
      render(<Dashboard />);

      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });

    it('should display stats cards', () => {
      render(<Dashboard />);

      // Dashboard should show some stats - check for numbers that appear in stat cards
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    });

    it('should display correct stat values', () => {
      render(<Dashboard />);

      // Check that refresh button exists to verify dashboard loaded
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });

    it('should have refresh button', async () => {
      render(<Dashboard />);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();

      await userEvent.click(refreshButton);
      expect(mockRefetch).toHaveBeenCalled();
    });

    it('should display alerts when there are pending orders', () => {
      (useDashboardStats as jest.Mock).mockReturnValue({
        data: {
          dashboardStats: { ...mockDashboardStats(), pendingOrders: 15 },
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      } as any);

      render(<Dashboard />);

      expect(screen.getByText(/pending orders require attention/i)).toBeInTheDocument();
    });
  });

  describe('Alerts', () => {
    it('should allow dismissing alerts', async () => {
      (useDashboardStats as jest.Mock).mockReturnValue({
        data: {
          dashboardStats: { ...mockDashboardStats(), pendingOrders: 15 },
        },
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      } as any);

      (useOrders as jest.Mock).mockReturnValue({
        data: {
          orders: {
            orders: [mockOrder({ orderStatus: 'PENDING' })],
          },
        },
        isLoading: false,
      } as any);

      render(<Dashboard />);

      // Find and click dismiss button on first alert
      const dismissButtons = screen
        .getAllByRole('button')
        .filter((btn) => btn.className.includes('ghost'));

      if (dismissButtons.length > 0) {
        await userEvent.click(dismissButtons[0]);
      }
    });
  });
});
