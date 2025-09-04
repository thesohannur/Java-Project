import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css'; // Updated import to use your existing file


const roles = [
  { 
    id: "donor", 
    title: "Donor", 
    description: "Donate resources to those in need and make a difference in communities.",
    icon: "❤️"
  },
  { 
    id: "ngo", 
    title: "NGO", 
    description: "Manage and distribute donated resources to help those in need.",
    icon: "🏢"
  },
  { 
    id: "admin", 
    title: "Admin", 
    description: "Oversee platform operations and ensure smooth functioning.",
    icon: "⚙️"
  },
];

const focusAreasList = [
  "Education", "Healthcare", "Environment", "Poverty Alleviation",
  "Disaster Relief", "Animal Welfare", "Human Rights", "Technology Access",
  "Food Security", "Clean Water", "Women Empowerment", "Child Welfare"
];

const AuthPage = ({ onBackToLanding }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    registrationNumber: "",
    contactPerson: "",
    phoneNumber: "",
    address: "",
    website: "",
    description: "",
    focusAreas: [],
    country: "Bangladesh",
    state: "",
    city: "",
    additionalInfo: ""
  });

  const { login, registerNGO, registerDonor, registerAdmin } = useAuth();
  const navigate = useNavigate();

  const toggleFocusArea = (area) => {
    setFormData(prev => {
      const updated = prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(f => f !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: updated };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Handle Login
        const result = await login(formData.email, formData.password, selectedRole);
        if (result.success) {
          switch (selectedRole) {
            case 'donor':
              navigate('/donor');
              break;
            case 'ngo':
              navigate('/ngo/dashboard');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/');
          }
        } else {
          setError(result.message);
        }
      } else {
        // Handle Registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        let result;
        if (selectedRole === 'ngo') {
          if (!formData.organizationName || !formData.registrationNumber || !formData.contactPerson) {
            setError('Please fill in all required NGO fields');
            return;
          }
          
          const ngoData = {
            email: formData.email,
            password: formData.password,
            organizationName: formData.organizationName,
            registrationNumber: formData.registrationNumber,
            contactPerson: formData.contactPerson,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            website: formData.website,
            description: formData.description,
            focusAreas: formData.focusAreas,
            country: formData.country,
            state: formData.state,
            city: formData.city
          };
          result = await registerNGO(ngoData);
        } else if (selectedRole === 'donor') {
          const donorData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            focusAreas: formData.focusAreas
          };
          result = await registerDonor(donorData);
        } else if (selectedRole === 'admin') {
          const adminData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            adminKey: 'SHOHAY_ADMIN_2025'
          };
          result = await registerAdmin(adminData);
        }

        if (result.success) {
          switch (selectedRole) {
            case 'donor':
              navigate('/donor');
              break;
            case 'ngo':
              navigate('/ngo/dashboard');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/');
          }
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    // Role selection UI
    return (
      <div className="auth-page">
        <div className="auth-container">
          {/* Left Side - Hero Section */}
          <div className="auth-left">
            <div className="auth-content">
              <div className="logo">
                <h2>Shohay</h2>
              </div>
              
              <div className="hero-content">
                <h1>
                  Become
                  <br />
                  <span className="highlight">a Volunteer</span>
                </h1>
                
                <p className="description">
                  Join our mission to create positive change in communities. 
                  Connect with NGOs and donors to build a better tomorrow through 
                  compassionate giving and impactful projects.
                </p>
                
                <button className="read-more-btn" onClick={() => navigate('/')}>
                  READ MORE →
                </button>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="illustration">
              <div className="donation-jar">
                <div className="jar-body"></div>
                <div className="jar-lid"></div>
                <div className="hearts">
                  <div className="heart heart-1">❤️</div>
                  <div className="heart heart-2">❤️</div>
                  <div className="heart heart-3">❤️</div>
                  <div className="heart heart-4">❤️</div>
                </div>
              </div>
              
              <div className="people">
                <div className="person person-1">
                  <div className="person-body"></div>
                  <div className="person-head"></div>
                </div>
                <div className="person person-2">
                  <div className="person-body"></div>
                  <div className="person-head"></div>
                </div>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="nav-dots">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="auth-right">
            <div className="role-selector">
              <div className="form-header">
                <h2>Select Your Role</h2>
                <p>Choose how you'd like to contribute to our mission:</p>
              </div>
              
              <div className="role-cards">
                {roles.map(role => (
                  <div
                    key={role.id}
                    className={`role-card ${selectedRole === role.id ? "selected" : ""}`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="role-icon">{role.icon}</div>
                    <h4>{role.title}</h4>
                    <p>{role.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="role-footer">
                <p>
                  Already have an account?{' '}
                  <button 
                    className="toggle-btn"
                    onClick={() => setIsLogin(true)}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Hero Section */}
        <div className="auth-left">
          <div className="auth-content">
            <div className="logo">
              <h2>Shohay</h2>
            </div>
            
            <div className="hero-content">
              <h1>
                {isLogin ? 'Welcome Back' : 'Join Our Mission'}
                <br />
                <span className="highlight">
                  {isLogin ? 'to Shohay' : 'Make a Difference'}
                </span>
              </h1>
              
              <p className="description">
                {isLogin 
                  ? 'Sign in to continue your journey of making positive impact in communities.'
                  : 'Create your account and start contributing to meaningful causes today.'
                }
              </p>
              
              <button className="read-more-btn" onClick={() => navigate('/')}>
                READ MORE →
              </button>
            </div>
          </div>
          
          {/* Illustration */}
          <div className="illustration">
            <div className="donation-jar">
              <div className="jar-body"></div>
              <div className="jar-lid"></div>
              <div className="hearts">
                <div className="heart heart-1">❤️</div>
                <div className="heart heart-2">❤️</div>
                <div className="heart heart-3">❤️</div>
                <div className="heart heart-4">❤️</div>
              </div>
            </div>
            
            <div className="people">
              <div className="person person-1">
                <div className="person-body"></div>
                <div className="person-head"></div>
              </div>
              <div className="person person-2">
                <div className="person-body"></div>
                <div className="person-head"></div>
              </div>
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="nav-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <button className="back-button" onClick={() => setSelectedRole(null)}>
              ← Back to Role Selection
            </button>

            <div className="form-header">
              <h2>
                {isLogin ? 'Sign In' : 'Sign Up'} as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </h2>
              <p>
                {isLogin 
                  ? 'Welcome back! Please sign in to your account.' 
                  : 'Create your account to get started.'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Common Fields */}
              {!isLogin && selectedRole !== 'ngo' && (
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              {/* NGO Specific Fields */}
              {!isLogin && selectedRole === 'ngo' && (
                <>
                  <div className="form-group">
                    <label>Organization Name *</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="Enter organization name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Registration Number *</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="Enter registration number"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {/* Additional Fields for Registration */}
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  {selectedRole === 'ngo' && (
                    <>
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter organization address"
                          rows="3"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>State/Division</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Website</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="Enter website URL"
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your organization and mission"
                          rows="4"
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label>Focus Areas</label>
                    <div className="focus-checkboxes">
                      {focusAreasList.map(area => (
                        <label key={area} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.focusAreas.includes(area)}
                            onChange={() => toggleFocusArea(area)}
                          />
                          <span className="checkmark"></span>
                          {area}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button"
                  className="toggle-btn"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="forgot-password">
                <button type="button" className="forgot-btn">
                  Forgot Password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
