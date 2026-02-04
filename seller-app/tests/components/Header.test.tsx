import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the store before importing the component
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
import { Header } from '../../src/components/Header';
import { useSellerAuthStore } from '../../src/store/authStore';

describe('Seller Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSellerAuthStore as any).mockReturnValue({
      user: mockUser,
      clearAuth: mockClearAuth,
    });
  });

  it('should not display user name when not logged in', () => {
    (useSellerAuthStore as any).mockReturnValue({
      user: null,
      clearAuth: mockClearAuth,
    });

    render(<Header />);

    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  it('should render within a fixed header container', () => {
    const { container } = render(<Header />);

    const headerWrapper = container.firstChild as HTMLElement;
    expect(headerWrapper).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-40');
  });
});
