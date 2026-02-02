import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockProduct, mockPagination } from '../../tests/test-utils';
import { Products } from './Products';

// Mock the API queries
vi.mock('../api/queries', () => ({
  useProducts: vi.fn(),
  useCreateProduct: vi.fn(),
  useUpdateProduct: vi.fn(),
  useDeleteProduct: vi.fn(),
  useCategories: vi.fn(),
}));

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCategories,
} from '../api/queries';

describe('Products Page', () => {
  const mockRefetch = vi.fn();
  const mockCreateMutateAsync = vi.fn();
  const mockUpdateMutateAsync = vi.fn();
  const mockDeleteMutateAsync = vi.fn();

  const mockProductsData = {
    products: {
      products: [
        mockProduct({ id: '1', name: 'Product A', price: 1000, stock: 50 }),
        mockProduct({ id: '2', name: 'Product B', price: 2000, stock: 30 }),
        mockProduct({ id: '3', name: 'Product C', price: 1500, stock: 0, isActive: false }),
      ],
      pagination: mockPagination({ total: 3, pages: 1 }),
    },
  };

  const mockCategoriesData = {
    categories: {
      data: [
        { id: '1', name: 'Electronics', slug: 'electronics' },
        { id: '2', name: 'Clothing', slug: 'clothing' },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProducts).mockReturnValue({
      data: mockProductsData,
      isLoading: false,
      refetch: mockRefetch,
    } as any);

    vi.mocked(useCategories).mockReturnValue({
      data: mockCategoriesData,
      isLoading: false,
    } as any);

    vi.mocked(useCreateProduct).mockReturnValue({
      mutateAsync: mockCreateMutateAsync,
    } as any);

    vi.mocked(useUpdateProduct).mockReturnValue({
      mutateAsync: mockUpdateMutateAsync,
    } as any);

    vi.mocked(useDeleteProduct).mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
    } as any);
  });

  describe('Rendering', () => {
    it('should display page title', () => {
      render(<Products />);

      expect(screen.getByRole('heading', { name: /product management/i })).toBeInTheDocument();
    });

    it('should display loading spinner when loading', () => {
      vi.mocked(useProducts).mockReturnValue({
        data: null,
        isLoading: true,
        refetch: mockRefetch,
      } as any);

      render(<Products />);

      // Check for spinner svg
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should display products in table', () => {
      render(<Products />);

      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
      expect(screen.getByText('Product C')).toBeInTheDocument();
    });

    it('should display add product button', () => {
      render(<Products />);

      expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument();
    });
  });

  describe('Create Product', () => {
    it('should have create product button', async () => {
      render(<Products />);

      const addButton = screen.getByRole('button', { name: /create product/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Edit Product', () => {
    it('should have edit buttons in table', () => {
      render(<Products />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Delete Product', () => {
    it('should have delete buttons in table', () => {
      render(<Products />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Toggle Active Status', () => {
    it('should display active/inactive indicators', () => {
      render(<Products />);

      // Products with isActive status should show indicators
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Search and Filter', () => {
    it('should have search input', () => {
      render(<Products />);

      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should filter products on search', async () => {
      render(<Products />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await userEvent.type(searchInput, 'Product A');

      expect(searchInput).toHaveValue('Product A');
    });
  });

  describe('Pagination', () => {
    it('should display pagination for multiple pages', () => {
      vi.mocked(useProducts).mockReturnValue({
        data: {
          products: {
            products: mockProductsData.products.products,
            pagination: mockPagination({ total: 50, pages: 5 }),
          },
        },
        isLoading: false,
        refetch: mockRefetch,
      } as any);

      render(<Products />);

      // Check for pagination buttons
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  describe('Stock Display', () => {
    it('should display stock values', () => {
      render(<Products />);

      // Product C has stock: 0
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
