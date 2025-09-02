import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially no user
  const [loading, setLoading] = useState(false);

  // ✅ NGO Registration
  const registerNGO = async (ngoData) => {
    try {
      setLoading(true);

      // Mock API call
      console.log("Registering NGO:", ngoData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser({
        role: 'ngo',
        ...ngoData,
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Registration failed. Try again.' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ NGO Login
  const loginNGO = async (email, password) => {
    try {
      setLoading(true);

      if (email === 'ngo@example.com' && password === 'password123') {
        setUser({
          role: 'ngo',
          email,
          organizationName: 'Sample NGO',
        });
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Registration
  const registerAdmin = async (adminData) => {
    try {
      setLoading(true);

      console.log('Registering Admin:', adminData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation of admin key
      if (adminData.adminKey !== 'SHOHAY_ADMIN_2025') {
        return { success: false, message: 'Invalid admin key' };
      }

      setUser({
        role: 'admin',
        email: adminData.email,
        fullName: adminData.fullName,
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Admin registration failed.' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Login (Optional: not used in your current login page but here for flexibility)
  const loginAdmin = async (email, password) => {
    try {
      setLoading(true);

      // Demo login (replace with real backend auth)
      if (email === 'admin@example.com' && password === 'adminpass') {
        setUser({
          role: 'admin',
          email,
          fullName: 'Admin User',
        });
        return { success: true };
      } else {
        return { success: false, message: 'Invalid admin credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerNGO,
        loginNGO,
        registerAdmin,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
