import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const RegisterAdmin = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    employeeId: '',
    department: '',
    adminKey: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerAdmin } = useAuth();

  const departments = [
    'Operations',
    'Finance',
    'User Management',
    'Campaign Oversight',
    'Technical Support',
    'Compliance'
  ];

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

    setIsLoading(true);
    setMessage('');

    const adminData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      employeeId: formData.employeeId,
      department: formData.department,
      adminKey: formData.adminKey
    };

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
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Official Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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
        </div>

        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

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