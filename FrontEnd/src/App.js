import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import DonorDashboard from './components/dashboard/DonorDashboard';
import NGODashboard from './components/dashboard/NGODashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Header from './components/layout/Header';
import './styles/App.css';

function App() {
  const { user, loading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app">
        {!showAuth ? (
          <Landing onShowAuth={() => setShowAuth(true)} />
        ) : (
          <AuthPage onBackToLanding={() => setShowAuth(false)} />
        )}
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'DONOR':
        return <DonorDashboard />;
      case 'NGO':
        return <NGODashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="app">
      <Header user={user} onLogout={logout} />
      {renderDashboard()}
    </div>
  );
}

export default App;