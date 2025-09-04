import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the context with default value
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Spring Boot API base URL - Can be configured for remote host
  // You can change this to point to another computer's IP address
  // Example: 'http://192.168.1.100:8080/api' or 'http://your-computer-ip:8080/api'
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check for existing session on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            
            // Try to verify token with backend (optional - comment out if no verify endpoint)
            try {
              const response = await fetch(`${API_BASE}/auth/verify`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                timeout: 5000 // 5 second timeout
              });

              if (response.ok) {
                setUser(parsedUser);
              } else {
                // Token is invalid, clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              }
            } catch (verifyError) {
              // If verify endpoint doesn't exist or network error, just use stored user
              console.warn('Token verification failed, using stored user data:', verifyError.message);
              setUser(parsedUser);
            }
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [API_BASE]);

  // Helper function to handle API requests with better error handling
  const makeApiRequest = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        timeout: 10000, // 10 second timeout
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle different response types
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { message: text, success: response.ok };
      }

      return { response, result };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running and accessible.');
      } else if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection.');
      } else {
        throw new Error(`Network error: ${error.message}`);
      }
    }
  };

  // ✅ NGO Registration - Updated for Spring Boot
  const registerNGO = async (ngoData) => {
    try {
      setLoading(true);
      setError(null);

      const { response, result } = await makeApiRequest('/auth/register-ngo', {
        method: 'POST',
        body: JSON.stringify(ngoData),
      });

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: 'ngo',
          email: ngoData.email
        };
        
        // Store token and user data
        const token = result.token || result.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        return { success: true };
      } else {
        const errorMessage = result.message || 'Registration failed';
        setError(errorMessage);
        return { 
          success: false, 
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('NGO Registration error:', error);
      const errorMessage = error.message || 'Unable to connect to server. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ General Login Function - Works for all user types
  const login = async (email, password, role = 'ngo') => {
    try {
      setLoading(true);
      setError(null);

      const { response, result } = await makeApiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password,
          userType: role.toUpperCase()
        }),
      });

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: role.toLowerCase(),
          email: email
        };
        
        const token = result.token || result.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        return { success: true };
      } else {
        const errorMessage = result.message || 'Invalid credentials';
        setError(errorMessage);
        return { 
          success: false, 
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Unable to connect to server. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ NGO Login - Wrapper for backward compatibility
  const loginNGO = useCallback(async (email, password) => {
    return await login(email, password, 'ngo');
  }, []);

  // ✅ Admin Registration - Updated for Spring Boot
  const registerAdmin = async (adminData) => {
    try {
      setLoading(true);
      setError(null);

      const { response, result } = await makeApiRequest('/auth/register-admin', {
        method: 'POST',
        body: JSON.stringify({
          ...adminData,
          secretKey: adminData.adminKey || adminData.secretKey || 'SHOHAY_ADMIN_2025'
        }),
      });

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: 'admin',
          email: adminData.email
        };
        
        const token = result.token || result.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        return { success: true };
      } else {
        const errorMessage = result.message || 'Admin registration failed';
        setError(errorMessage);
        return { 
          success: false, 
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Admin Registration error:', error);
      const errorMessage = error.message || 'Unable to connect to server. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Login - Wrapper for backward compatibility
  const loginAdmin = useCallback(async (email, password) => {
    return await login(email, password, 'admin');
  }, []);

  // ✅ Donor Registration - Added for completeness
  const registerDonor = async (donorData) => {
    try {
      setLoading(true);
      setError(null);

      const { response, result } = await makeApiRequest('/auth/register-donor', {
        method: 'POST',
        body: JSON.stringify(donorData),
      });

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: 'donor',
          email: donorData.email
        };
        
        const token = result.token || result.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
        
        return { success: true };
      } else {
        const errorMessage = result.message || 'Registration failed';
        setError(errorMessage);
        return { 
          success: false, 
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Donor Registration error:', error);
      const errorMessage = error.message || 'Unable to connect to server. Please check your connection.';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout function - Clear all stored data
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // ✅ Get current user token
  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  // ✅ Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user && !!localStorage.getItem('token');
  }, [user]);

  // ✅ Get API base URL (useful for debugging)
  const getApiBase = useCallback(() => {
    return API_BASE;
  }, [API_BASE]);

  const contextValue = {
    user,
    loading,
    error,
    registerNGO,
    registerDonor,
    registerAdmin,
    login,
    loginNGO,
    loginAdmin,
    logout,
    getToken,
    isAuthenticated,
    clearError,
    getApiBase
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook with better error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure your component is wrapped with <AuthProvider>.');
  }
  return context;
};

// Optional: Export context for advanced usage
export { AuthContext };
