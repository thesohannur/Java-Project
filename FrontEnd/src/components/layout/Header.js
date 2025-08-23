import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header style={{ padding: '1rem', background: '#4caf50', color: 'white' }}>
      <h2>Shohay - {user?.role} Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;