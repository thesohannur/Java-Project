// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './components/dashboard/AdminDashboard';
import NGODashboard from './components/dashboard/NGODashboard';
import DonorDashboard from './components/dashboard/DonorDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Profile from './pages/Profile';
import './styles/App.css';
import './styles/Landing.css';
import './styles/Auth.css';

function App() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/auth"
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === 'ADMIN' && <AdminDashboard />}
                {user?.role === 'NGO' && <NGODashboard />}
                {user?.role === 'DONOR' && <DonorDashboard />}
              </ProtectedRoute>
            }
          />
          {/* If Admin hits /profile, redirect to dashboard */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {isAdmin ? <Navigate to="/dashboard" replace /> : <Profile />}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
