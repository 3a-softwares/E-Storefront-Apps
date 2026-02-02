import authReducer, { setUser, logout } from '../../src/store/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setUser', () => {
    it('should set user and token correctly', () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'admin' as const,
        permissions: ['read', 'write', 'delete'],
      };
      const mockToken = 'jwt-token-123';

      const state = authReducer(initialState, setUser({ user: mockUser, token: mockToken }));

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should update existing user', () => {
      const existingState = {
        user: {
          id: 'admin123',
          email: 'old@test.com',
          name: 'Old Name',
          role: 'admin' as const,
        },
        token: 'old-token',
        isAuthenticated: true,
      };

      const newUser = {
        id: 'admin123',
        email: 'new@test.com',
        name: 'New Name',
        role: 'admin' as const,
      };

      const state = authReducer(existingState, setUser({ user: newUser, token: 'new-token' }));

      expect(state.user?.name).toBe('New Name');
      expect(state.user?.email).toBe('new@test.com');
      expect(state.token).toBe('new-token');
    });
  });

  describe('logout', () => {
    it('should clear all auth state', () => {
      const authenticatedState = {
        user: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin' as const,
        },
        token: 'jwt-token',
        isAuthenticated: true,
      };

      const state = authReducer(authenticatedState, logout());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle logout from already logged out state', () => {
      const state = authReducer(initialState, logout());

      expect(state).toEqual(initialState);
    });
  });

  describe('State Immutability', () => {
    it('should not mutate the original state when setting user', () => {
      const originalState = { ...initialState };
      const mockUser = {
        id: 'admin123',
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'admin' as const,
      };

      authReducer(originalState, setUser({ user: mockUser, token: 'token' }));

      expect(originalState).toEqual(initialState);
    });

    it('should not mutate the original state when logging out', () => {
      const authenticatedState = {
        user: {
          id: 'admin123',
          email: 'admin@test.com',
          name: 'Test Admin',
          role: 'admin' as const,
        },
        token: 'jwt-token',
        isAuthenticated: true,
      };
      const originalUser = authenticatedState.user;

      authReducer(authenticatedState, logout());

      expect(authenticatedState.user).toBe(originalUser);
      expect(authenticatedState.isAuthenticated).toBe(true);
    });
  });
});
