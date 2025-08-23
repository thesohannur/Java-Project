import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const { token, email: userEmail, role, userId, message } = response.data.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify({ email: userEmail, role, userId }));

        setUser({ email: userEmail, role, userId });
        return { success: true, message: message || 'Login successful!' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const registerDonor = async (donorData) => {
    try {
      const response = await authAPI.registerDonor(donorData);
      return handleRegistrationResponse(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const registerNGO = async (ngoData) => {
    try {
      const response = await authAPI.registerNGO(ngoData);
      return handleRegistrationResponse(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const registerAdmin = async (adminData) => {
    try {
      const response = await authAPI.registerAdmin(adminData);
      return handleRegistrationResponse(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const handleRegistrationResponse = (response) => {
    if (response.data.success) {
      const { token, email, role, userId, message } = response.data.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify({ email, role, userId }));

      setUser({ email, role, userId });
      return { success: true, message: message || 'Registration successful!' };
    } else {
      return { success: false, message: response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    registerDonor,
    registerNGO,
    registerAdmin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};