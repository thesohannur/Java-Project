import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterNGO = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registrationNumber: '',
    organizationName: '',
    contactPerson: '',
    phoneNumber: '',
    address: '',
    website: '',
    description: '',
    focusAreas: []
  });
  const [focusAreaInput, setFocusAreaInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addFocusArea = () => {
    if (focusAreaInput.trim() && !formData.focusAreas.includes(focusAreaInput.trim())) {
      setFormData({
        ...formData,
        focusAreas: [...formData.focusAreas, focusAreaInput.trim()]
      });
      setFocusAreaInput('');
    }
  };

  const removeFocusArea = (area) => {
    setFormData({
      ...formData,
      focusAreas: formData.focusAreas.filter(item => item !== area)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData, 'NGO');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Register as NGO</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Registration Number:</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Organization Name:</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Contact Person:</label>
          <input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+8801XXXXXXXXX"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Website:</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Focus Areas:</label>
          <div className="focus-areas-input">
            <input
              type="text"
              value={focusAreaInput}
              onChange={(e) => setFocusAreaInput(e.target.value)}
              placeholder="Add focus area"
              disabled={loading}
            />
            <button type="button" onClick={addFocusArea} disabled={loading}>
              Add
            </button>
          </div>
          <div className="focus-areas-list">
            {formData.focusAreas.map((area, index) => (
              <span key={index} className="focus-area-tag">
                {area}
                <button type="button" onClick={() => removeFocusArea(area)} disabled={loading}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="auth-switch">
        <p>Already have an account?</p>
        <button onClick={onBackToLogin} className="switch-btn">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterNGO;
