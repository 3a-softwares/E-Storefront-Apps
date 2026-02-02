import { act } from '@testing-library/react';
import { clearAuth, storeAuth, getStoredAuth } from '@3asoftwares/utils';

// Create a fresh store for each test
const createMockStore = () => {
  let state = {
    user: null as any,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
  };

  const listeners = new Set<() => void>();

  const setState = (partial: Partial<typeof state>) => {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,
    setState,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    // Store actions
    setAuthData: (user: any, token: string) => {
      setState({
        user: {
          id: user._id || user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified || false,
        },
        token,
        isAuthenticated: true,
        error: null,
      });
    },

    updateUser: (user: any) => {
      const currentToken = state.token;
      setState({
        user: {
          id: user._id || user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified || false,
        },
      });
      if (currentToken) {
        storeAuth({ user, accessToken: currentToken });
      }
    },

    clearAuth: () => {
      clearAuth();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    setLoading: (isLoading: boolean) => setState({ isLoading }),
    setError: (error: string | null) => setState({ error }),

    hydrate: () => {
      const storedAuth = getStoredAuth();
      if (storedAuth && storedAuth.user && storedAuth.token) {
        const user = storedAuth.user;
        if (user && user.role === 'seller') {
          setState({
            user: {
              id: user._id || user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              emailVerified: user.emailVerified || false,
            },
            token: storedAuth.token,
            isAuthenticated: true,
          });
        }
      }
    },
  };
};

describe('Seller Auth Store', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createMockStore();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('setAuthData', () => {
    it('should set user and token correctly', () => {
      const mockUser = {
        _id: 'seller123',
        email: 'seller@test.com',
        name: 'Test Seller',
        role: 'seller',
        emailVerified: true,
      };
      const mockToken = 'jwt-token-123';

      store.setAuthData(mockUser, mockToken);
      const state = store.getState();

      expect(state.user).toEqual({
        id: 'seller123',
        email: 'seller@test.com',
        name: 'Test Seller',
        role: 'seller',
        emailVerified: true,
      });
      expect(state.token).toBe('jwt-token-123');
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle user with id instead of _id', () => {
      const mockUser = {
        id: 'seller456',
        email: 'seller2@test.com',
        name: 'Test Seller 2',
        role: 'seller',
      };
      const mockToken = 'jwt-token-456';

      store.setAuthData(mockUser, mockToken);
      const state = store.getState();

      expect(state.user?.id).toBe('seller456');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should set emailVerified to false if not provided', () => {
      const mockUser = {
        _id: 'seller789',
        email: 'seller3@test.com',
        name: 'Test Seller 3',
        role: 'seller',
      };

      store.setAuthData(mockUser, 'token');
      const state = store.getState();

      expect(state.user?.emailVerified).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user data without changing token', () => {
      // First set initial auth
      store.setAuthData(
        { _id: 'seller123', email: 'old@test.com', name: 'Old Name', role: 'seller' },
        'existing-token'
      );

      // Update user
      const updatedUser = {
        _id: 'seller123',
        email: 'new@test.com',
        name: 'New Name',
        role: 'seller',
        emailVerified: true,
      };

      store.updateUser(updatedUser);
      const state = store.getState();

      expect(state.user?.name).toBe('New Name');
      expect(state.user?.email).toBe('new@test.com');
      expect(state.token).toBe('existing-token');
      expect(storeAuth).toHaveBeenCalledWith({
        user: updatedUser,
        accessToken: 'existing-token',
      });
    });

    it('should not call storeAuth if no token exists', () => {
      const updatedUser = {
        _id: 'seller123',
        email: 'test@test.com',
        name: 'Test',
        role: 'seller',
      };

      store.updateUser(updatedUser);

      expect(storeAuth).not.toHaveBeenCalled();
    });
  });

  describe('clearAuth', () => {
    it('should clear all auth state', () => {
      // First set auth
      store.setAuthData(
        { _id: 'seller123', email: 'test@test.com', name: 'Test', role: 'seller' },
        'token'
      );

      // Clear auth
      store.clearAuth();
      const state = store.getState();

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(clearAuth).toHaveBeenCalled();
    });
  });

  describe('setLoading', () => {
    it('should set loading state to true', () => {
      store.setLoading(true);
      expect(store.getState().isLoading).toBe(true);
    });

    it('should set loading state to false', () => {
      store.setLoading(true);
      store.setLoading(false);
      expect(store.getState().isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      store.setError('Authentication failed');
      expect(store.getState().error).toBe('Authentication failed');
    });

    it('should clear error when set to null', () => {
      store.setError('Some error');
      store.setError(null);
      expect(store.getState().error).toBeNull();
    });
  });

  describe('hydrate', () => {
    it('should hydrate state from stored auth for seller', () => {
      const storedUser = {
        _id: 'seller123',
        email: 'seller@test.com',
        name: 'Stored Seller',
        role: 'seller',
        emailVerified: true,
      };

      (getStoredAuth as jest.Mock).mockReturnValue({
        user: storedUser,
        token: 'stored-token',
      });

      store.hydrate();
      const state = store.getState();

      expect(state.user?.name).toBe('Stored Seller');
      expect(state.token).toBe('stored-token');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should not hydrate if stored user is not a seller', () => {
      const storedUser = {
        _id: 'customer123',
        email: 'customer@test.com',
        name: 'Customer',
        role: 'customer',
      };

      (getStoredAuth as jest.Mock).mockReturnValue({
        user: storedUser,
        token: 'stored-token',
      });

      store.hydrate();
      const state = store.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should not hydrate if no stored auth exists', () => {
      (getStoredAuth as jest.Mock).mockReturnValue(null);

      store.hydrate();
      const state = store.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should not hydrate if stored auth is missing user or token', () => {
      (getStoredAuth as jest.Mock).mockReturnValue({
        user: null,
        token: 'token',
      });

      store.hydrate();
      expect(store.getState().isAuthenticated).toBe(false);

      (getStoredAuth as jest.Mock).mockReturnValue({
        user: { role: 'seller' },
        token: null,
      });

      store.hydrate();
      expect(store.getState().isAuthenticated).toBe(false);
    });
  });
});
