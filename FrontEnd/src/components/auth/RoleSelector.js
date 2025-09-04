import React from 'react';

const RoleSelector = ({ onSelectRole, onBackToLogin }) => {
  return (
    <div className="auth-form role-selector">
      <h2>Choose Your Role</h2>
      <p>Select the type of account to create:</p>

      {/* Force vertical stacking without relying on external CSS */}
      <div
        className="role-options-vertical"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}
      >
        <div className="role-option" onClick={() => onSelectRole('Donor')}>
          <h3>💰 Donor</h3>
          <p>Donate money and volunteer time to support NGO causes</p>
          <button className="role-btn">Register as Donor</button>
        </div>

        <div className="role-option" onClick={() => onSelectRole('NGO')}>
          <h3>🏢 NGO</h3>
          <p>Create campaigns, manage volunteers, and receive donations</p>
          <button className="role-btn">Register as NGO</button>
        </div>

        <div className="role-option" onClick={() => onSelectRole('Admin')}>
          <h3>👤 Admin</h3>
          <p>Oversee and approve NGO campaigns</p>
          <button className="role-btn">Register as Admin</button>
        </div>
      </div>

      <div className="auth-switch" style={{ textAlign: 'center' }}>
        <p>Already have an account?</p>
        <button type="button" onClick={onBackToLogin} className="switch-btn">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
