import React, { useState } from 'react';
import Login from '../components/auth/Login';
import RegisterDonor from '../components/auth/RegisterDonor';
import RegisterNGO from '../components/auth/RegisterNGO';
import RegisterAdmin from '../components/auth/RegisterAdmin';
import RoleSelector from '../components/auth/RoleSelector';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('role-select'); // 'login', 'register-donor', 'register-ngo', 'register-admin'
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    if (!selectedRole) {
      setCurrentView('role-select');
    } else {
      setCurrentView(`register-${selectedRole.toLowerCase()}`);
    }
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleBackToRoleSelect = () => {
    setCurrentView('role-select');
    setSelectedRole('');
  };

  return (
    <div className="auth-page">
      {currentView === 'role-select' && (
        <RoleSelector onSelectRole={handleRoleSelect} selectedRole={selectedRole} />
      )}

      {currentView === 'login' && (
        <>
          <button className="back-button" onClick={handleBackToRoleSelect}>
            ← Back to Role Selection
          </button>
          <Login
            onSwitchToRegister={handleSwitchToRegister}
            selectedRole={selectedRole}
          />
        </>
      )}

      {currentView === 'register-donor' && (
        <>
          <button className="back-button" onClick={handleSwitchToLogin}>
            ← Back to Login
          </button>
          <RegisterDonor onSwitchToLogin={handleSwitchToLogin} />
        </>
      )}

      {currentView === 'register-ngo' && (
        <>
          <button className="back-button" onClick={handleSwitchToLogin}>
            ← Back to Login
          </button>
          <RegisterNGO onSwitchToLogin={handleSwitchToLogin} />
        </>
      )}

      {currentView === 'register-admin' && (
        <>
          <button className="back-button" onClick={handleSwitchToLogin}>
            ← Back to Login
          </button>
          <RegisterAdmin onSwitchToLogin={handleSwitchToLogin} />
        </>
      )}
    </div>
  );
};

export default AuthPage;