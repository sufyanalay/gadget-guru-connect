import { TokenResponse } from '@/services/authService';
import authService from '@/services/authService';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// JWT token expiration times (in milliseconds)
const ACCESS_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface StoredTokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Safety margin for token expiration (10 minutes) to avoid edge cases
const TOKEN_EXPIRY_MARGIN = 10 * 60 * 1000;

/**
 * Store tokens in localStorage with expiry
 */
export const storeTokens = (tokens: TokenResponse): void => {
  const expiresAt = Date.now() + ACCESS_TOKEN_EXPIRY;
  
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
};

/**
 * Clear all stored tokens
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Check if the access token is expired
 */
export const isTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiresAt) return true;
  
  return Date.now() > parseInt(expiresAt, 10);
};

/**
 * Get stored token information
 */
export const getStoredTokenInfo = (): StoredTokenInfo | null => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }
  
  return {
    accessToken,
    refreshToken,
    expiresAt: parseInt(expiresAt, 10),
  };
};

/**
 * Get a valid access token, refreshing it if necessary
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  const tokenInfo = getStoredTokenInfo();
  
  // No tokens stored
  if (!tokenInfo) {
    return null;
  }
  
  // If the token is still valid (with safety margin), return it
  if (tokenInfo.expiresAt > (Date.now() + TOKEN_EXPIRY_MARGIN)) {
    return tokenInfo.accessToken;
  }
  
  // Token expired, try to refresh
  try {
    console.log('Token expired, refreshing...');
    const newTokens = await authService.refreshToken(tokenInfo.refreshToken);
    storeTokens(newTokens);
    return newTokens.access;
  } catch (error) {
    // If refresh fails, clear tokens and return null
    console.error('Failed to refresh token:', error);
    clearTokens();
    return null;
  }
};
