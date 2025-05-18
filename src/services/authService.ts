import { User, UserRole } from '@/contexts/AuthContext';

// Base API URL - this would come from environment variables in a real app
const API_URL = import.meta.env.VITE_API_URL;

// Types for auth requests and responses
export interface RegisterRequest {
  email: string;
  full_name: string;
  role: UserRole;
  password: string;
  password2: string;  // Confirmation password
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;   // JWT access token
  refresh: string;  // JWT refresh token
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

// Helper function for API calls without authentication
const fetchApi = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
};

// Helper function to get current user profile using the token
const getUserProfile = async (accessToken: string): Promise<User> => {
  const response = await fetch(`${API_URL}/api/users/user/me/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user profile');
  }
  
  return response.json();
};

// Auth API services
export const authService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Register the user
    const registerResponse = await fetchApi('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // After registration, login to get tokens
    const tokens = await authService.getTokens(data.email, data.password);
    
    // Get user profile with the access token
    const user = await getUserProfile(tokens.access);
    
    return {
      user,
      tokens
    };
  },
  
  // Get JWT tokens
  getTokens: async (email: string, password: string): Promise<TokenResponse> => {
    return fetchApi('/api/users/token/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Get tokens
    const tokens = await authService.getTokens(email, password);
    
    // Get user profile with the access token
    const user = await getUserProfile(tokens.access);
    
    return {
      user,
      tokens
    };
  },
  
  // Refresh token
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    return fetchApi('/api/users/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },
  
  // Verify token with API to ensure it's valid
  verifyTokenWithApi: async (token: string): Promise<User> => {
    try {
      return await getUserProfile(token);
    } catch (error) {
      console.error('Token validation failed:', error);
      throw new Error('Invalid token');
    }
  },
  
  // Login with Google (would need additional implementation based on backend)
  loginWithGoogle: async (): Promise<AuthResponse> => {
    // This would need to be implemented based on your backend's Google auth flow
    throw new Error('Google login not yet implemented');
  },
  
  // Verify token is still valid by trying to get the user profile
  verifyToken: async (accessToken: string): Promise<boolean> => {
    try {
      await getUserProfile(accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default authService;
