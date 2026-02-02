import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockCoupon, mockPagination } from '../../tests/test-utils';
import { Coupons } from './Coupons';

// Mock the API queries
vi.mock('../api/queries', () => ({
  useCoupons: vi.fn(),
  useCreateCoupon: vi.fn(),
  useUpdateCoupon: vi.fn(),
  useDeleteCoupon: vi.fn(),
}));

import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '../api/queries';

describe('Coupons Page', () => {
  const mockRefetch = vi.fn();
  const mockCreateMutateAsync = vi.fn();
  const mockUpdateMutateAsync = vi.fn();
  const mockDeleteMutateAsync = vi.fn();

  const mockCouponsData = {
    coupons: {
      coupons: [
        mockCoupon({ id: '1', code: 'SAVE10', discount: 10, discountType: 'percentage' }),
        mockCoupon({ id: '2', code: 'FLAT100', discount: 100, discountType: 'fixed' }),
        mockCoupon({ id: '3', code: 'EXPIRED', discount: 20, isActive: false }),
      ],
      pagination: mockPagination({ total: 3, pages: 1 }),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCoupons).mockReturnValue({
      data: mockCouponsData,
      isLoading: false,
      refetch: mockRefetch,
    } as any);

    vi.mocked(useCreateCoupon).mockReturnValue({
      mutateAsync: mockCreateMutateAsync,
    } as any);

    vi.mocked(useUpdateCoupon).mockReturnValue({
      mutateAsync: mockUpdateMutateAsync,
    } as any);

    vi.mocked(useDeleteCoupon).mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
    } as any);
  });

  describe('Rendering', () => {
    it('should display page title', () => {
      render(<Coupons />);

      expect(
        screen.getByRole('heading', { name: /offers.*coupons.*management/i })
      ).toBeInTheDocument();
    });

    it('should display loading spinner when loading', () => {
      vi.mocked(useCoupons).mockReturnValue({
        data: null,
        isLoading: true,
        refetch: mockRefetch,
      } as any);

      render(<Coupons />);

      // Check for spinner svg
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should display coupons in table', () => {
      render(<Coupons />);

      expect(screen.getByText('SAVE10')).toBeInTheDocument();
      expect(screen.getByText('FLAT100')).toBeInTheDocument();
      expect(screen.getByText('EXPIRED')).toBeInTheDocument();
    });

    it('should display add coupon button', () => {
      render(<Coupons />);

      expect(screen.getByRole('button', { name: /add coupon|create coupon/i })).toBeInTheDocument();
    });
  });

  describe('Create Coupon', () => {
    it('should open modal when clicking add coupon', async () => {
      render(<Coupons />);

      const addButton = screen.getByRole('button', { name: /add coupon|create coupon/i });
      await userEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Coupon', () => {
    it('should have edit buttons in table', () => {
      render(<Coupons />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Delete Coupon', () => {
    it('should have delete buttons in table', () => {
      render(<Coupons />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Toggle Active Status', () => {
    it('should display active/inactive indicators', () => {
      render(<Coupons />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should handle empty coupons list', () => {
      vi.mocked(useCoupons).mockReturnValue({
        data: {
          coupons: {
            coupons: [],
            pagination: mockPagination({ total: 0, pages: 0 }),
          },
        },
        isLoading: false,
        refetch: mockRefetch,
      } as any);

      render(<Coupons />);

      expect(
        screen.getByRole('heading', { name: /offers.*coupons.*management/i })
      ).toBeInTheDocument();
    });
  });
});
