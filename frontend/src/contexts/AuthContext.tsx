import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios'; // path may vary depending on your folder structure

interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  location: string;
  role: 'admin' | 'user';
  skills: string[];
  department: string;
  joinDate: string;
  isFirstLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem('access_token');

    if (storedUser && accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      logout()
      const response = await api.post('/login/', {
        email,
        password,
      });

      const { access, user: userData } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('currentUser', JSON.stringify(userData));

      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(userData);
      return userData; // ✅ Return userData instead of true
    } catch (error: any) {
      console.error('Login failed:', error?.response?.data || error.message);
      return null; // ❌ Don't return false — return null for type consistency
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
