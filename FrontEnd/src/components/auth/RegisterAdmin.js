import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const RegisterAdmin = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '', // Changed from firstName/lastName
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerAdmin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!formData.adminKey) {
      setMessage('Admin key is required for registration');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setMessage('');

    // Send data that matches backend expectations
    const adminData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      adminKey: formData.adminKey
    };

    console.log('Admin data being sent:', adminData);

    const result = await registerAdmin(adminData);

    if (result.success) {
      setMessage('Admin registration successful! Welcome to Shohay!');
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Register as Admin</h2>
      <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        Admin registration requires a valid admin key from the organization.
        <br />
        <strong>Current admin key: SHOHAY_ADMIN_2025</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Official Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (minimum 8 characters)"
          value={formData.password}
          onChange={handleChange}
          minLength="8"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="adminKey"
          placeholder="Admin Registration Key"
          value={formData.adminKey}
          onChange={handleChange}
          required
          style={{ borderColor: '#ff6b6b' }}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register as Admin'}
        </button>
      </form>

      {message && <p className="auth-message">{message}</p>}

      <p>
        Already have an account?{' '}
        <span className="auth-link" onClick={onSwitchToLogin}>
          Login here
        </span>
      </p>
    </div>
  );
};

export default RegisterAdmin;