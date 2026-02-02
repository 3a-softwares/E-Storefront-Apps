import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../src/store/authSlice';
import { clearAuth, SHELL_APP_URL } from '@3asoftwares/utils/client';

// Mock the utils/client module
jest.mock('@3asoftwares/utils/client', () => ({
  clearAuth: jest.fn(),
  SHELL_APP_URL: 'http://localhost:3000',
}));

// Mock the UI store
const mockToggleTheme = jest.fn();

jest.mock('../../src/store/uiStore', () => ({
  useUIStore: jest.fn(() => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  })),
}));

// Import component after mocking
import { Header } from '../../src/components/Header';
import { useUIStore } from '../../src/store/uiStore';

describe('Admin Header Component', () => {
  const createTestStore = (preloadedState = {}) => {
    return configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState,
    });
  };

  const renderWithProviders = (
    store = createTestStore({
      auth: {
        user: { id: 'admin123', email: 'admin@test.com', name: 'Test Admin', role: 'admin' },
        token: 'jwt-token',
        isAuthenticated: true,
      },
    })
  ) => {
    return render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUIStore as any).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
  });

  it('should render the header with app name', () => {
    renderWithProviders();
    expect(screen.getByTestId('app-name')).toHaveTextContent('Admin Portal');
  });

  it('should display current theme', () => {
    renderWithProviders();
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('should display user name when logged in', () => {
    renderWithProviders();
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test Admin');
  });

  it('should call toggleTheme when theme toggle is clicked', () => {
    renderWithProviders();

    const themeToggle = screen.getByTestId('theme-toggle');
    fireEvent.click(themeToggle);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should call logout and clearAuth when logout button is clicked', () => {
    const store = createTestStore({
      auth: {
        user: { id: 'admin123', email: 'admin@test.com', name: 'Test Admin', role: 'admin' },
        token: 'jwt-token',
        isAuthenticated: true,
      },
    });

    renderWithProviders(store);

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(clearAuth).toHaveBeenCalled();
    expect(window.location.href).toBe(`${SHELL_APP_URL}?logout=true`);
  });

  it('should not display user elements when not logged in', () => {
    const store = createTestStore({
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
      },
    });

    renderWithProviders(store);

    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

  it('should render with dark theme', () => {
    (useUIStore as any).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    renderWithProviders();

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should render within a fixed header container', () => {
    const { container } = renderWithProviders();

    const headerWrapper = container.firstChild as HTMLElement;
    expect(headerWrapper).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-40');
  });
});
