import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as donorService from '../../services/donorService';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Contribution modal state
  const [contributeModalOpen, setContributeModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [hours, setHours] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, opportunitiesRes, applicationsRes] = await Promise.allSettled([
        donorService.getAllApprovedCampaigns(),
        donorService.getAllVolunteerOpportunities(),
        donorService.getMyVolunteerApplications()
      ]);

      if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value.data || []);
      if (opportunitiesRes.status === 'fulfilled') setOpportunities(opportunitiesRes.value.data || []);
      if (applicationsRes.status === 'fulfilled') setMyApplications(applicationsRes.value.data?.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openContributeModal = (campaign) => {
    setSelectedCampaign(campaign);
    setAmount('');
    setHours('');
    setMessage('');
    setContributeModalOpen(true);
  };

  const closeContributeModal = () => {
    setContributeModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleContribute = async () => {
    if (!selectedCampaign) return;

    const acceptsMoney = selectedCampaign.acceptsMoney;
    const acceptsTime = selectedCampaign.acceptsTime;

    // Validation
    if (acceptsMoney && (!amount || Number(amount) <= 0)) {
      alert('Please enter a valid donation amount');
      return;
    }

    if (acceptsTime && (!hours || Number(hours) <= 0)) {
      alert('Please enter valid volunteer hours');
      return;
    }

    if (acceptsTime && !message.trim()) {
      alert('Please provide a message for your volunteer application');
      return;
    }

    setSubmitting(true);
    try {
      if (acceptsMoney && acceptsTime) {
        // Both - handle separately or create combined endpoint
        if (amount && Number(amount) > 0) {
          await donorService.donate({
            amount: Number(amount),
            ngoID: selectedCampaign.ngoId,
            donorId: user.userId
          });
        }
        if (hours && Number(hours) > 0) {
          await donorService.applyForVolunteer({
            opportunityId: selectedCampaign.campaignId, // or related opportunity
            message: message.trim(),
            hoursCommitted: Number(hours)
          });
        }
        alert('Contribution submitted successfully!');
      } else if (acceptsMoney) {
        await donorService.donate({
          amount: Number(amount),
          ngoID: selectedCampaign.ngoId,
          donorId: user.userId
        });
        alert('Donation successful!');
      } else if (acceptsTime) {
        await donorService.applyForVolunteer({
          opportunityId: selectedCampaign.campaignId,
          message: message.trim(),
          hoursCommitted: Number(hours)
        });
        alert('Volunteer application submitted!');
      }

      closeContributeModal();
      fetchData();
    } catch (error) {
      alert('Contribution failed: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const oppTitleById = useMemo(() => {
    const map = {};
    (opportunities || []).forEach((o) => (map[o.opportunityId] = o.title));
    return map;
  }, [opportunities]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome to Shohay</h1>
          <p className="dashboard-subtitle">Make an impact through donations and volunteering</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'campaigns' ? 'active' : ''} onClick={() => setActiveTab('campaigns')}>
          Money Donation
        </button>
        <button className={activeTab === 'opportunities' ? 'active' : ''} onClick={() => setActiveTab('opportunities')}>
          Time Donation
        </button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          My Applications
        </button>
      </div>

      <div className="tab-content">
        {error && <div className="error">{error}</div>}

        {activeTab === 'campaigns' && (
          <div className="campaigns-section">
            <h2>Available Campaigns</h2>
            {campaigns.length === 0 ? (
              <p>No active campaigns available.</p>
            ) : (
              <div className="campaigns-grid">
                {campaigns.map((campaign) => (
                  <div key={campaign.campaignId} className="campaign-card">
                    <div className="campaign-header">
                      <h3>{campaign.description}</h3>
                      <div className="campaign-types">
                        {campaign.acceptsMoney && <span className="chip money">💰 Money</span>}
                        {campaign.acceptsTime && <span className="chip time">⏰ Time</span>}
                      </div>
                    </div>

                    <div className="campaign-meta">
                      <p><strong>NGO:</strong> {campaign.ngoEmail}</p>
                      {campaign.acceptsTime && campaign.volunteerTime && (
                        <p><strong>Volunteer Hours Needed:</strong> {campaign.volunteerTime}</p>
                      )}
                      {campaign.expirationTime && (
                        <p><strong>Expires:</strong> {new Date(campaign.expirationTime).toLocaleDateString()}</p>
                      )}
                    </div>

                    <button onClick={() => openContributeModal(campaign)} className="donate-btn">
                      Contribute Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="opportunities-section">
            <h2>Volunteer Opportunities</h2>
            {opportunities.length === 0 ? (
              <p>No volunteer opportunities available.</p>
            ) : (
              <div className="opportunities-grid">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.opportunityId} className="opportunity-card">
                    <h3>{opportunity.title}</h3>
                    <p>{opportunity.description}</p>
                    <p><strong>Location:</strong> {opportunity.location}</p>
                    <p><strong>Volunteers:</strong> {opportunity.currentVolunteers}/{opportunity.maxVolunteers}</p>
                    <button
                      onClick={() => {/* existing volunteer apply logic */}}
                      disabled={opportunity.currentVolunteers >= opportunity.maxVolunteers}
                      className="apply-btn"
                    >
                      Apply to Volunteer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h2>My Volunteer Applications</h2>
            {myApplications.length === 0 ? (
              <p>No applications yet.</p>
            ) : (
              <div className="campaigns-grid">
                {myApplications.map((application) => {
                  const title = application.opportunityTitle || oppTitleById[application.opportunityId] || `Opportunity ${String(application.opportunityId || '').slice(0, 6)}…`;
                  const statusClass = (application.status || '').toLowerCase();
                  return (
                    <div key={application.volunteerId} className="application-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0 }}>{title}</h4>
                        <span className={`status ${statusClass}`}>{application.status}</span>
                      </div>
                      <p><strong>Opportunity ID:</strong> {application.opportunityId}</p>
                      <p><strong>Hours Committed:</strong> {application.hoursCommitted}</p>
                      {application.hoursCompleted > 0 && <p><strong>Hours Completed:</strong> {application.hoursCompleted}</p>}
                      <p><strong>Applied:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contribution Modal */}
      {contributeModalOpen && selectedCampaign && (
        <div className="modal-overlay" role="presentation" onClick={closeContributeModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contributeTitle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="contributeTitle">Contribute to Campaign</h3>
              <button className="close-btn" onClick={closeContributeModal} aria-label="Close">×</button>
            </div>

            <div className="modal-body">
              <div className="campaign-info">
                <h4>{selectedCampaign.description}</h4>
                <div className="campaign-types">
                  {selectedCampaign.acceptsMoney && <span className="chip money">💰 Money</span>}
                  {selectedCampaign.acceptsTime && <span className="chip time">⏰ Time</span>}
                </div>
              </div>

              {selectedCampaign.acceptsMoney && (
                <div className="form-group">
                  <label htmlFor="donationAmount">Donation Amount ($)</label>
                  <input
                    id="donationAmount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount..."
                    required={selectedCampaign.acceptsMoney}
                  />
                </div>
              )}

              {selectedCampaign.acceptsTime && (
                <>
                  <div className="form-group">
                    <label htmlFor="volunteerHours">Volunteer Hours You Can Commit</label>
                    <input
                      id="volunteerHours"
                      type="number"
                      min="1"
                      max={selectedCampaign.volunteerTime || 999}
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="Enter hours..."
                      required={selectedCampaign.acceptsTime}
                    />
                    {selectedCampaign.volunteerTime && (
                      <small>Campaign needs {selectedCampaign.volunteerTime} total hours</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="volunteerMessage">Why do you want to volunteer?</label>
                    <textarea
                      id="volunteerMessage"
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your motivation and relevant skills..."
                      required={selectedCampaign.acceptsTime}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeContributeModal}>Cancel</button>
              <button
                className="submit-btn"
                onClick={handleContribute}
                disabled={submitting}
              >
                {submitting ? 'Contributing...' : 'Contribute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
