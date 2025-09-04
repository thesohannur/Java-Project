// src/components/layout/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NameLogo from '../../assets/NameLogo.svg';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { pathname } = useLocation();

  const isAdmin = user?.role === 'ADMIN';
  const showAccount = isAuthenticated && !isAdmin; // hide Account link for Admin

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-container">
              <img src={NameLogo} alt="Shohay" className="logo-image" />
              <span className="logo-text">Shohay</span>
            </div>
          </Link>

          <nav className="nav">
            {!isAuthenticated ? (
              <div className="nav-links">
                <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
                <Link to="/auth" className="nav-link auth-link">Get Started</Link>
              </div>
            ) : (
              <div className="nav-links">
                <Link to="/dashboard" className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
                {showAccount && (
                  <Link to="/profile" className={`nav-link ${pathname.startsWith('/profile') ? 'active' : ''}`}>
                    Account
                  </Link>
                )}
                <span className="user-info">
                  <span className="user-role">{user?.role}</span>
                  <span className="user-email">{user?.email}</span>
                </span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
