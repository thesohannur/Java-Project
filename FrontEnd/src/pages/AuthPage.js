import React, { useState } from 'react';
import Login from '../components/auth/Login';
import RoleSelector from '../components/auth/RoleSelector';
import RegisterDonor from '../components/auth/RegisterDonor';
import RegisterNGO from '../components/auth/RegisterNGO';
import RegisterAdmin from '../components/auth/RegisterAdmin';

const AuthPage = () => {
  // Modes: 'login' | 'roleSelect' | 'registerDonor' | 'registerNGO' | 'registerAdmin'
  const [mode, setMode] = useState('login');

  const goLogin = () => setMode('login');
  const goRoleSelect = () => setMode('roleSelect');

  const renderContent = () => {
    switch (mode) {
      case 'login':
        return <Login onSwitchToRegister={goRoleSelect} />;
      case 'roleSelect':
        return (
          <RoleSelector
            onSelectRole={(role) => setMode(`register${role}`)} // Donor | NGO | Admin
            onBackToLogin={goLogin}
          />
        );
      case 'registerDonor':
        return <RegisterDonor onBackToLogin={goLogin} />;
      case 'registerNGO':
        return <RegisterNGO onBackToLogin={goLogin} />;
      case 'registerAdmin':
        return <RegisterAdmin onBackToLogin={goLogin} />;
      default:
        return <Login onSwitchToRegister={goRoleSelect} />;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthPage;
