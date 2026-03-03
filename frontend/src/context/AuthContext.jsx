import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Optionally fetch fresh user data
      fetchUserData();
    }
    setLoading(false);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      // Fetch user data
      const userResponse = await userAPI.getCurrentUser();
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      // Auto login after registration
      return await login(userData.username, userData.password);
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
