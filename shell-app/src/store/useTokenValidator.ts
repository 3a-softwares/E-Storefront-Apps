import { useEffect, useCallback, useRef } from 'react';
import { getAccessToken, clearAuth, storeAuth, getStoredAuth } from '@3asoftwares/utils/client';
import { getProfile, logout } from '../services/authService';

// Check token validity every 5 minutes
const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
// Minimum time between validation calls (debounce)
const MIN_VALIDATION_INTERVAL = 10 * 1000; // 10 seconds

/**
 * Hook to periodically validate the user's session by calling the profile API.
 * This implements a sliding expiration mechanism:
 * - Token expires after 1 hour of inactivity
 * - Any API call (including this check) extends the session
 * - If token is expired, user is logged out automatically
 */
export function useTokenValidator(onUserUpdate?: (user: any) => void) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const lastValidationRef = useRef<number>(0);
  const isValidatingRef = useRef<boolean>(false);
  const onUserUpdateRef = useRef(onUserUpdate);

  // Keep ref updated without triggering re-renders
  useEffect(() => {
    onUserUpdateRef.current = onUserUpdate;
  }, [onUserUpdate]);

  const validateToken = useCallback(async () => {
    const token = getAccessToken();

    // No token, no need to validate
    if (!token) {
      return { valid: false, reason: 'no_token' };
    }

    try {
      const response = await getProfile();
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

        // Notify parent component of user update (using ref to avoid dependency)
        if (onUserUpdateRef.current) {
          onUserUpdateRef.current(user);
        }

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
  }, []); // No dependencies - uses refs for callbacks

  const handleInvalidToken = useCallback(async () => {
    // Try to call logout API to remove refresh token from MongoDB
    // This is a best-effort attempt - if it fails, we still clear local auth
    try {
      await logout();
    } catch {
      // Ignore errors - token might already be invalid
      // We still want to clear local auth data
    }

    // Clear all auth data
    clearAuth();

    // Reload the page to reset state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  const checkAndValidate = useCallback(async () => {
    const now = Date.now();
    
    // Debounce: Skip if we validated recently
    if (now - lastValidationRef.current < MIN_VALIDATION_INTERVAL) {
      return;
    }

    // Prevent concurrent validations
    if (isValidatingRef.current) {
      return;
    }
    
    isValidatingRef.current = true;
    lastValidationRef.current = now;
    
    try {
      const result = await validateToken();

      if (!result.valid && result.reason !== 'network_error' && result.reason !== 'no_token') {
        handleInvalidToken();
      }
    } finally {
      isValidatingRef.current = false;
    }
  }, [validateToken, handleInvalidToken]);

  // Store checkAndValidate in a ref to avoid dependency issues
  const checkAndValidateRef = useRef(checkAndValidate);
  useEffect(() => {
    checkAndValidateRef.current = checkAndValidate;
  }, [checkAndValidate]);

  useEffect(() => {
    // Check if there's a token to validate
    const token = getAccessToken();
    if (!token) return;

    // Initial validation on mount (with small delay to avoid race conditions)
    const initialTimeout = setTimeout(() => {
      checkAndValidateRef.current();
    }, 100);

    // Set up periodic validation
    intervalRef.current = setInterval(() => {
      checkAndValidateRef.current();
    }, TOKEN_CHECK_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency - uses refs

  // Also validate on window focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      const token = getAccessToken();
      if (token) {
        checkAndValidateRef.current();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []); // Empty dependency - uses refs

  return {
    validateToken,
    checkAndValidate,
  };
}
