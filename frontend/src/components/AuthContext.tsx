import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize isAuthenticated synchronously based on token presence
  const storedToken = localStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storedToken);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(storedToken);
  const [isLoading, setIsLoading] = useState<boolean>(!!storedToken); // Loading only if we have a token to validate

  // Initialize auth state from token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Try to fetch user profile if endpoint exists
          try {
            const userProfile = await apiService.getUserProfile();
            setUser(userProfile);
          } catch (profileError) {
            // If profile endpoint doesn't exist yet, continue with auth
            // User will be null but authentication is based on token
          }
          setIsAuthenticated(true);
          setToken(storedToken);
        } catch (error) {
          // If token is invalid, clear authentication
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });

      localStorage.setItem('token', response.token);
      setToken(response.token);
      setIsAuthenticated(true);

      // Try to fetch user profile after login if endpoint exists
      try {
        const userProfile = await apiService.getUserProfile();
        setUser(userProfile);
      } catch (profileError) {
        // If profile endpoint doesn't exist yet, continue with login
        // User will be null but user can still use the app
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    apiService.logout(); // This clears the token from apiService
  }, []);

  // Update apiService token when it changes
  useEffect(() => {
    if (token) {
      // Update axios instance configuration
      const axiosInstance = apiService['api'];
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    token,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;