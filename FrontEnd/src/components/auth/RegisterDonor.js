import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const RegisterDonor = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    focusAreas: [],
    donationFrequency: '',
    preferredAmount: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerDonor } = useAuth();

  const focusOptions = [
    'Education', 'Healthcare', 'Environment', 'Poverty Alleviation',
    'Disaster Relief', 'Animal Welfare', 'Human Rights', 'Technology Access'
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

    const donorData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      focusAreas: formData.focusAreas,
      donationFrequency: formData.donationFrequency,
      preferredAmount: formData.preferredAmount
    };

    const result = await registerDonor(donorData);

    if (result.success) {
      setMessage('Registration successful! Welcome to Shohay!');
    } else {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Register as Donor</h2>
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
          placeholder="Email"
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

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <div className="focus-areas">
          <label>Areas of Interest (select at least one):</label>
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

        <select
          name="donationFrequency"
          value={formData.donationFrequency}
          onChange={handleChange}
          required
        >
          <option value="">Select Donation Frequency</option>
          <option value="one-time">One-time</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
        </select>

        <input
          type="number"
          name="preferredAmount"
          placeholder="Preferred Donation Amount (BDT)"
          value={formData.preferredAmount}
          onChange={handleChange}
          min="1"
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register as Donor'}
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

export default RegisterDonor;