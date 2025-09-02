import React, { createContext, useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

// Dashboards
import DonorDashboard from './components/dashboard/DonorDashboard';
import NGODashboard from './components/dashboard/NGODashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

// Pages
import Landing from './pages/Landing';
import RegisterAdmin from './components/auth/RegisterAdmin'; // ✅ NEW

// Auth Context
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// 🔐 Protected Route
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// 🔐 Login Page
const AuthPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const userData = { email, role };
    login(userData);
    setError('');

    if (role === 'donor') navigate('/donor');
    else if (role === 'ngo') navigate('/ngo');
    else if (role === 'admin') navigate('/admin');
    else navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Register</h2>
      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', maxWidth: 300 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: 10, padding: 8 }}
        />
        <label>
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit" style={{ marginTop: 20, padding: 10 }}>
          Login / Register
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

// Landing
const LandingPage = () => (
  <div style={{ padding: 20 }}>
    <h1>Welcome to Shohay</h1>
    <p>
      Please <a href="/auth">Login or Register</a> to continue.
    </p>
    <p>
      Admin? <a href="/admin/register">Register as Admin</a>
    </p>
  </div>
);

// App
function App() {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={user ? <Navigate to={`/${user.role}`} /> : <LandingPage />}
          />
          <Route
            path="/auth"
            element={user ? <Navigate to={`/${user.role}`} /> : <AuthPage />}
          />
          <Route
            path="/admin/register"
            element={user ? <Navigate to="/admin" /> : <RegisterAdmin />}
          />

          {/* Protected Dashboards */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={['donor']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo"
            element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
