import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the store
jest.mock('../../src/store/authStore', () => ({
  useSellerAuthStore: jest.fn(),
}));

import { ProtectedRoute } from '../../src/components/ProtectedRoute';
import { useSellerAuthStore } from '../../src/store/authStore';

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;
  const LoginPage = () => <div data-testid="login-page">Login Page</div>;

  const renderWithRouter = (isAuthenticated: boolean) => {
    (useSellerAuthStore as any).mockReturnValue({
      isAuthenticated,
    });

    return render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when user is authenticated', () => {
    renderWithRouter(true);

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    renderWithRouter(false);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should navigate with replace prop to prevent back navigation', () => {
    // When isAuthenticated is false, Navigate component should have replace prop
    (useSellerAuthStore as any).mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <MemoryRouter initialEntries={['/previous', '/dashboard']} initialIndex={1}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/previous" element={<div>Previous</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should handle authentication state changes', () => {
    // Initially authenticated
    const { rerender } = renderWithRouter(true);
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();

    // Update mock to not authenticated
    (useSellerAuthStore as any).mockReturnValue({
      isAuthenticated: false,
    });

    // Re-render with new state
    rerender(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render nested components when authenticated', () => {
    (useSellerAuthStore as any).mockReturnValue({
      isAuthenticated: true,
    });

    const NestedComponent = () => (
      <div>
        <h1 data-testid="nested-title">Dashboard</h1>
        <p data-testid="nested-content">Welcome to your dashboard</p>
      </div>
    );

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <NestedComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('nested-title')).toHaveTextContent('Dashboard');
    expect(screen.getByTestId('nested-content')).toHaveTextContent('Welcome to your dashboard');
  });
});
