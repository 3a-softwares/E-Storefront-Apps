import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useDashboardStats,
  useUsers,
  useProducts,
  useOrders,
  useCoupons,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useDeleteUser,
  useUpdateUserRole,
} from './queries';

// Mock the GraphQL client
vi.mock('./client', () => ({
  graphqlRequest: vi.fn(),
}));

import { graphqlRequest } from './client';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('API Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useDashboardStats', () => {
    it('should fetch dashboard statistics', async () => {
      const mockData = {
        dashboardStats: {
          totalUsers: 100,
          totalOrders: 500,
          pendingOrders: 25,
          totalRevenue: 1500000,
        },
      };

      vi.mocked(graphqlRequest).mockResolvedValue(mockData);

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(graphqlRequest).toHaveBeenCalled();
    });

    it('should handle error when fetching stats fails', async () => {
      vi.mocked(graphqlRequest).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDashboardStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('useUsers', () => {
    it('should fetch users with pagination', async () => {
      const mockData = {
        users: {
          users: [
            { id: '1', name: 'User 1', email: 'user1@test.com' },
            { id: '2', name: 'User 2', email: 'user2@test.com' },
          ],
          pagination: { page: 1, limit: 10, total: 2, pages: 1 },
        },
      };

      vi.mocked(graphqlRequest).mockResolvedValue(mockData);

      const { result } = renderHook(() => useUsers(1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(graphqlRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ page: 1, limit: 10 })
      );
    });

    it('should include search parameter when provided', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ users: { users: [], pagination: {} } });

      renderHook(() => useUsers(1, 10, 'john'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(graphqlRequest).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ search: 'john' })
        );
      });
    });

    it('should include role parameter when provided', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ users: { users: [], pagination: {} } });

      renderHook(() => useUsers(1, 10, undefined, 'admin'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(graphqlRequest).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ role: 'admin' })
        );
      });
    });
  });

  describe('useProducts', () => {
    it('should fetch products with pagination', async () => {
      const mockData = {
        products: {
          products: [{ id: '1', name: 'Product 1', price: 1000 }],
          pagination: { page: 1, limit: 10, total: 1, pages: 1 },
        },
      };

      vi.mocked(graphqlRequest).mockResolvedValue(mockData);

      const { result } = renderHook(() => useProducts(1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should include includeInactive flag', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ products: { products: [], pagination: {} } });

      renderHook(() => useProducts(1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(graphqlRequest).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ includeInactive: true })
        );
      });
    });
  });

  describe('useOrders', () => {
    it('should fetch orders with pagination', async () => {
      const mockData = {
        orders: {
          orders: [{ id: '1', orderNumber: 'ORD-001', total: 1500 }],
          pagination: { page: 1, limit: 10, total: 1, pages: 1 },
        },
      };

      vi.mocked(graphqlRequest).mockResolvedValue(mockData);

      const { result } = renderHook(() => useOrders(1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useCoupons', () => {
    it('should fetch coupons with pagination', async () => {
      const mockData = {
        coupons: {
          coupons: [{ id: '1', code: 'SAVE10', discount: 10 }],
          pagination: { page: 1, limit: 10, total: 1, pages: 1 },
        },
      };

      vi.mocked(graphqlRequest).mockResolvedValue(mockData);

      const { result } = renderHook(() => useCoupons(1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });
});

describe('API Mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCreateProduct', () => {
    it('should create a product', async () => {
      const mockResponse = { createProduct: { id: 'new-product', name: 'New Product' } };
      vi.mocked(graphqlRequest).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateProduct(), {
        wrapper: createWrapper(),
      });

      const productData = {
        name: 'New Product',
        description: 'Description',
        price: 1000,
        category: 'Electronics',
        stock: 10,
        imageUrl: '',
        sellerId: 'admin',
        tags: [],
      };

      await result.current.mutateAsync(productData);

      expect(graphqlRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ input: productData })
      );
    });
  });

  describe('useUpdateProduct', () => {
    it('should update a product', async () => {
      const mockResponse = { updateProduct: { id: '1', name: 'Updated Product' } };
      vi.mocked(graphqlRequest).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateProduct(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        id: '1',
        input: { name: 'Updated Product' },
      });

      expect(graphqlRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ id: '1' })
      );
    });
  });

  describe('useDeleteProduct', () => {
    it('should delete a product', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ deleteProduct: true });

      const { result } = renderHook(() => useDeleteProduct(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync('product-1');

      expect(graphqlRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ id: 'product-1' })
      );
    });
  });

  describe('useCreateCoupon', () => {
    it('should create a coupon', async () => {
      const mockResponse = { createCoupon: { id: 'new-coupon', code: 'NEW10' } };
      vi.mocked(graphqlRequest).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCoupon(), {
        wrapper: createWrapper(),
      });

      const couponData = {
        code: 'NEW10',
        description: 'New coupon',
        discountType: 'percentage' as const,
        discount: 10,
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
      };

      await result.current.mutateAsync(couponData);

      expect(graphqlRequest).toHaveBeenCalled();
    });
  });

  describe('useUpdateCoupon', () => {
    it('should update a coupon', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ updateCoupon: { id: '1' } });

      const { result } = renderHook(() => useUpdateCoupon(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({
        id: '1',
        input: { isActive: false },
      });

      expect(graphqlRequest).toHaveBeenCalled();
    });
  });

  describe('useDeleteCoupon', () => {
    it('should delete a coupon', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ deleteCoupon: true });

      const { result } = renderHook(() => useDeleteCoupon(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync('coupon-1');

      expect(graphqlRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ id: 'coupon-1' })
      );
    });
  });

  describe('useDeleteUser', () => {
    it('should delete a user', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ deleteUser: true });

      const { result } = renderHook(() => useDeleteUser(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync('user-1');

      expect(graphqlRequest).toHaveBeenCalled();
    });
  });

  describe('useUpdateUserRole', () => {
    it('should update user role', async () => {
      vi.mocked(graphqlRequest).mockResolvedValue({ updateUserRole: { id: '1', role: 'admin' } });

      const { result } = renderHook(() => useUpdateUserRole(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({ id: '1', role: 'admin' });

      expect(graphqlRequest).toHaveBeenCalled();
    });
  });
});
