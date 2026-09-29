import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartnotes_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartnotes_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('smartnotes_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem('smartnotes_user', JSON.stringify(userData));
        } catch (error) {
          console.error('[Auth] Token validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('smartnotes_token', data.token);
    localStorage.setItem('smartnotes_user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password, confirmPassword) => {
    const data = await authService.register({ name, email, password, confirmPassword });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('smartnotes_token', data.token);
    localStorage.setItem('smartnotes_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartnotes_token');
    localStorage.removeItem('smartnotes_user');
  };

  const setAuthData = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('smartnotes_token', authToken);
    localStorage.setItem('smartnotes_user', JSON.stringify(userData));
  };

  const updateUser = (updated) => {
    setUser((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem('smartnotes_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
