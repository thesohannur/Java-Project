import React, { useState } from 'react';
import { useAuth } from './AuthContext';           // Keep the updated import path
import Landing from './Landing';
import AuthPage from './AuthPage';
import DonorDashboard from './DonorDashboard';
import NGODashboard from './NGODashboard';
import AdminDashboard from './admin';               // Make sure this matches your actual admin file name & path
import ReceiverDashboard from './ReceiverDashboard';
import Header from './Header';
import './App.css';

function App() {
  const { user, loading, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is not logged in, show landing or auth page
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

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'DONOR':
        return <DonorDashboard />;
      case 'NGO':
        return <NGODashboard />;
      case 'RECEIVER':
        return <ReceiverDashboard />;
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
