import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const RegisterAdmin = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { registerAdmin } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
    
    // Admin Details
    adminLevel: 'MODERATOR',
    department: 'GENERAL',
    employeeId: '',
    designation: '',
    
    // Contact Information
    phoneNumber: '',
    alternateEmail: '',
    address: '',
    
    // Location
    country: 'Bangladesh',
    state: '',
    city: '',
    workLocation: 'HEAD_OFFICE',
    
    // Emergency Contact
    emergencyContact: '',
    emergencyContactPhone: '',
    
    // Work Information
    workShift: 'DAY',
    supervisorId: '',
    reportingManager: '',
    
    // Settings
    preferredLanguage: 'en',
    timezone: 'Asia/Dhaka',
    theme: 'LIGHT',
    emailNotifications: true,
    systemAlerts: true,
    reportNotifications: true,
    
    // Security
    twoFactorEnabled: false,
    
    // Additional
    additionalNotes: ''
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const adminLevels = [
    { value: 'MODERATOR', label: 'Moderator', description: 'Basic moderation and support tasks' },
    { value: 'ADMIN', label: 'Administrator', description: 'Full admin access with user management' },
    { value: 'SUPER_ADMIN', label: 'Super Administrator', description: 'Complete system access and control' }
  ];

  const departments = [
    { value: 'GENERAL', label: 'General Administration' },
    { value: 'NGO_VERIFICATION', label: 'NGO Verification' },
    { value: 'DONOR_SUPPORT', label: 'Donor Support' },
    { value: 'FINANCE', label: 'Finance & Accounting' },
    { value: 'TECHNICAL', label: 'Technical Support' },
    { value: 'CONTENT_MODERATION', label: 'Content Moderation' }
  ];

  const bangladeshStates = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ];

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.match(/[a-z]/)) strength += 25;
      if (password.match(/[A-Z]/)) strength += 25;
      if (password.match(/[0-9]/)) strength += 15;
      if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.adminKey) newErrors.adminKey = 'Admin key is required';
    }

    if (step === 2) {
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
      if (formData.phoneNumber && !/^(\+88)?01[3-9]\d{8}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Invalid Bangladeshi phone number format';
      }
    }

    if (step === 3) {
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Prepare admin data for backend
      const adminData = {
        // Basic fields
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        adminKey: formData.adminKey,
        
        // Admin specific fields
        adminLevel: formData.adminLevel,
        department: formData.department,
        employeeId: formData.employeeId || null,
        designation: formData.designation,
        
        // Contact information
        phoneNumber: formData.phoneNumber || null,
        alternateEmail: formData.alternateEmail || null,
        address: formData.address || null,
        
        // Location
        country: formData.country,
        state: formData.state,
        city: formData.city,
        workLocation: formData.workLocation,
        
        // Emergency contact
        emergencyContact: formData.emergencyContact || null,
        emergencyContactPhone: formData.emergencyContactPhone || null,
        
        // Work information
        workShift: formData.workShift,
        supervisorId: formData.supervisorId || null,
        reportingManager: formData.reportingManager || null,
        
        // Settings
        preferredLanguage: formData.preferredLanguage,
        timezone: formData.timezone,
        theme: formData.theme,
        emailNotifications: formData.emailNotifications,
        systemAlerts: formData.systemAlerts,
        reportNotifications: formData.reportNotifications,
        
        // Security
        twoFactorEnabled: formData.twoFactorEnabled,
        
        // Additional
        additionalNotes: formData.additionalNotes || null
      };

      console.log('Admin registration data:', adminData);

      const result = await registerAdmin(adminData);

      if (result.success) {
        setMessage('Admin registration successful! Welcome to Shohay Admin Panel!');
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      setMessage('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return '#ff4757';
    if (passwordStrength < 60) return '#ffa502';
    if (passwordStrength < 80) return '#2ed573';
    return '#1e90ff';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3>👤 Basic Information</h3>
      
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          className={errors.fullName ? 'error' : ''}
          required
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label>Official Email *</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your official email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Password *</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            minLength="8"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className="strength-fill" 
                style={{ 
                  width: `${passwordStrength}%`, 
                  backgroundColor: getPasswordStrengthColor() 
                }}
              ></div>
            </div>
            <span style={{ color: getPasswordStrengthColor() }}>
              {getPasswordStrengthText()}
            </span>
          </div>
        )}
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label>Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'error' : ''}
          required
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label>Admin Registration Key *</label>
        <input
          type="password"
          name="adminKey"
          placeholder="Enter admin registration key"
          value={formData.adminKey}
          onChange={handleChange}
          className={errors.adminKey ? 'error' : ''}
          required
        />
        {errors.adminKey && <span className="error-message">{errors.adminKey}</span>}
        <small className="form-hint">
          Contact your system administrator for the registration key
        </small>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>🏢 Professional Information</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Admin Level *</label>
          <select
            name="adminLevel"
            value={formData.adminLevel}
            onChange={handleChange}
            required
          >
            {adminLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <small className="form-hint">
            {adminLevels.find(l => l.value === formData.adminLevel)?.description}
          </small>
        </div>
        
        <div className="form-group">
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={errors.department ? 'error' : ''}
            required
          >
            {departments.map(dept => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {errors.department && <span className="error-message">{errors.department}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Employee ID</label>
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID (if applicable)"
            value={formData.employeeId}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Designation *</label>
          <input
            type="text"
            name="designation"
            placeholder="Your job title/designation"
            value={formData.designation}
            onChange={handleChange}
            className={errors.designation ? 'error' : ''}
            required
          />
          {errors.designation && <span className="error-message">{errors.designation}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="01XXXXXXXXX"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? 'error' : ''}
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>
        
        <div className="form-group">
          <label>Alternate Email</label>
          <input
            type="email"
            name="alternateEmail"
            placeholder="Personal email (optional)"
            value={formData.alternateEmail}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Work Shift</label>
        <select
          name="workShift"
          value={formData.workShift}
          onChange={handleChange}
        >
          <option value="DAY">Day Shift (9 AM - 6 PM)</option>
          <option value="NIGHT">Night Shift (10 PM - 7 AM)</option>
          <option value="FLEXIBLE">Flexible Hours</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>📍 Location & Settings</h3>
      
      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          placeholder="Your address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>State/Division *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? 'error' : ''}
            required
          >
            <option value="">Select State</option>
            {bangladeshStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>
        
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'error' : ''}
            required
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Work Location</label>
        <select
          name="workLocation"
          value={formData.workLocation}
          onChange={handleChange}
        >
          <option value="HEAD_OFFICE">Head Office</option>
          <option value="REMOTE">Remote Work</option>
          <option value="FIELD_OFFICE">Field Office</option>
        </select>
      </div>

      <div className="form-group">
        <h4>Emergency Contact</h4>
        <div className="form-row">
          <input
            type="text"
            name="emergencyContact"
            placeholder="Emergency contact name"
            value={formData.emergencyContact}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="emergencyContactPhone"
            placeholder="Emergency contact phone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <h4>Preferences</h4>
        <div className="form-row">
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
          >
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <h4>Notification Settings</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            Email Notifications
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="systemAlerts"
              checked={formData.systemAlerts}
              onChange={handleChange}
            />
            System Alerts
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="reportNotifications"
              checked={formData.reportNotifications}
              onChange={handleChange}
            />
            Report Notifications
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="twoFactorEnabled"
              checked={formData.twoFactorEnabled}
              onChange={handleChange}
            />
            Enable Two-Factor Authentication
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Additional Notes</label>
        <textarea
          name="additionalNotes"
          placeholder="Any additional information or special requirements"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows="3"
        />
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="registration-header">
        <h2>🛡️ Admin Registration</h2>
        <p>Join the Shohay administrative team</p>
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              ← Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next →
            </button>
          ) : (
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Registering...' : '🚀 Register as Admin'}
            </button>
          )}
        </div>
      </form>

      {message && (
        <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <span className="auth-link" onClick={onSwitchToLogin || (() => navigate('/auth'))}>
            Login here
          </span>
        </p>
        
        <div className="security-notice">
          <p>🔒 <strong>Security Notice:</strong></p>
          <ul>
            <li>Admin registration requires a valid registration key</li>
            <li>All admin activities are logged and monitored</li>
            <li>Two-factor authentication is recommended for enhanced security</li>
            <li>Contact system administrator for assistance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdmin;
