import { useEffect, useCallback, useRef } from 'react';
import {
  getAccessToken,
  clearAuth as clearAuthCookies,
  storeAuth,
  getStoredAuth,
  SHELL_APP_URL,
} from '@3asoftwares/utils/client';
import { authApi } from '../api/client';
import { useSellerAuthStore } from './authStore';

// Check token validity every 5 minutes
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to periodically validate the user's session by calling the profile API.
 * This implements a sliding expiration mechanism:
 * - Token expires after 1 hour of inactivity
 * - Any API call (including this check) extends the session
 * - If token is expired, user is logged out automatically
 */
export function useTokenValidator() {
  const { setAuthData, clearAuth } = useSellerAuthStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const validateToken = useCallback(async () => {
    const token = getAccessToken();

    // No token, no need to validate
    if (!token) {
      return { valid: false, reason: 'no_token' };
    }

    try {
      const response = await authApi.getProfile();
      const user = response?.data?.user;

      if (user) {
        // Token is valid, update last activity time
        lastActivityRef.current = Date.now();

        // Refresh the stored auth to extend cookie expiry (sliding expiration)
        const storedAuth = getStoredAuth();
        if (storedAuth) {
          storeAuth({
            user,
            accessToken: storedAuth.token,
          });
        }

        // Update Zustand store with fresh user data
        setAuthData(user, storedAuth?.token || token);

        return { valid: true, user };
      } else {
        // No user returned, token might be invalid
        return { valid: false, reason: 'no_user' };
      }
    } catch (error: any) {
      // Token is invalid or expired
      const isAuthError =
        error?.message?.includes('401') ||
        error?.message?.includes('Unauthorized') ||
        error?.message?.includes('jwt expired') ||
        error?.message?.includes('invalid token') ||
        error?.response?.status === 401;

      if (isAuthError) {
        return { valid: false, reason: 'auth_error' };
      }

      // Network error, don't logout - might be temporary
      return { valid: true, reason: 'network_error' };
    }
  }, [setAuthData]);

  const handleInvalidToken = useCallback(async () => {
    // Try to call logout API to remove refresh token from MongoDB
    // This is a best-effort attempt - if it fails, we still clear local auth
    try {
      await authApi.logout();
    } catch {
      // Ignore errors - token might already be invalid
      // We still want to clear local auth data
    }

    // Clear all auth data (cookies)
    clearAuthCookies();

    // Redirect to shell app
    if (typeof window !== 'undefined') {
      window.location.href = `${process.env.SHELL_APP_URL || SHELL_APP_URL}?logout=true`;
    }
  }, []);

  const checkAndValidate = useCallback(async () => {
    const result = await validateToken();

    if (!result.valid && result.reason !== 'network_error' && result.reason !== 'no_token') {
      handleInvalidToken();
    }
  }, [validateToken, handleInvalidToken]);

  useEffect(() => {
    // Check if there's a token to validate
    const token = getAccessToken();
    if (!token) return;

    // Initial validation on mount
    checkAndValidate();

    // Set up periodic validation
    intervalRef.current = setInterval(checkAndValidate, TOKEN_CHECK_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndValidate]);

  // Also validate on window focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      const token = getAccessToken();
      if (token) {
        checkAndValidate();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAndValidate]);

  return {
    validateToken,
    checkAndValidate,
  };
}
