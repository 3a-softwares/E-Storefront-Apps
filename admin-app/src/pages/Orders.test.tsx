import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockOrder, mockPagination } from '../../tests/test-utils';
import { Orders } from './Orders';

// Mock the API queries
vi.mock('../api/queries', () => ({
  useOrders: vi.fn(),
  useOrder: vi.fn(),
  useUpdateOrderStatus: vi.fn(),
  useUpdatePaymentStatus: vi.fn(),
  useCancelOrder: vi.fn(),
}));

import {
  useOrders,
  useOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
  useCancelOrder,
} from '../api/queries';

describe('Orders Page', () => {
  const mockRefetch = vi.fn();
  const mockUpdateStatusMutateAsync = vi.fn();
  const mockUpdatePaymentMutateAsync = vi.fn();
  const mockCancelMutateAsync = vi.fn();

  const mockOrdersData = {
    orders: {
      orders: [
        mockOrder({ id: '1', orderNumber: 'ORD-001', orderStatus: 'PENDING', total: 1500 }),
        mockOrder({ id: '2', orderNumber: 'ORD-002', orderStatus: 'CONFIRMED', total: 2500 }),
        mockOrder({ id: '3', orderNumber: 'ORD-003', orderStatus: 'DELIVERED', total: 3000 }),
      ],
      pagination: mockPagination({ total: 3, pages: 1 }),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useOrders).mockReturnValue({
      data: mockOrdersData,
      isLoading: false,
      refetch: mockRefetch,
    } as any);

    vi.mocked(useOrder).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    vi.mocked(useUpdateOrderStatus).mockReturnValue({
      mutateAsync: mockUpdateStatusMutateAsync,
    } as any);

    vi.mocked(useUpdatePaymentStatus).mockReturnValue({
      mutateAsync: mockUpdatePaymentMutateAsync,
    } as any);

    vi.mocked(useCancelOrder).mockReturnValue({
      mutateAsync: mockCancelMutateAsync,
    } as any);
  });

  describe('Rendering', () => {
    it('should display page title', () => {
      render(<Orders />);

      expect(screen.getByRole('heading', { name: /order management/i })).toBeInTheDocument();
    });

    it('should display loading spinner when loading', () => {
      vi.mocked(useOrders).mockReturnValue({
        data: null,
        isLoading: true,
        refetch: mockRefetch,
      } as any);

      render(<Orders />);

      // Check for spinner svg
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should display orders in table', () => {
      render(<Orders />);

      expect(screen.getByText('#ORD-001')).toBeInTheDocument();
      expect(screen.getByText('#ORD-002')).toBeInTheDocument();
      expect(screen.getByText('#ORD-003')).toBeInTheDocument();
    });

    it('should display order status indicators', () => {
      render(<Orders />);

      // Multiple pending elements exist (filter options and badges)
      const pendingElements = screen.getAllByText(/pending/i);
      expect(pendingElements.length).toBeGreaterThan(0);
    });
  });

  describe('Status Filter', () => {
    it('should have status filter dropdown', () => {
      render(<Orders />);

      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThan(0);
    });
  });

  describe('View Order Details', () => {
    it('should have view buttons in table', () => {
      render(<Orders />);

      const viewButtons = screen.getAllByRole('button', { name: /view|details/i });
      expect(viewButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Update Order Status', () => {
    it('should have status update controls', () => {
      render(<Orders />);

      const statusSelects = screen.getAllByRole('combobox');
      expect(statusSelects.length).toBeGreaterThan(0);
    });
  });

  describe('Cancel Order', () => {
    it('should have cancel buttons for non-delivered orders', () => {
      render(<Orders />);

      const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
      expect(cancelButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    it('should show pagination buttons for multiple pages', () => {
      vi.mocked(useOrders).mockReturnValue({
        data: {
          orders: {
            orders: mockOrdersData.orders.orders,
            pagination: mockPagination({ total: 50, pages: 5 }),
          },
        },
        isLoading: false,
        refetch: mockRefetch,
      } as any);

      render(<Orders />);

      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should handle empty orders list', () => {
      vi.mocked(useOrders).mockReturnValue({
        data: {
          orders: {
            orders: [],
            pagination: mockPagination({ total: 0, pages: 0 }),
          },
        },
        isLoading: false,
        refetch: mockRefetch,
      } as any);

      render(<Orders />);

      expect(screen.getByRole('heading', { name: /order management/i })).toBeInTheDocument();
    });
  });
});
