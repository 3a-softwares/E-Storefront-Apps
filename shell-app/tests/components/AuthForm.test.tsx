import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../../src/components/AuthForm';
import * as authService from '../../src/services/authService';

// Mock the auth service
jest.mock('../../src/services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
}));

// Mock utils
jest.mock('@3asoftwares/utils', () => ({
  storeAuth: jest.fn(),
}));

// Mock renderApp
jest.mock('../../src/utils', () => ({
  renderApp: jest.fn(),
}));

const mockLogin = authService.login as jest.Mock;
const mockForgotPassword = authService.forgotPassword as jest.Mock;

describe('AuthForm Component', () => {
  const mockSetAuthMode = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Mode', () => {
    it('should render login form by default', () => {
      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should require password', async () => {
      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const emailInput = screen.getByPlaceholderText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should call login service on valid submission', async () => {
      mockLogin.mockResolvedValue({
        user: { id: '1', email: 'test@example.com', role: 'admin' },
        accessToken: 'token',
      });

      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123!');
      });
    });

    it('should display error message on login failure', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPass123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should have forgot password link', () => {
      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      expect(screen.getByText(/forgot your password\?/i)).toBeInTheDocument();
    });

    it('should have create account link', () => {
      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    });
  });

  describe('Forgot Password Mode', () => {
    it('should switch to forgot password mode', () => {
      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const forgotLink = screen.getByText(/forgot your password\?/i);
      fireEvent.click(forgotLink);

      expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
    });

    it('should call forgotPassword service', async () => {
      mockForgotPassword.mockResolvedValue({ success: true });

      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const forgotLink = screen.getByText(/forgot your password\?/i);
      fireEvent.click(forgotLink);

      const emailInput = screen.getByPlaceholderText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com', 'seller');
      });
    });

    it('should show success message after sending reset email', async () => {
      mockForgotPassword.mockResolvedValue({ success: true });

      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const forgotLink = screen.getByText(/forgot your password\?/i);
      fireEvent.click(forgotLink);

      const emailInput = screen.getByPlaceholderText(/email/i);
      const submitButton = screen.getByRole('button', { name: /send reset link/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password reset link has been sent/i)).toBeInTheDocument();
      });
    });

    it('should have back to login link', () => {
      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const forgotLink = screen.getByText(/forgot your password\?/i);
      fireEvent.click(forgotLink);

      expect(screen.getByText(/back to login/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/logging in/i)).toBeInTheDocument();
      });
    });

    it('should disable form inputs during submission', async () => {
      mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <AuthForm initialMode="login" setAuthMode={mockSetAuthMode} onSuccess={mockOnSuccess} />
      );

      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });
});
