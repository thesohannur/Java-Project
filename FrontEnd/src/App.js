import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import Landing from './components/Landing'; // or wherever your Landing.js is located


// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Spring Boot API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Check for existing session on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, role = 'ngo') => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          userType: role.toUpperCase()
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: role,
          email: email
        };
        
        localStorage.setItem('token', result.token || result.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || 'Invalid credentials' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Unable to connect to server. Please check your connection.' 
      };
    }
  };

  // Register NGO function
  const registerNGO = async (ngoData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register-ngo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ngoData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: 'ngo',
          email: ngoData.email
        };
        
        localStorage.setItem('token', result.token || result.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('NGO Registration error:', error);
      return { 
        success: false, 
        message: 'Unable to connect to server. Please check your connection.' 
      };
    }
  };

  // Register Donor function
  const registerDonor = async (donorData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register-donor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: 'donor',
          email: donorData.email
        };
        
        localStorage.setItem('token', result.token || result.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Donor Registration error:', error);
      return { 
        success: false, 
        message: 'Unable to connect to server. Please check your connection.' 
      };
    }
  };

  // Register Admin function
  const registerAdmin = async (adminData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...adminData,
          secretKey: adminData.secretKey || 'SHOHAY_ADMIN_2025'
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const userData = {
          ...result.data,
          role: 'admin',
          email: adminData.email
        };
        
        localStorage.setItem('token', result.token || result.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || 'Admin registration failed' 
        };
      }
    } catch (error) {
      console.error('Admin Registration error:', error);
      return { 
        success: false, 
        message: 'Unable to connect to server. Please check your connection.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    registerNGO,
    registerDonor,
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

// 🔐 Protected Route
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px' }}>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// 🔐 Login Page
const AuthPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ngo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, role);
      
      if (result.success) {
        switch (role) {
          case 'donor':
            navigate('/donor');
            break;
          case 'ngo':
            navigate('/ngo/dashboard');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 400, 
      margin: '50px auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Login to Shohay</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ 
            marginBottom: 15, 
            padding: 12, 
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ 
            marginBottom: 15, 
            padding: 12, 
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <label style={{ marginBottom: 15, fontSize: '14px', color: '#666' }}>
          Login as:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ 
              marginLeft: 10, 
              padding: 8,
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="ngo">NGO</option>
            <option value="donor">Donor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: 12,
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && (
          <div style={{ 
            color: '#dc3545', 
            marginTop: 15, 
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
      </form>
      
      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '15px' }}>Don't have an account?</p>
        <button 
          onClick={() => navigate('/register-ngo')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: 10,
            fontSize: '14px'
          }}
        >
          Register as NGO
        </button>
        <button 
          onClick={() => navigate('/admin/register')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Register as Admin
        </button>
      </div>
    </div>
  );
};

// Landing Page
const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      padding: 40, 
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to Shohay</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        Connecting donors with NGOs for a better tomorrow
      </p>
      <div style={{ marginTop: 50 }}>
        <button 
          onClick={() => navigate('/auth')}
          style={{
            padding: '15px 30px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            marginRight: 20,
            transition: 'all 0.3s ease'
          }}
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/register-ngo')}
          style={{
            padding: '15px 30px',
            backgroundColor: 'white',
            color: '#667eea',
            border: '2px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          Register NGO
        </button>
      </div>
    </div>
  );
};

// Lazy load components to avoid circular dependencies
const LazyNGODashboard = React.lazy(() => import('./components/dashboard/NGODashboard'));
const LazyDonorDashboard = React.lazy(() => import('./components/dashboard/DonorDashboard'));
const LazyAdminDashboard = React.lazy(() => import('./components/dashboard/AdminDashboard'));
const LazyRegisterNGO = React.lazy(() => import('./components/auth/RegisterNGO'));
const LazyRegisterAdmin = React.lazy(() => import('./components/auth/RegisterAdmin'));

// Suspense wrapper for lazy components
const SuspenseWrapper = ({ children }) => (
  <React.Suspense fallback={
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading...</div>
    </div>
  }>
    {children}
  </React.Suspense>
);

// Main App Component
function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/register-ngo" 
              element={
                <SuspenseWrapper>
                  <LazyRegisterNGO />
                </SuspenseWrapper>
              } 
            />
            <Route 
              path="/admin/register" 
              element={
                <SuspenseWrapper>
                  <LazyRegisterAdmin />
                </SuspenseWrapper>
              } 
            />

            {/* Protected Dashboards */}
            <Route
              path="/donor"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <SuspenseWrapper>
                    <LazyDonorDashboard />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <SuspenseWrapper>
                    <LazyNGODashboard />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <SuspenseWrapper>
                    <LazyNGODashboard />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SuspenseWrapper>
                    <LazyAdminDashboard />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>

      {/* Add CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
