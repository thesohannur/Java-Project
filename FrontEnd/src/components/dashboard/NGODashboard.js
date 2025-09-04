import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/NGODashboard.css';

const NGODashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const helpSectionRef = useRef(null);
  
  // State management
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [helpVisible, setHelpVisible] = useState(false);
  
  // NGO data states
  const [ngoProfile, setNgoProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [categoryDonations, setCategoryDonations] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({});
  
  // Form states
  const [profileUpdateData, setProfileUpdateData] = useState({});
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false
  });
  const [preferences, setPreferences] = useState({
    preferredLanguage: 'en',
    timezone: 'Asia/Dhaka'
  });

  // Campaign/Event management
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    target: '',
    category: '',
    image: ''
  });

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Fetch all dashboard data - wrapped with useCallback to fix dependency warning
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch NGO profile
      try {
        const profileResponse = await fetch(`${API_BASE}/ngo/profile`, { headers });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setNgoProfile(profileData.data);
          setProfileUpdateData(profileData.data);
        }
      } catch (err) {
        console.warn('Failed to fetch profile:', err);
      }

      // Fetch dashboard statistics
      try {
        const statsResponse = await fetch(`${API_BASE}/ngo/dashboard/stats`, { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setDashboardStats(statsData.data);
        }
      } catch (err) {
        console.warn('Failed to fetch stats:', err);
      }

      // Fetch recent activities
      try {
        const activitiesResponse = await fetch(`${API_BASE}/ngo/dashboard/activities`, { headers });
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData.data || []);
        }
      } catch (err) {
        console.warn('Failed to fetch activities:', err);
        setRecentActivities([]);
      }

      // Fetch category-wise donations
      try {
        const categoryResponse = await fetch(`${API_BASE}/ngo/dashboard/donations/category`, { headers });
        if (categoryResponse.ok) {
          const categoryData = await categoryResponse.json();
          setCategoryDonations(categoryData.data || {});
        }
      } catch (err) {
        console.warn('Failed to fetch category donations:', err);
        setCategoryDonations({});
      }

      // Fetch verification status
      try {
        const verificationResponse = await fetch(`${API_BASE}/ngo/verification/status`, { headers });
        if (verificationResponse.ok) {
          const verificationData = await verificationResponse.json();
          setVerificationStatus(verificationData.data);
        }
      } catch (err) {
        console.warn('Failed to fetch verification status:', err);
        setVerificationStatus({});
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Fetch data on component mount - fixed dependency array
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // IntersectionObserver for help section
  useEffect(() => {
    const currentRef = helpSectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHelpVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/ngo/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileUpdateData)
      });

      if (response.ok) {
        const result = await response.json();
        setNgoProfile(result.data);
        setError('');
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  // Handle monthly goal update
  const handleMonthlyGoalUpdate = async () => {
    if (!monthlyGoal || monthlyGoal <= 0) {
      setError('Please enter a valid monthly goal');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/ngo/goals/monthly?monthlyGoal=${monthlyGoal}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
        setMonthlyGoal('');
        alert('Monthly goal updated successfully!');
      } else {
        throw new Error('Failed to update goal');
      }
    } catch (error) {
      setError('Failed to update monthly goal');
      console.error('Goal update error:', error);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE}/ngo/settings/notifications?emailNotifications=${notificationSettings.emailNotifications}&smsNotifications=${notificationSettings.smsNotifications}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        alert('Notification settings updated successfully!');
      } else {
        throw new Error('Failed to update notifications');
      }
    } catch (error) {
      setError('Failed to update notification settings');
      console.error('Notification update error:', error);
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE}/ngo/settings/preferences?preferredLanguage=${preferences.preferredLanguage}&timezone=${preferences.timezone}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        alert('Preferences updated successfully!');
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      setError('Failed to update preferences');
      console.error('Preferences update error:', error);
    }
  };

  // Handle campaign creation
  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    
    if (!newCampaign.title || !newCampaign.description || !newCampaign.target || !newCampaign.category) {
      setError('Please fill in all required campaign fields');
      return;
    }

    // This would typically call a campaigns API endpoint
    // For now, we'll add it to local state
    const newCampaignObj = {
      ...newCampaign,
      id: Date.now(),
      target: parseFloat(newCampaign.target),
      achieved: 0,
      createdDate: new Date().toISOString()
    };
    
    setCampaigns([...campaigns, newCampaignObj]);
    setNewCampaign({
      title: '',
      description: '',
      target: '',
      category: '',
      image: ''
    });
    setError('');
    alert('Campaign created successfully!');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="ngo-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src={ngoProfile?.logo || '/default-ngo-logo.png'} 
              alt="NGO Logo" 
              className="ngo-logo"
              onError={(e) => {
                e.target.src = '/default-ngo-logo.png';
              }}
            />
            <div>
              <h1>{ngoProfile?.organizationName || 'NGO Dashboard'}</h1>
              <p className="verification-status">
                {verificationStatus.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <span>Welcome, {ngoProfile?.contactPerson || 'User'}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={view === 'dashboard' ? 'active' : ''} 
          onClick={() => setView('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={view === 'campaigns' ? 'active' : ''} 
          onClick={() => setView('campaigns')}
        >
          🎯 Campaigns
        </button>
        <button 
          className={view === 'analytics' ? 'active' : ''} 
          onClick={() => setView('analytics')}
        >
          📈 Analytics
        </button>
        <button 
          className={view === 'profile' ? 'active' : ''} 
          onClick={() => setView('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={view === 'settings' ? 'active' : ''} 
          onClick={() => setView('settings')}
        >
          ⚙️ Settings
        </button>
        <button 
          className={view === 'help' ? 'active' : ''} 
          onClick={() => setView('help')}
        >
          ❓ Help
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        {/* Dashboard Overview */}
        {view === 'dashboard' && (
          <div className="dashboard-overview">
            <h2>Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Received</h3>
                <p className="stat-value">৳{dashboardStats.totalReceived?.toLocaleString() || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Donors</h3>
                <p className="stat-value">{dashboardStats.totalDonors || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Active Campaigns</h3>
                <p className="stat-value">{dashboardStats.activeCampaigns || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Beneficiaries Reached</h3>
                <p className="stat-value">{dashboardStats.beneficiariesReached || 0}</p>
              </div>
            </div>

            {/* Monthly Goal Progress */}
            <div className="goal-progress">
              <h3>Monthly Goal Progress</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(dashboardStats.goalProgress || 0, 100)}%` }}
                ></div>
              </div>
              <p>
                ৳{dashboardStats.currentMonthReceived?.toLocaleString() || 0} / ৳{dashboardStats.monthlyGoal?.toLocaleString() || 0} 
                ({(dashboardStats.goalProgress || 0).toFixed(1)}%)
              </p>
            </div>

            {/* Recent Activities */}
            <div className="recent-activities">
              <h3>Recent Activities</h3>
              <div className="activities-list">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <p>{activity}</p>
                    </div>
                  ))
                ) : (
                  <div className="activity-item">
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campaigns View */}
        {view === 'campaigns' && (
          <div className="campaigns-section">
            <h2>Campaign Management</h2>
            
            {/* Create New Campaign */}
            <div className="create-campaign">
              <h3>Create New Campaign</h3>
              <form onSubmit={handleCampaignSubmit} className="campaign-form">
                <input
                  type="text"
                  placeholder="Campaign Title *"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Campaign Description *"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Target Amount (৳) *"
                  value={newCampaign.target}
                  onChange={(e) => setNewCampaign({...newCampaign, target: e.target.value})}
                  min="1"
                  required
                />
                <select
                  value={newCampaign.category}
                  onChange={(e) => setNewCampaign({...newCampaign, category: e.target.value})}
                  required
                >
                  <option value="">Select Category *</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                  <option value="Poverty Alleviation">Poverty Alleviation</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                </select>
                <input
                  type="url"
                  placeholder="Campaign Image URL (Optional)"
                  value={newCampaign.image}
                  onChange={(e) => setNewCampaign({...newCampaign, image: e.target.value})}
                />
                <button type="submit" className="create-btn">Create Campaign</button>
              </form>
            </div>

            {/* Campaign List */}
            <div className="campaigns-list">
              <h3>Your Campaigns ({campaigns.length})</h3>
              {campaigns.length > 0 ? (
                <div className="campaigns-grid">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="campaign-card" onClick={() => setSelectedCampaign(campaign)}>
                      {campaign.image && (
                        <img 
                          src={campaign.image} 
                          alt={campaign.title} 
                          className="campaign-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="campaign-content">
                        <h4>{campaign.title}</h4>
                        <p>{campaign.description.substring(0, 100)}...</p>
                        <div className="campaign-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${Math.min((campaign.achieved / campaign.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p>৳{campaign.achieved.toLocaleString()} / ৳{campaign.target.toLocaleString()}</p>
                          <small>{((campaign.achieved / campaign.target) * 100).toFixed(1)}% Complete</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-campaigns">
                  <p>No campaigns created yet. Create your first campaign above!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="analytics-section">
            <h2>Analytics & Reports</h2>
            
            {/* Category-wise Donations */}
            <div className="category-donations">
              <h3>Category-wise Donations</h3>
              <div className="category-chart">
                {Object.keys(categoryDonations).length > 0 ? (
                  Object.entries(categoryDonations).map(([category, amount]) => (
                    <div key={category} className="category-item">
                      <span>{category}</span>
                      <span>৳{amount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p>No donation data available</p>
                )}
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="impact-metrics">
              <h3>Impact Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <h4>Impact Score</h4>
                  <p className="metric-value">{dashboardStats.impactScore || 0}/100</p>
                </div>
                <div className="metric-card">
                  <h4>Completed Projects</h4>
                  <p className="metric-value">{dashboardStats.completedProjects || 0}</p>
                </div>
                <div className="metric-card">
                  <h4>Active Campaigns</h4>
                  <p className="metric-value">{campaigns.length}</p>
                </div>
                <div className="metric-card">
                  <h4>Success Rate</h4>
                  <p className="metric-value">{dashboardStats.successRate || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile View */}
        {view === 'profile' && (
          <div className="profile-section">
            <h2>Organization Profile</h2>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  value={profileUpdateData.organizationName || ''}
                  onChange={(e) => setProfileUpdateData({...profileUpdateData, organizationName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={profileUpdateData.registrationNumber || ''}
                  onChange={(e) => setProfileUpdateData({...profileUpdateData, registrationNumber: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={profileUpdateData.description || ''}
                  onChange={(e) => setProfileUpdateData({...profileUpdateData, description: e.target.value})}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={profileUpdateData.website || ''}
                  onChange={(e) => setProfileUpdateData({...profileUpdateData, website: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileUpdateData.phoneNumber || ''}
                  onChange={(e) => setProfileUpdateData({...profileUpdateData, phoneNumber: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={profileUpdateData.address || ''}
                  onChange={(e) => setProfileUpdateData({...profileUpdateData, address: e.target.value})}
                  rows="3"
                />
              </div>
              <button type="submit" className="update-btn">Update Profile</button>
            </form>
          </div>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <div className="settings-section">
            <h2>Settings</h2>
            
            {/* Monthly Goal Setting */}
            <div className="setting-group">
              <h3>Monthly Fundraising Goal</h3>
              <div className="goal-setting">
                <input
                  type="number"
                  placeholder="Enter monthly goal (৳)"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  min="1"
                />
                <button onClick={handleMonthlyGoalUpdate} className="update-btn">Update Goal</button>
              </div>
              <p className="current-goal">
                Current Goal: ৳{dashboardStats.monthlyGoal?.toLocaleString() || 0}
              </p>
            </div>

            {/* Notification Settings */}
            <div className="setting-group">
              <h3>Notification Preferences</h3>
              <div className="notification-settings">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings, 
                      emailNotifications: e.target.checked
                    })}
                  />
                  Email Notifications
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings, 
                      smsNotifications: e.target.checked
                    })}
                  />
                  SMS Notifications
                </label>
                <button onClick={handleNotificationUpdate} className="update-btn">Update Notifications</button>
              </div>
            </div>

            {/* Language & Timezone */}
            <div className="setting-group">
              <h3>Preferences</h3>
              <div className="preferences-settings">
                <div className="preference-item">
                  <label>Language</label>
                  <select
                    value={preferences.preferredLanguage}
                    onChange={(e) => setPreferences({...preferences, preferredLanguage: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="bn">বাংলা</option>
                  </select>
                </div>
                <div className="preference-item">
                  <label>Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
              <button onClick={handlePreferencesUpdate} className="update-btn">Update Preferences</button>
            </div>
          </div>
        )}

        {/* Help View */}
        {view === 'help' && (
          <div 
            ref={helpSectionRef}
            className={`help-section ${helpVisible ? 'visible' : ''}`}
          >
            <h2>Help & Support</h2>
            <div className="help-content">
              <div className="help-item">
                <h3>📊 Dashboard Overview</h3>
                <p>View your organization's key metrics, donation progress, and recent activities. Monitor your monthly goals and track performance indicators.</p>
              </div>
              <div className="help-item">
                <h3>🎯 Campaign Management</h3>
                <p>Create and manage fundraising campaigns. Set targets, track progress, and engage with donors. Upload images and detailed descriptions to attract more supporters.</p>
              </div>
              <div className="help-item">
                <h3>📈 Analytics</h3>
                <p>Analyze donation patterns, impact metrics, and performance indicators. View category-wise donations and track your organization's success rate.</p>
              </div>
              <div className="help-item">
                <h3>👤 Profile Management</h3>
                <p>Update your organization's information, contact details, and verification status. Keep your profile current to build trust with donors.</p>
              </div>
              <div className="help-item">
                <h3>⚙️ Settings</h3>
                <p>Configure monthly goals, notification preferences, and account settings. Customize your experience and stay informed about important updates.</p>
              </div>
            </div>
            
            <div className="contact-support">
              <h3>Need More Help?</h3>
              <p>Contact our support team:</p>
              <p>📧 Email: support@shohay.org</p>
              <p>📞 Phone: +880-1234-567890</p>
              <p>🕒 Support Hours: 9 AM - 6 PM (GMT+6)</p>
            </div>
          </div>
        )}
      </main>

      {/* Selected Campaign Modal */}
      {selectedCampaign && (
        <div className="modal-overlay" onClick={() => setSelectedCampaign(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCampaign(null)}>×</button>
            <h2>{selectedCampaign.title}</h2>
            {selectedCampaign.image && (
              <img 
                src={selectedCampaign.image} 
                alt={selectedCampaign.title} 
                className="modal-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <p>{selectedCampaign.description}</p>
            <div className="campaign-details">
              <p><strong>Category:</strong> {selectedCampaign.category}</p>
              <p><strong>Target:</strong> ৳{selectedCampaign.target.toLocaleString()}</p>
              <p><strong>Achieved:</strong> ৳{selectedCampaign.achieved.toLocaleString()}</p>
              <p><strong>Created:</strong> {new Date(selectedCampaign.createdDate).toLocaleDateString()}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((selectedCampaign.achieved / selectedCampaign.target) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {((selectedCampaign.achieved / selectedCampaign.target) * 100).toFixed(1)}% Complete
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;
