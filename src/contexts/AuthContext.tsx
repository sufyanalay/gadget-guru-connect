import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import authService from '@/services/authService';
import { 
  storeTokens, 
  clearTokens, 
  getStoredTokenInfo, 
  getValidAccessToken 
} from '@/utils/tokenManager';

export type UserRole = 'student' | 'teacher' | 'technician' | 'admin';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and valid token on mount
    const storedUser = localStorage.getItem('user');
    const tokenInfo = getStoredTokenInfo();
    
    console.log('AuthContext initialization:', { 
      hasStoredUser: !!storedUser, 
      hasTokenInfo: !!tokenInfo
    });
    
    if (storedUser && tokenInfo) {
      // Verify token is still valid or can be refreshed
      const verifySession = async () => {
        try {
          console.log('Verifying session with token...');
          // This will refresh the token if needed
          const validToken = await getValidAccessToken();
          
          if (validToken) {
            try {
              // Actually verify token with the API and get latest user data
              const userData = await authService.verifyTokenWithApi(validToken);
              console.log('Session verified with API, restoring user:', userData);
              
              // Update stored user data with fresh data from API
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
            } catch (verifyError) {
              console.error('API token verification failed:', verifyError);
              localStorage.removeItem('user');
              clearTokens();
            }
          } else {
            // If we couldn't get a valid token, clear storage
            console.log('Invalid token, clearing session');
            localStorage.removeItem('user');
            clearTokens();
          }
        } catch (error) {
          // In case of any error, clear storage
          console.error('Error verifying session:', error);
          localStorage.removeItem('user');
          clearTokens();
        } finally {
          setLoading(false);
        }
      };
      
      verifySession();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      // Store user and tokens
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      storeTokens(response.tokens);
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${response.user.full_name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await authService.loginWithGoogle();
      
      // Store user and tokens
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      storeTokens(response.tokens);
      
      toast({
        title: "Google login successful!",
        description: `Welcome, ${response.user.full_name}!`,
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "There was an error logging in with Google. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await authService.register({
        email,
        full_name: name,
        role,
        password,
        password2: password // Using same password for confirmation
      });
      
      // Store user and tokens
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      storeTokens(response.tokens);
      
      toast({
        title: "Registration successful!",
        description: `Welcome to Gadget Guru Connect, ${name}!`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    clearTokens();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
