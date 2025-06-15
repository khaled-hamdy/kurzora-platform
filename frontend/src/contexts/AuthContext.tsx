
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  subscription?: {
    tier: string;
    active: boolean;
    expiresAt: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      console.log('AuthContext: Checking authentication state...');
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('AuthContext: Found saved user:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('AuthContext: No saved user found');
        }
      } catch (error) {
        console.error('AuthContext: Error loading user from localStorage:', error);
        localStorage.removeItem('user');
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };
    
    // Check authentication immediately without delay
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Admin login for admin@kurzora.com
      const isAdminUser = email === 'admin@kurzora.com';
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: isAdminUser ? 'admin' : 'user',
        subscription: {
          tier: 'Pro Trader',
          active: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('AuthContext: User logged in successfully', mockUser);
      
      // Redirect based on user role
      if (isAdminUser) {
        console.log('AuthContext: Redirecting admin to admin dashboard');
        window.location.href = '/admin';
      } else {
        console.log('AuthContext: Redirecting user to dashboard');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate signup API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      console.log('AuthContext: User signed up successfully');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext: User logging out');
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
