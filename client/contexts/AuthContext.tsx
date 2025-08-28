import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearAllData } from '@/services/dataService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = localStorage.getItem('sbie-auth');
        console.log('Auth status from localStorage:', authStatus);
        if (authStatus === 'authenticated') {
          setIsAuthenticated(true);
          console.log('User is authenticated from localStorage');
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
        console.log('Auth loading finished');
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', { username, password: password ? '***' : 'empty' });
    // Simple authentication with hardcoded credentials
    if (username === 'admin' && password === 'admin') {
      console.log('Login successful');
      setIsAuthenticated(true);
      localStorage.setItem('sbie-auth', 'authenticated');
      return true;
    }
    console.log('Login failed - invalid credentials');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sbie-auth');
    // Clear all application data on logout
    clearAllData();
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
