import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            email: decoded.sub,
            role: decoded.role,
            userId: decoded.userId
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.data.success) {
        const { token: newToken, email, role, userId } = response.data.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);

        const decoded = jwtDecode(newToken);
        setUser({
          email: decoded.sub,
          role: decoded.role,
          userId
        });

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { role: decoded.role };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const register = async (userData, userType) => {
    try {
      let response;
      switch (userType) {
        case 'DONOR':
          response = await authService.registerDonor(userData);
          break;
        case 'NGO':
          response = await authService.registerNGO(userData);
          break;
        case 'ADMIN':
          response = await authService.registerAdmin(userData);
          break;
        default:
          throw new Error('Invalid user type');
      }

      if (response.data.success) {
        const { token: newToken, email, role, userId } = response.data.data;

        localStorage.setItem('token', newToken);
        setToken(newToken);

        const decoded = jwtDecode(newToken);
        setUser({
          email: decoded.sub,
          role: decoded.role,
          userId
        });

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return { role: decoded.role };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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
