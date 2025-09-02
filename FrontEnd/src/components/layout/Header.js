import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <span>Welcome, {user?.role}</span>
      <button onClick={onLogout} style={{ marginLeft: '1rem' }}>Logout</button>
    </header>
  );
};

export default Header;
