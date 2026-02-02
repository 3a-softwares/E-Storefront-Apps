import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../src/pages/Dashboard';
import { orderApi } from '../../src/api/client';

// Mock the auth store
const mockUser = {
  id: 'seller123',
  email: 'seller@test.com',
  name: 'Test Seller',
  role: 'seller',
};

jest.mock('../../src/store/authStore', () => ({
  useSellerAuthStore: jest.fn(() => ({
    user: mockUser,
  })),
}));

// Mock the API client
jest.mock('../../src/api/client', () => ({
  orderApi: {
    getSellerStats: jest.fn(),
  },
  handleApiError: jest.fn((err) => err.message || 'An error occurred'),
}));

const mockGetSellerStats = orderApi.getSellerStats as jest.Mock;

describe('Seller Dashboard Page', () => {
  const mockStats = {
    totalRevenue: 150000,
    totalOrders: 45,
    pendingOrders: 5,
    completedOrders: 35,
    processingOrders: 5,
    completionRate: 77.8,
    avgOrderValue: 3333.33,
    successRate: 78,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSellerStats.mockResolvedValue({
      data: {
        success: true,
        data: mockStats,
      },
    });
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('should display welcome message with user name', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/welcome back, test seller/i)).toBeInTheDocument();
    });
  });

  it('should show loading spinner initially', () => {
    mockGetSellerStats.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderDashboard();
    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
  });

  it('should display total revenue', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
    });
  });

  it('should display total orders', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/total orders/i)).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });

  it('should display pending orders', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/pending orders/i)).toBeInTheDocument();
      expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    });
  });

  it('should display completed orders', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/completed orders/i)).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
    });
  });

  it('should display error message on API failure', async () => {
    mockGetSellerStats.mockRejectedValue(new Error('Failed to load stats'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/failed to load stats/i)).toBeInTheDocument();
    });
  });

  it('should call getSellerStats with user id', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(mockGetSellerStats).toHaveBeenCalledWith('seller123');
    });
  });

  it('should display business description text', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/here's what's happening with your business/i)).toBeInTheDocument();
    });
  });

  it('should handle empty response gracefully', async () => {
    mockGetSellerStats.mockResolvedValue({
      data: {
        success: false,
      },
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard stats/i)).toBeInTheDocument();
    });
  });
});
