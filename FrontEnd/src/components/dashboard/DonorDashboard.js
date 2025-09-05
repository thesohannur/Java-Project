import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse-ngos');
  const [loading, setLoading] = useState(false);

  // Data states
  const [ngos, setNgos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('all');

  // Modal states
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Statistics state
  const [stats, setStats] = useState({
    totalNGOs: 0,
    activeCampaigns: 0,
    volunteerOpportunities: 0
  });

  useEffect(() => {
    fetchInitialData();
    fetchStats();
    // eslint-disable-next-line
  }, [activeTab, campaignFilter]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/public/statistics');
      const result = await response.json();
      if (result.success) setStats(result.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'browse-ngos') {
        await fetchNGOs();
      } else if (activeTab === 'campaigns') {
        await fetchCampaigns();
      } else if (activeTab === 'volunteer-opportunities') {
        await fetchVolunteerOpportunities();
      } else if (activeTab === 'my-donations') {
        await fetchMyDonations();
      } else if (activeTab === 'my-applications') {
        await fetchMyApplications();
      }
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- FIXED endpoints below ----------

  const fetchNGOs = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/public/ngos?${params}`);
      const result = await response.json();

      if (result.success) {
        setNgos(result.data || []);
      } else {
        toast.error('Failed to fetch NGOs');
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      toast.error('Failed to fetch NGOs');
    }
  };

  const fetchCampaigns = async () => {
    try {
      let endpoint = '/api/public/campaigns/approved';

      if (campaignFilter === 'money') {
        endpoint = '/api/public/campaigns/approved/money';
      } else if (campaignFilter === 'volunteer') {
        endpoint = '/api/public/campaigns/approved/volunteer';
      }

      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        setCampaigns(result.data || []);
      } else {
        toast.error('Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to fetch campaigns');
    }
  };

  const fetchVolunteerOpportunities = async () => {
    try {
      const response = await fetch('/api/public/volunteer-opportunities/active');
      const result = await response.json();

      if (result.success) {
        setVolunteerOpportunities(result.data || []);
      } else {
        toast.error('Failed to fetch volunteer opportunities');
      }
    } catch (error) {
      console.error('Error fetching volunteer opportunities', error);
      toast.error('Failed to fetch volunteer opportunities');
    }
  };

  // -------- donor-auth endpoints unchanged --------
  const fetchMyDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/donor/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setMyDonations(result.data || []);
      } else {
        toast.error('Failed to fetch donation history');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to fetch donation history');
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/donor/volunteer-applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setMyApplications(result.data || []);
      } else {
        toast.error('Failed to fetch volunteer applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch volunteer applications');
    }
  };

  // Other handlers
  const handleSearch = () => {
    if (activeTab === 'browse-ngos') {
      fetchNGOs();
    }
  };

  const handleDonation = async (donationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/donor/donations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('🎉 Donation successful! Thank you for your contribution.');
        setShowDonationModal(false);
        setSelectedItem(null);
      } else {
        toast.error(result.message || 'Donation failed');
      }
    } catch (error) {
      console.error('Error making donation:', error);
      toast.error('Donation failed');
    }
  };

  const handleVolunteerApplication = async (applicationData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/donor/volunteer-applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('🤝 Volunteer application submitted successfully!');
        setShowVolunteerModal(false);
        setSelectedItem(null);
      } else {
        toast.error(result.message || 'Application failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Application failed');
    }
  };

  const openDonationModal = (item, type = 'ngo') => {
    setSelectedItem({ ...item, type });
    setShowDonationModal(true);
  };

  const openVolunteerModal = (opportunity) => {
    setSelectedItem(opportunity);
    setShowVolunteerModal(true);
  };

  // ---------------------------- Render ----------------------------
  if (loading) {
    return (
      <div className="professional-loading">
        <div className="loading-container">
          <div className="professional-spinner"></div>
          <h3>Loading your dashboard...</h3>
          <p>Please wait while we fetch the latest data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-dashboard">
      {/* Modern Header */}
      <header className="dashboard-header-professional">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="main-title">
              <span className="emoji">🤝</span>
              Welcome to Shohay
            </h1>
            <p className="subtitle">Make an impact through donations and volunteering</p>
          </div>
          <div className="user-profile-section">
            <div className="user-avatar">
              <span>{user?.email?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-details">
              <div className="user-role-badge">DONOR</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon ngo">🏢</div>
            <div className="stat-content">
              <h3>{stats.totalNGOs || 0}</h3>
              <p>Total NGOs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon campaign">🎯</div>
            <div className="stat-content">
              <h3>{stats.activeCampaigns || 0}</h3>
              <p>Active Campaigns</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon volunteer">⏰</div>
            <div className="stat-content">
              <h3>{stats.volunteerOpportunities || 0}</h3>
              <p>Volunteer Opportunities</p>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Navigation */}
      <nav className="professional-nav">
        <div className="nav-container">
          {[
            { id: 'browse-ngos', label: '🏢 Browse NGOs', color: 'blue' },
            { id: 'campaigns', label: '🎯 Active Campaigns', color: 'purple' },
            { id: 'volunteer-opportunities', label: '⏰ Volunteer', color: 'green' },
            { id: 'my-donations', label: '💰 My Donations', color: 'yellow' },
            { id: 'my-applications', label: '📋 My Applications', color: 'red' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`donor-tab ${activeTab === tab.id ? 'active' : ''} ${tab.color}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-container">
          {/* Browse NGOs Tab */}
          {activeTab === 'browse-ngos' && (
            <div className="content-section">
              <div className="section-header-professional">
                <div className="section-title">
                  <h2>🏢 Browse NGOs</h2>
                  <p>Discover amazing organizations making a difference</p>
                </div>
                <div className="search-container">
                  <div className="search-input-group">
                    <input
                      type="text"
                      placeholder="Search NGOs by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="search-input-professional"
                    />
                    <button onClick={handleSearch} className="search-button-professional">
                      🔍 Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="professional-grid">
                {ngos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🏢</div>
                    <h3>No NGOs Found</h3>
                    <p>Try adjusting your search terms to discover more organizations.</p>
                    <button onClick={() => { setSearchTerm(''); fetchNGOs(); }} className="retry-button">
                      Show All NGOs
                    </button>
                  </div>
                ) : (
                  ngos.map((ngo) => (
                    <div key={ngo.ngoId} className="professional-card ngo-card">
                      <div className="card-header-professional">
                        <div className="organization-info">
                          <h3 className="organization-name">{ngo.organizationName}</h3>
                          {ngo.isVerified && (
                            <span className="verified-badge-professional">
                              ✅ Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="card-body-professional">
                        <div className="info-grid">
                          <div className="info-item">
                            <span className="info-label">Contact Person</span>
                            <span className="info-value">{ngo.contactPerson}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Location</span>
                            <span className="info-value">{ngo.address}</span>
                          </div>
                          <div className="info-item full-width">
                            <span className="info-label">Email</span>
                            <span className="info-value">{ngo.email}</span>
                          </div>
                        </div>

                        {ngo.description && (
                          <div className="description-section">
                            <p className="description-text">
                              {ngo.description.length > 120
                                ? `${ngo.description.substring(0, 120)}...`
                                : ngo.description
                              }
                            </p>
                          </div>
                        )}

                        {ngo.focusAreas && ngo.focusAreas.length > 0 && (
                          <div className="focus-areas-section">
                            <span className="focus-label">Focus Areas:</span>
                            <div className="focus-tags">
                              {ngo.focusAreas.map((area, index) => (
                                <span key={index} className="focus-tag">{area}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="card-actions-professional">
                        <button
                          className="donate-button-professional"
                          onClick={() => openDonationModal(ngo, 'ngo')}
                        >
                          💰 Donate Now
                        </button>
                        {ngo.website && (
                          <a
                            href={ngo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="website-button-professional"
                          >
                            🌐 Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Active Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="content-section">
              <div className="section-header-professional">
                <div className="section-title">
                  <h2>🎯 Active Campaigns</h2>
                  <p>Support ongoing campaigns making real impact</p>
                </div>
                <div className="filter-container">
                  <select
                    value={campaignFilter}
                    onChange={(e) => setCampaignFilter(e.target.value)}
                    className="filter-select-professional"
                  >
                    <option value="all">All Campaigns</option>
                    <option value="money">💰 Money Donations</option>
                    <option value="volunteer">⏰ Volunteer Time</option>
                  </select>
                </div>
              </div>

              <div className="professional-grid">
                {campaigns.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <h3>No Active Campaigns</h3>
                    <p>Check back soon for new campaigns to support!</p>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign.campaignId} className="professional-card campaign-card">
                      <div className="card-header-professional">
                        <h3 className="campaign-title">{campaign.description}</h3>
                        <div className="campaign-types-professional">
                          {campaign.acceptsMoney && (
                            <span className="type-badge money-badge">💰 Money</span>
                          )}
                          {campaign.acceptsTime && (
                            <span className="type-badge time-badge">⏰ Time</span>
                          )}
                        </div>
                      </div>

                      <div className="card-body-professional">
                        <div className="campaign-info">
                          <div className="campaign-detail">
                            <span className="detail-label">Organization</span>
                            <span className="detail-value">{campaign.ngoEmail}</span>
                          </div>

                          {campaign.amount > 0 && (
                            <div className="campaign-detail">
                            <span className="detail-label">Amount Raised</span>
                            <span className="detail-value amount">${campaign.amount}</span>
                            </div>
                          )}

                          {campaign.expirationTime && (
                            <div className="campaign-detail">
                              <span className="detail-label">Expires</span>
                              <span className="detail-value">
                                {new Date(campaign.expirationTime).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          <div className="campaign-detail">
                            <span className="detail-label">Started</span>
                            <span className="detail-value">
                              {new Date(campaign.creationTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="card-actions-professional">
                        {campaign.acceptsMoney && (
                          <button
                            className="donate-button-professional"
                            onClick={() => openDonationModal(campaign, 'campaign')}
                          >
                            💰 Donate Money
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Volunteer Opportunities Tab */}
          {activeTab === 'volunteer-opportunities' && (
            <div className="content-section">
              <div className="section-header-professional">
                <div className="section-title">
                  <h2>⏰ Volunteer Opportunities</h2>
                  <p>Donate your time and skills to make a difference</p>
                </div>
              </div>

              <div className="professional-grid">
                {volunteerOpportunities.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🤝</div>
                    <h3>No Volunteer Opportunities</h3>
                    <p>Check back soon for new ways to volunteer your time!</p>
                  </div>
                ) : (
                  volunteerOpportunities.map((opportunity) => (
                    <div key={opportunity.opportunityId} className="professional-card volunteer-card">
                      <div className="card-header-professional">
                        <h3 className="opportunity-title">{opportunity.title}</h3>
                        {opportunity.linkedCampaignId && (
                          <span className="linked-badge-professional">🔗 Campaign Linked</span>
                        )}
                      </div>

                      <div className="card-body-professional">
                        <p className="opportunity-description">{opportunity.description}</p>
                        <div className="opportunity-details">
                          {opportunity.location && (
                            <div className="detail-item">
                              <span className="detail-icon">📍</span>
                              <span>{opportunity.location}</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <span className="detail-icon">👥</span>
                            <span>
                              {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers
                            </span>
                          </div>
                          {opportunity.startDate && (
                            <div className="detail-item">
                              <span className="detail-icon">📅</span>
                              <span>Starts: {new Date(opportunity.startDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 && (
                          <div className="skills-section">
                            <span className="skills-label">Required Skills:</span>
                            <div className="skills-tags">
                              {opportunity.skillsRequired.map((skill, index) => (
                                <span key={index} className="skill-tag-professional">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="card-actions-professional">
                        <button
                          className={`volunteer-button-professional ${
                            opportunity.currentVolunteers >= opportunity.maxVolunteers ? 'disabled' : ''
                          }`}
                          onClick={() => openVolunteerModal(opportunity)}
                          disabled={opportunity.currentVolunteers >= opportunity.maxVolunteers}
                        >
                          {opportunity.currentVolunteers >= opportunity.maxVolunteers
                            ? '❌ Position Full'
                            : '🤝 Apply to Volunteer'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* My Donations Tab */}
          {activeTab === 'my-donations' && (
            <div className="content-section">
              <div className="section-header-professional">
                <div className="section-title">
                  <h2>💰 My Donation History</h2>
                  <p>Track your generous contributions</p>
                </div>
              </div>

              <div className="history-container">
                {myDonations.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <h3>No Donations Yet</h3>
                    <p>Your donation history will appear here after your first contribution.</p>
                    <button
                      onClick={() => setActiveTab('browse-ngos')}
                      className="browse-button-professional"
                    >
                      Browse NGOs to Donate
                    </button>
                  </div>
                ) : (
                  myDonations.map((donation) => (
                    <div key={donation.paymentId || donation.donorId} className="history-card-professional">
                      <div className="history-header">
                        <div className="history-title">
                          <span className="history-icon">💰</span>
                          <h4>Donation</h4>
                        </div>
                        <span className={`status-badge-professional ${(donation.status || 'success').toLowerCase()}`}>
                          {donation.status || 'SUCCESS'}
                        </span>
                      </div>
                      <div className="history-details">
                        <div className="history-amount">${donation.amount}</div>
                        <div className="history-date">
                          {new Date(donation.timestamp || donation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* My Applications Tab */}
          {activeTab === 'my-applications' && (
            <div className="content-section">
              <div className="section-header-professional">
                <div className="section-title">
                  <h2>📋 My Volunteer Applications</h2>
                  <p>Track your volunteer application status</p>
                </div>
              </div>

              <div className="history-container">
                {myApplications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No Applications Yet</h3>
                    <p>Your volunteer applications will appear here once you apply.</p>
                    <button
                      onClick={() => setActiveTab('volunteer-opportunities')}
                      className="browse-button-professional"
                    >
                      Browse Volunteer Opportunities
                    </button>
                  </div>
                ) : (
                  myApplications.map((application) => (
                    <div key={application.volunteerId} className="history-card-professional">
                      <div className="history-header">
                        <div className="history-title">
                          <span className="history-icon">🤝</span>
                          <h4>Volunteer Application</h4>
                        </div>
                        <span className={`status-badge-professional ${(application.status || 'pending').toLowerCase()}`}>
                          {application.status || 'PENDING'}
                        </span>
                      </div>
                      <div className="history-details">
                        <div className="application-info">
                          <span>Hours Committed: {application.hoursCommitted}</span>
                          <span>Applied: {new Date(application.applicationDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showDonationModal && selectedItem && (
        <DonationModal
          item={selectedItem}
          onClose={() => {
            setShowDonationModal(false);
            setSelectedItem(null);
          }}
          onSubmit={handleDonation}
        />
      )}

      {showVolunteerModal && selectedItem && (
        <VolunteerModal
          opportunity={selectedItem}
          onClose={() => {
            setShowVolunteerModal(false);
            setSelectedItem(null);
          }}
          onSubmit={handleVolunteerApplication}
        />
      )}
    </div>
  );
};

// Donation Modal
const DonationModal = ({ item, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 50) {
      toast.error('Amount must be greater than $50');
      return;
    }

    setLoading(true);

    const donationData = {
      amount: parseFloat(amount),
      message: message.trim(),
      ...(item.type === 'ngo' ? { ngoId: item.ngoId } : { campaignId: item.campaignId })
    };

    await onSubmit(donationData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay-professional" onClick={onClose}>
      <div className="modal-professional donation-modal-professional" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-professional">
          <h2>💰 Make a Donation</h2>
          <button className="close-button-professional" onClick={onClose}>×</button>
        </div>
        <div className="modal-content-professional">
          <div className="donation-target-professional">
            <h3>You're donating to:</h3>
            <p className="target-name">{item.type === 'ngo' ? item.organizationName : item.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="donation-form-professional">
            <div className="form-group-professional">
              <label>Donation Amount ($)</label>
              <div className="amount-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  min="51"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (minimum $51)"
                  required
                  className="amount-input-professional"
                />
              </div>
            </div>
            <div className="form-group-professional">
              <label>Personal Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message to inspire others..."
                rows="3"
                className="message-textarea-professional"
              />
            </div>
            <div className="modal-actions-professional">
              <button type="button" onClick={onClose} className="cancel-button-professional">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-button-professional">
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  `Donate $${amount || '0'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Volunteer Modal
const VolunteerModal = ({ opportunity, onClose, onSubmit }) => {
  const [hours, setHours] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hours || parseInt(hours) < 1) {
      toast.error('Hours must be at least 1');
      return;
    }

    if (!message.trim()) {
      toast.error('Please tell us why you want to volunteer');
      return;
    }

    setLoading(true);

    const applicationData = {
      opportunityId: opportunity.opportunityId,
      hoursCommitted: parseInt(hours),
      message: message.trim()
    };

    await onSubmit(applicationData);
    setLoading(false);
  };

  return (
    <div className="modal-overlay-professional" onClick={onClose}>
      <div className="modal-professional volunteer-modal-professional" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-professional">
          <h2>🤝 Apply for Volunteer Position</h2>
          <button className="close-button-professional" onClick={onClose}>×</button>
        </div>
        <div className="modal-content-professional">
          <div className="volunteer-target-professional">
            <h3>{opportunity.title}</h3>
            <p className="opportunity-description-modal">{opportunity.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="volunteer-form-professional">
            <div className="form-group-professional">
              <label>Hours You Can Commit</label>
              <input
                type="number"
                min="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Enter number of hours"
                required
                className="hours-input-professional"
              />
            </div>
            <div className="form-group-professional">
              <label>Why do you want to volunteer for this opportunity?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your motivation, relevant experience, and how you can contribute..."
                rows="4"
                required
                className="motivation-textarea-professional"
              />
            </div>
            <div className="modal-actions-professional">
              <button type="button" onClick={onClose} className="cancel-button-professional">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-button-professional">
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
