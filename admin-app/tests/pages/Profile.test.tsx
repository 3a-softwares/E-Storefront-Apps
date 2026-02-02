import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import authReducer from '../../src/store/authSlice';
import { Profile } from '../../src/pages/Profile';
import { graphqlRequest } from '../../src/api/client';

// Mock the API client
jest.mock('../../src/api/client', () => ({
  graphqlRequest: jest.fn(),
}));

// Mock utils/client
jest.mock('@3asoftwares/utils/client', () => ({
  SEND_VERIFICATION_EMAIL_MUTATION: `
  mutation SendVerificationEmail($source: String) {
    sendVerificationEmail(source: $source) {
      success
      message
    }
  }
`,
  VERIFY_EMAIL_MUTATION: 'VERIFY_EMAIL_MUTATION',
  GET_ME_QUERY: `
  query GetMe {
    me {
      id
      name
      email
      role
      isActive
      emailVerified
      createdAt
      lastLogin
    }
  }
`,
  storeAuth: jest.fn(),
  getStoredAuth: jest.fn(() => ({ token: 'test-token' })),
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

const mockGraphqlRequest = graphqlRequest as jest.Mock;

describe('Profile Page', () => {
  const createTestStore = (preloadedState = {}) => {
    return configureStore({
      reducer: { auth: authReducer },
      preloadedState,
    });
  };

  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

  const renderWithProviders = (
    preloadedState = {
      auth: {
        user: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin',
          emailVerified: true,
        },
        token: 'jwt-token',
        isAuthenticated: true,
      },
    }
  ) => {
    const store = createTestStore(preloadedState);
    const queryClient = createQueryClient();

    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Profile />
        </QueryClientProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGraphqlRequest.mockResolvedValue({
      me: {
        id: 'admin123',
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'admin',
        emailVerified: true,
      },
    });
  });

  it('should show loading spinner initially', () => {
    mockGraphqlRequest.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithProviders();
    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
  });

  it('should display profile heading', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
    });
  });

  it('should display user information', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText('Test Admin').length).toBeGreaterThan(0);
      expect(screen.getAllByText('admin@test.com').length).toBeGreaterThan(0);
    });
  });

  it('should display verified badge when email is verified', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getAllByText(/verified/i).length).toBeGreaterThan(0);
    });
  });

  it('should display unverified badge and send button when email is not verified', async () => {
    mockGraphqlRequest.mockResolvedValue({
      me: {
        id: 'admin123',
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'admin',
        emailVerified: false,
      },
    });

    renderWithProviders({
      auth: {
        user: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin',
          emailVerified: false,
        },
        token: 'jwt-token',
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getAllByText(/not verified/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/send verification email/i)).toBeInTheDocument();
    });
  });

  it('should display user role', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('ADMIN')).toBeInTheDocument();
    });
  });

  it('should call sendVerificationEmail API when button is clicked', async () => {
    mockGraphqlRequest
      .mockResolvedValueOnce({
        me: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin',
          emailVerified: false,
        },
      })
      .mockResolvedValueOnce({
        sendVerificationEmail: {
          success: true,
          message: 'Verification email sent',
        },
      });

    renderWithProviders({
      auth: {
        user: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin',
          emailVerified: false,
        },
        token: 'jwt-token',
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/send verification email/i)).toBeInTheDocument();
    });

    const sendButton = screen.getByText(/send verification email/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockGraphqlRequest).toHaveBeenCalledWith(
        expect.stringContaining('sendVerificationEmail'),
        { source: 'admin' }
      );
    });
  });

  it('should display success message after sending verification email', async () => {
    mockGraphqlRequest
      .mockResolvedValueOnce({
        me: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin',
          emailVerified: false,
        },
      })
      .mockResolvedValueOnce({
        sendVerificationEmail: {
          success: true,
          message: 'Verification email sent successfully',
        },
      });

    renderWithProviders({
      auth: {
        user: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin',
          emailVerified: false,
        },
        token: 'jwt-token',
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/send verification email/i)).toBeInTheDocument();
    });

    const sendButton = screen.getByText(/send verification email/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/verification email sent successfully/i)).toBeInTheDocument();
    });
  });

  it('should handle API error', async () => {
    mockGraphqlRequest.mockRejectedValue(new Error('Failed to fetch user'));

    renderWithProviders();

    // Should handle gracefully and not crash
    await waitFor(() => {
      expect(mockGraphqlRequest).toHaveBeenCalled();
    });
  });
});
