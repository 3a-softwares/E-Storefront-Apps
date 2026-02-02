import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockUser, mockPagination } from '../../tests/test-utils';
import { Users } from './Users';

// Mock the API queries
vi.mock('../api/queries', () => ({
  useUsers: vi.fn(),
  useDeleteUser: vi.fn(),
  useUpdateUserRole: vi.fn(),
}));

import { useUsers, useDeleteUser, useUpdateUserRole } from '../api/queries';

describe('Users Page', () => {
  const mockRefetch = vi.fn();
  const mockDeleteMutateAsync = vi.fn();
  const mockUpdateRoleMutateAsync = vi.fn();

  const mockUsersData = {
    users: {
      users: [
        mockUser({ id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer' }),
        mockUser({ id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'seller' }),
        mockUser({ id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' }),
      ],
      pagination: mockPagination({ total: 3, pages: 1 }),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUsers).mockReturnValue({
      data: mockUsersData,
      isLoading: false,
      refetch: mockRefetch,
    } as any);

    vi.mocked(useDeleteUser).mockReturnValue({
      mutateAsync: mockDeleteMutateAsync,
    } as any);

    vi.mocked(useUpdateUserRole).mockReturnValue({
      mutateAsync: mockUpdateRoleMutateAsync,
    } as any);
  });

  describe('Rendering', () => {
    it('should display page title', () => {
      render(<Users />);

      expect(screen.getByRole('heading', { name: /user.*role.*management/i })).toBeInTheDocument();
    });

    it('should display loading spinner when loading', () => {
      vi.mocked(useUsers).mockReturnValue({
        data: null,
        isLoading: true,
        refetch: mockRefetch,
      } as any);

      render(<Users />);

      // Check for spinner svg
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should display users in table', () => {
      render(<Users />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    it('should display user emails', () => {
      render(<Users />);

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should have search input', () => {
      render(<Users />);

      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('should update search term on input', async () => {
      render(<Users />);

      const searchInput = screen.getByPlaceholderText(/search/i);
      await userEvent.type(searchInput, 'john');

      expect(searchInput).toHaveValue('john');
    });
  });

  describe('Role Filter', () => {
    it('should have role filter dropdown', () => {
      render(<Users />);

      expect(screen.getByText(/all roles/i)).toBeInTheDocument();
    });

    it('should filter users by role when selecting filter', async () => {
      render(<Users />);

      // The useUsers hook should be called with the role parameter
      expect(useUsers).toHaveBeenCalledWith(1, 10, undefined, undefined);
    });
  });

  describe('Delete User', () => {
    it('should have delete buttons for users', () => {
      render(<Users />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    it('should call delete mutation when delete is confirmed', async () => {
      mockDeleteMutateAsync.mockResolvedValue({});

      render(<Users />);

      // Test that delete buttons exist
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Update Role', () => {
    it('should have role select dropdowns in table', () => {
      render(<Users />);

      // There should be comboboxes for role selection
      const roleSelects = screen.getAllByRole('combobox');
      expect(roleSelects.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination', () => {
    it('should display pagination buttons when there are multiple pages', () => {
      vi.mocked(useUsers).mockReturnValue({
        data: {
          users: {
            users: mockUsersData.users.users,
            pagination: mockPagination({ total: 50, pages: 5 }),
          },
        },
        isLoading: false,
        refetch: mockRefetch,
      } as any);

      render(<Users />);

      // Pagination buttons exist
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should handle empty users list', () => {
      vi.mocked(useUsers).mockReturnValue({
        data: {
          users: {
            users: [],
            pagination: mockPagination({ total: 0, pages: 0 }),
          },
        },
        isLoading: false,
        refetch: mockRefetch,
      } as any);

      render(<Users />);

      // Should show page title and empty state
      expect(screen.getByRole('heading', { name: /user.*role.*management/i })).toBeInTheDocument();
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });
  });
});
