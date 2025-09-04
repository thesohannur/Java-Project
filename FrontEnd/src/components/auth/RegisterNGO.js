import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const RegisterNGO = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { registerNGO } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    organizationName: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    website: '',
    description: '',
    focusAreas: [],
    contactPerson: '',
    
    // Extended Information for Dashboard
    alternateEmail: '',
    alternatePhone: '',
    country: 'Bangladesh',
    state: '',
    city: '',
    zipCode: '',
    
    // Financial Information
    bankAccountNumber: '',
    bankName: '',
    taxId: '',
    
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    
    // Goals and Targets
    monthlyGoal: '',
    targetBeneficiaries: '',
    
    // Organization Details
    organizationType: 'NGO',
    primaryCategory: '',
    establishmentYear: '',
    missionStatement: '',
    visionStatement: '',
    teamSize: '',
    volunteerCount: '',
    
    // Preferences
    emailNotifications: true,
    smsNotifications: false,
    preferredLanguage: 'en',
    timezone: 'Asia/Dhaka',
    
    // Certifications
    certifications: []
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const focusOptions = [
    'Education', 'Healthcare', 'Environment', 'Poverty Alleviation',
    'Disaster Relief', 'Animal Welfare', 'Human Rights', 'Technology Access',
    'Women Empowerment', 'Child Welfare', 'Elderly Care', 'Mental Health',
    'Rural Development', 'Urban Development', 'Food Security', 'Clean Water'
  ];

  const organizationTypes = [
    'NGO', 'CHARITY', 'FOUNDATION', 'TRUST', 'SOCIETY', 'COMPANY'
  ];

  const primaryCategories = [
    'Social Welfare', 'Education', 'Healthcare', 'Environment',
    'Human Rights', 'Community Development', 'Research', 'Advocacy'
  ];

  const bangladeshStates = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'focusAreas') {
        setFormData(prev => ({
          ...prev,
          focusAreas: checked
            ? [...prev.focusAreas, value]
            : prev.focusAreas.filter(area => area !== value)
        }));
      } else if (name === 'certifications') {
        setFormData(prev => ({
          ...prev,
          certifications: checked
            ? [...prev.certifications, value]
            : prev.certifications.filter(cert => cert !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
      if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!/^(\+88)?01[3-9]\d{8}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Invalid Bangladeshi phone number format';
      }
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.focusAreas.length === 0) newErrors.focusAreas = 'Please select at least one focus area';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }

    if (step === 3) {
      if (formData.establishmentYear && (formData.establishmentYear < 1900 || formData.establishmentYear > new Date().getFullYear())) {
        newErrors.establishmentYear = 'Invalid establishment year';
      }
      if (formData.monthlyGoal && formData.monthlyGoal < 0) {
        newErrors.monthlyGoal = 'Monthly goal must be positive';
      }
      if (formData.targetBeneficiaries && formData.targetBeneficiaries < 0) {
        newErrors.targetBeneficiaries = 'Target beneficiaries must be positive';
      }
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
      const ngoData = {
        // Basic required fields
        organizationName: formData.organizationName,
        registrationNumber: formData.registrationNumber,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        website: formData.website || null,
        description: formData.description,
        focusAreas: formData.focusAreas,
        contactPerson: formData.contactPerson,
        
        // Extended fields
        alternateEmail: formData.alternateEmail || null,
        alternatePhone: formData.alternatePhone || null,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipCode: formData.zipCode || null,
        
        // Financial information
        bankAccountNumber: formData.bankAccountNumber || null,
        bankName: formData.bankName || null,
        taxId: formData.taxId || null,
        
        // Social media
        facebookUrl: formData.facebookUrl || null,
        twitterUrl: formData.twitterUrl || null,
        linkedinUrl: formData.linkedinUrl || null,
        instagramUrl: formData.instagramUrl || null,
        
        // Goals
        monthlyGoal: formData.monthlyGoal ? parseFloat(formData.monthlyGoal) : null,
        targetBeneficiaries: formData.targetBeneficiaries ? parseInt(formData.targetBeneficiaries) : null,
        
        // Organization details
        organizationType: formData.organizationType,
        primaryCategory: formData.primaryCategory || null,
        establishmentYear: formData.establishmentYear ? parseInt(formData.establishmentYear) : null,
        missionStatement: formData.missionStatement || null,
        visionStatement: formData.visionStatement || null,
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : null,
        volunteerCount: formData.volunteerCount ? parseInt(formData.volunteerCount) : null,
        
        // Preferences
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        preferredLanguage: formData.preferredLanguage,
        timezone: formData.timezone,
        
        // Certifications
        certifications: formData.certifications
      };

      console.log('NGO registration data:', ngoData);

      const result = await registerNGO(ngoData);

      if (result.success) {
        setMessage('Registration successful! Welcome to Shohay!');
        setTimeout(() => {
          navigate('/ngo/dashboard');
        }, 2000);
      } else {
        setMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3>Basic Information</h3>
      
      <div className="form-group">
        <input
          type="text"
          name="organizationName"
          placeholder="Organization Name *"
          value={formData.organizationName}
          onChange={handleChange}
          className={errors.organizationName ? 'error' : ''}
          required
        />
        {errors.organizationName && <span className="error-message">{errors.organizationName}</span>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number *"
          value={formData.registrationNumber}
          onChange={handleChange}
          className={errors.registrationNumber ? 'error' : ''}
          required
        />
        {errors.registrationNumber && <span className="error-message">{errors.registrationNumber}</span>}
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Organization Email *"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            required
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number *"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? 'error' : ''}
            required
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="alternatePhone"
            placeholder="Alternate Phone (Optional)"
            value={formData.alternatePhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="contactPerson"
          placeholder="Contact Person Name *"
          value={formData.contactPerson}
          onChange={handleChange}
          className={errors.contactPerson ? 'error' : ''}
          required
        />
        {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
      </div>

      <div className="form-group">
        <input
          type="email"
          name="alternateEmail"
          placeholder="Alternate Email (Optional)"
          value={formData.alternateEmail}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>Organization Details</h3>
      
      <div className="form-group">
        <textarea
          name="address"
          placeholder="Organization Address *"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? 'error' : ''}
          required
        />
        {errors.address && <span className="error-message">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? 'error' : ''}
            required
          >
            <option value="">Select State *</option>
            {bangladeshStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <span className="error-message">{errors.state}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'error' : ''}
            required
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="zipCode"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <input
          type="url"
          name="website"
          placeholder="Website (Optional)"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          placeholder="Organization Description and Mission *"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? 'error' : ''}
          style={{ minHeight: '100px' }}
          required
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Focus Areas (select at least one) *:</label>
        <div className="focus-checkboxes">
          {focusOptions.map(area => (
            <label key={area} className="checkbox-label">
              <input
                type="checkbox"
                name="focusAreas"
                value={area}
                checked={formData.focusAreas.includes(area)}
                onChange={handleChange}
              />
              {area}
            </label>
          ))}
        </div>
        {errors.focusAreas && <span className="error-message">{errors.focusAreas}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
          >
            {organizationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            name="primaryCategory"
            value={formData.primaryCategory}
            onChange={handleChange}
          >
            <option value="">Select Primary Category</option>
            {primaryCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>Additional Information</h3>
      
      <div className="form-row">
        <div className="form-group">
          <input
            type="number"
            name="establishmentYear"
            placeholder="Establishment Year"
            value={formData.establishmentYear}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            className={errors.establishmentYear ? 'error' : ''}
          />
          {errors.establishmentYear && <span className="error-message">{errors.establishmentYear}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="teamSize"
            placeholder="Team Size"
            value={formData.teamSize}
            onChange={handleChange}
            min="1"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="volunteerCount"
            placeholder="Volunteer Count"
            value={formData.volunteerCount}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <textarea
          name="missionStatement"
          placeholder="Mission Statement"
          value={formData.missionStatement}
          onChange={handleChange}
          style={{ minHeight: '80px' }}
        />
      </div>

      <div className="form-group">
        <textarea
          name="visionStatement"
          placeholder="Vision Statement"
          value={formData.visionStatement}
          onChange={handleChange}
          style={{ minHeight: '80px' }}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="number"
            name="monthlyGoal"
            placeholder="Monthly Fundraising Goal (BDT)"
            value={formData.monthlyGoal}
            onChange={handleChange}
            min="0"
            className={errors.monthlyGoal ? 'error' : ''}
          />
          {errors.monthlyGoal && <span className="error-message">{errors.monthlyGoal}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="targetBeneficiaries"
            placeholder="Target Beneficiaries"
            value={formData.targetBeneficiaries}
            onChange={handleChange}
            min="0"
            className={errors.targetBeneficiaries ? 'error' : ''}
          />
          {errors.targetBeneficiaries && <span className="error-message">{errors.targetBeneficiaries}</span>}
        </div>
      </div>

      <h4>Social Media Links (Optional)</h4>
      <div className="form-row">
        <div className="form-group">
          <input
            type="url"
            name="facebookUrl"
            placeholder="Facebook URL"
            value={formData.facebookUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="url"
            name="twitterUrl"
            placeholder="Twitter URL"
            value={formData.twitterUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <input
            type="url"
            name="linkedinUrl"
            placeholder="LinkedIn URL"
            value={formData.linkedinUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="url"
            name="instagramUrl"
            placeholder="Instagram URL"
            value={formData.instagramUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      <h4>Banking Information (Optional)</h4>
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="bankAccountNumber"
            placeholder="Account Number"
            value={formData.bankAccountNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="taxId"
            placeholder="Tax ID"
            value={formData.taxId}
            onChange={handleChange}
          />
        </div>
      </div>

      <h4>Preferences</h4>
      <div className="form-row">
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            Email Notifications
          </label>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="smsNotifications"
              checked={formData.smsNotifications}
              onChange={handleChange}
            />
            SMS Notifications
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>
        <div className="form-group">
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
    </div>
  );

  return (
    <div className="auth-container">
      <div className="registration-header">
        <h2>Register NGO</h2>
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
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Registering...' : 'Register NGO'}
            </button>
          )}
        </div>
      </form>

      {message && (
        <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

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
