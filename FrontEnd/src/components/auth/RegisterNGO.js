import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const RegisterNGO = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    focusAreas: [],
    establishedYear: '',
    contactPersonName: '',
    contactPersonTitle: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerNGO } = useAuth();

  const focusOptions = [
    'Education', 'Healthcare', 'Environment', 'Poverty Alleviation',
    'Disaster Relief', 'Animal Welfare', 'Human Rights', 'Technology Access',
    'Women Empowerment', 'Child Welfare', 'Elderly Care', 'Community Development'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        focusAreas: checked
          ? [...prev.focusAreas, value]
          : prev.focusAreas.filter(area => area !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (formData.focusAreas.length === 0) {
      setMessage('Please select at least one focus area');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const ngoData = {
      organizationName: formData.organizationName,
      registrationNumber: formData.registrationNumber,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      description: formData.description,
      focusAreas: formData.focusAreas,
      establishedYear: parseInt(formData.establishedYear),
      contactPersonName: formData.contactPersonName,
      contactPersonTitle: formData.contactPersonTitle
    };

    const result = await registerNGO(ngoData);

    if (result.success) {
      setMessage('Registration successful! Welcome to Shohay!');
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Register NGO</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="organizationName"
          placeholder="Organization Name"
          value={formData.organizationName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={formData.registrationNumber}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Organization Email"
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
            type="number"
            name="establishedYear"
            placeholder="Established Year"
            value={formData.establishedYear}
            onChange={handleChange}
            min="1800"
            max="2024"
            required
          />
        </div>

        <textarea
          name="address"
          placeholder="Organization Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="website"
          placeholder="Website (optional)"
          value={formData.website}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Organization Description and Mission"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ minHeight: '100px' }}
        />

        <div className="form-row">
          <input
            type="text"
            name="contactPersonName"
            placeholder="Contact Person Name"
            value={formData.contactPersonName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contactPersonTitle"
            placeholder="Contact Person Title"
            value={formData.contactPersonTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="focus-areas">
          <label>Focus Areas (select at least one):</label>
          <div className="focus-checkboxes">
            {focusOptions.map(area => (
              <label key={area} className="checkbox-label">
                <input
                  type="checkbox"
                  value={area}
                  checked={formData.focusAreas.includes(area)}
                  onChange={handleChange}
                />
                {area}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register NGO'}
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

export default RegisterNGO;