// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as donorService from '../services/donorService';
import * as ngoService from '../services/ngoService';

const Profile = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const [donorData, setDonorData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    occupation: ''
  });

  const [ngoData, setNgoData] = useState({
    organizationName: '',
    registrationNumber: '',
    contactPerson: '',
    phone: '',
    address: '',
    website: '',
    about: ''
  });

  const isDonor = user?.role === 'DONOR';
  const isNGO = user?.role === 'NGO';
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (isDonor) {
          const response = await donorService.getProfile?.();
          if (response?.data) setDonorData(response.data);
        } else if (isNGO) {
          const response = await ngoService.getProfile?.();
          if (response?.data) setNgoData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isDonor, isNGO, isAdmin]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (isDonor) {
        const updateData = Object.fromEntries(
          Object.entries(donorData).filter(([_, value]) => value?.trim())
        );
        await donorService.updateProfile(updateData);
      } else if (isNGO) {
        const updateData = Object.fromEntries(
          Object.entries(ngoData).filter(([_, value]) => value?.trim())
        );
        await ngoService.updateProfile(updateData);
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDonorChange = (field, value) => {
    setDonorData(prev => ({ ...prev, [field]: value }));
  };

  const handleNgoChange = (field, value) => {
    setNgoData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Account Profile</h1>
          <p className="dashboard-subtitle">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="profile-container">
        {/* Status Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {isAdmin && (
          <div className="admin-notice">
            <div className="notice-icon">🛡️</div>
            <div className="notice-content">
              <h3>Admin Account</h3>
              <p>Admin profiles are managed by the system and cannot be edited through this interface.</p>
            </div>
          </div>
        )}

        {isDonor && (
          <div className="profile-card">
            <div className="card-header">
              <div className="header-icon">👤</div>
              <div>
                <h2>Personal Information</h2>
                <p>Update your contact details and personal information</p>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={donorData.firstName}
                      onChange={(e) => handleDonorChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={donorData.lastName}
                      onChange={(e) => handleDonorChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={donorData.phone}
                      onChange={(e) => handleDonorChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-field">
                    <label>Occupation</label>
                    <input
                      type="text"
                      value={donorData.occupation}
                      onChange={(e) => handleDonorChange('occupation', e.target.value)}
                      placeholder="Enter your occupation"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Address</label>
                  <textarea
                    value={donorData.address}
                    onChange={(e) => handleDonorChange('address', e.target.value)}
                    placeholder="Enter your full address"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="save-icon">💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {isNGO && (
          <div className="profile-card">
            <div className="card-header">
              <div className="header-icon">🏢</div>
              <div>
                <h2>Organization Profile</h2>
                <p>Manage your NGO's information and contact details</p>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-section">
                <h3>Organization Details</h3>
                <div className="form-field">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    value={ngoData.organizationName}
                    onChange={(e) => handleNgoChange('organizationName', e.target.value)}
                    placeholder="Enter your organization name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Registration Number</label>
                    <input
                      type="text"
                      value={ngoData.registrationNumber}
                      onChange={(e) => handleNgoChange('registrationNumber', e.target.value)}
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div className="form-field">
                    <label>Website</label>
                    <input
                      type="url"
                      value={ngoData.website}
                      onChange={(e) => handleNgoChange('website', e.target.value)}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-field">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      value={ngoData.contactPerson}
                      onChange={(e) => handleNgoChange('contactPerson', e.target.value)}
                      placeholder="Enter contact person name"
                    />
                  </div>
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={ngoData.phone}
                      onChange={(e) => handleNgoChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Address</label>
                  <textarea
                    value={ngoData.address}
                    onChange={(e) => handleNgoChange('address', e.target.value)}
                    placeholder="Enter full organization address"
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>About Organization</h3>
                <div className="form-field">
                  <label>Description</label>
                  <textarea
                    value={ngoData.about}
                    onChange={(e) => handleNgoChange('about', e.target.value)}
                    placeholder="Tell us about your organization's mission and activities..."
                    rows="4"
                  />
                  <small className="field-hint">
                    Describe your organization's mission, goals, and impact
                  </small>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="save-icon">💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
