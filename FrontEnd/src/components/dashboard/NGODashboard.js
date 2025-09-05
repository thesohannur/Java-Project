// src/components/dashboard/NGODashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as ngoService from '../../services/ngoService';
import CampaignForm from '../forms/CampaignForm';

const NGODashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Opportunity form state
  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    maxVolunteers: '',
    skillsRequired: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, opportunitiesRes, applicationsRes, donationsRes] = await Promise.allSettled([
        ngoService.getMyCampaigns(),
        ngoService.getMyVolunteerOpportunities(),
        ngoService.getVolunteerApplications(),
        ngoService.getMyDonations()
      ]);

      if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value.data || []);
      if (opportunitiesRes.status === 'fulfilled') setOpportunities(opportunitiesRes.value.data?.data || []);
      if (applicationsRes.status === 'fulfilled') setVolunteerApplications(applicationsRes.value.data?.data || []);
      if (donationsRes.status === 'fulfilled') setDonations(donationsRes.value.data?.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      await ngoService.createCampaign(campaignData);
      alert('Campaign created successfully! It is now pending admin approval.');
      fetchAllData();
    } catch (err) {
      alert('Failed to create campaign: ' + (err.response?.data || 'Unknown error'));
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (!opportunityForm.title || !opportunityForm.description) {
      alert('Title and description are required');
      return;
    }

    try {
      const opportunityData = {
        ...opportunityForm,
        maxVolunteers: parseInt(opportunityForm.maxVolunteers) || 1,
        skillsRequired: opportunityForm.skillsRequired ? opportunityForm.skillsRequired.split(',').map((s) => s.trim()) : []
      };

      await ngoService.createVolunteerOpportunity(opportunityData);
      alert('Volunteer opportunity created successfully!');
      setOpportunityForm({
        title: '',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        maxVolunteers: '',
        skillsRequired: ''
      });
      fetchAllData();
    } catch (err) {
      alert('Failed to create opportunity: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleApproveVolunteer = async (volunteerId) => {
    if (window.confirm('Approve this volunteer application?')) {
      try {
        await ngoService.approveVolunteer(volunteerId);
        alert('Volunteer approved successfully!');
        fetchAllData();
      } catch (err) {
        alert('Failed to approve volunteer: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleCompleteVolunteer = async (volunteerId) => {
    const hoursDone = prompt('Enter the number of hours completed:');
    if (hoursDone && parseInt(hoursDone) > 0) {
      try {
        await ngoService.completeVolunteer(volunteerId, parseInt(hoursDone));
        alert('Volunteer work marked as completed!');
        fetchAllData();
      } catch (err) {
        alert('Failed to complete volunteer: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Delete this campaign?')) {
      try {
        await ngoService.deleteCampaign(campaignId);
        alert('Campaign deleted successfully!');
        fetchAllData();
      } catch (err) {
        alert('Failed to delete campaign: ' + (err.response?.data || 'Cannot delete campaign with expiry date set'));
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Shohay for NGOs</h1>
          <p className="dashboard-subtitle">Manage your campaigns and volunteers</p>
        </div>
        <div className="user-info">
          <span>Signed in: {user?.email}</span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'campaigns' ? 'active' : ''} onClick={() => setActiveTab('campaigns')}>
          Campaigns
        </button>
        <button className={activeTab === 'opportunities' ? 'active' : ''} onClick={() => setActiveTab('opportunities')}>
          Volunteer Opportunities
        </button>
        <button className={activeTab === 'volunteers' ? 'active' : ''} onClick={() => setActiveTab('volunteers')}>
          Volunteer Applications
        </button>
        <button className={activeTab === 'donations' ? 'active' : ''} onClick={() => setActiveTab('donations')}>
          Donations Received
        </button>
      </div>

      <div className="tab-content">
        {error && <div className="error">{error}</div>}

        {activeTab === 'campaigns' && (
          <div className="campaigns-section">
            <h2>My Campaigns</h2>

            <CampaignForm onSubmit={handleCreateCampaign} />

            <div className="campaigns-list">
              {campaigns.length === 0 ? (
                <p>No campaigns created yet.</p>
              ) : (
                campaigns.map((campaign) => (
                  <div key={campaign.campaignId} className="campaign-card">
                    <div className="campaign-header">
                      <h3>{campaign.description}</h3>
                      <div className="campaign-types">
                        {campaign.acceptsMoney && <span className="chip money">💰 Money</span>}
                        {campaign.acceptsTime && <span className="chip time">⏰ Time</span>}
                      </div>
                    </div>
                    <div className="campaign-meta">
                      <p><strong>Status:</strong> {campaign.approved ? 'Approved' : 'Pending Approval'}</p>
                      {campaign.volunteerTime && (
                        <p><strong>Volunteer Time:</strong> {campaign.volunteerTime} hours</p>
                      )}
                      {campaign.expirationTime && (
                        <p><strong>Expires:</strong> {new Date(campaign.expirationTime).toLocaleDateString()}</p>
                      )}
                      {campaign.rejectFlag > 0 && (
                        <p className="warning"><strong>Rejected {campaign.rejectFlag} time(s)</strong></p>
                      )}
                      {campaign.feedback && (
                        <p className="warning"><strong>Feedback:</strong> {campaign.feedback}</p>
                      )}
                    </div>
                    {campaign.manualDeletionAllowed && (
                      <button onClick={() => handleDeleteCampaign(campaign.campaignId)} className="delete-btn">
                        Delete Campaign
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="opportunities-section">
            <h2>Volunteer Opportunities</h2>

            <div className="create-opportunity">
              <h3>Create New Opportunity</h3>
              <form onSubmit={handleCreateOpportunity}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      type="text"
                      value={opportunityForm.title}
                      onChange={(e) => setOpportunityForm({ ...opportunityForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={opportunityForm.location}
                      onChange={(e) => setOpportunityForm({ ...opportunityForm, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={opportunityForm.description}
                    onChange={(e) => setOpportunityForm({ ...opportunityForm, description: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input
                      type="date"
                      value={opportunityForm.startDate}
                      onChange={(e) => setOpportunityForm({ ...opportunityForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date:</label>
                    <input
                      type="date"
                      value={opportunityForm.endDate}
                      onChange={(e) => setOpportunityForm({ ...opportunityForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Max Volunteers:</label>
                    <input
                      type="number"
                      min="1"
                      value={opportunityForm.maxVolunteers}
                      onChange={(e) => setOpportunityForm({ ...opportunityForm, maxVolunteers: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills Required (comma separated):</label>
                    <input
                      type="text"
                      value={opportunityForm.skillsRequired}
                      onChange={(e) => setOpportunityForm({ ...opportunityForm, skillsRequired: e.target.value })}
                      placeholder="e.g., Teaching, Communication"
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn">Create Opportunity</button>
              </form>
            </div>

            <div className="opportunities-list">
              {opportunities.length === 0 ? (
                <p>No opportunities created yet.</p>
              ) : (
                opportunities.map((opp) => (
                  <div key={opp.opportunityId} className="opportunity-card">
                    <h4>{opp.title}</h4>
                    <p>{opp.description}</p>
                    <p><strong>Location:</strong> {opp.location}</p>
                    <p><strong>Volunteers:</strong> {opp.currentVolunteers}/{opp.maxVolunteers}</p>
                    <p><strong>Status:</strong> {opp.active ? 'Active' : 'Closed'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="volunteers-section">
            <h2>Volunteer Applications</h2>
            {volunteerApplications.length === 0 ? (
              <p>No volunteer applications received yet.</p>
            ) : (
              <div className="applications-grid">
                {volunteerApplications.map((application) => (
                  <div key={application.volunteerId} className="application-card">
                    <p>{application.donorMessage}</p>
                    <p><strong>Hours Committed:</strong> {application.hoursCommitted}</p>
                    <p><strong>Applied:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
                    {application.status === 'PENDING' && (
                      <div className="actions">
                        <button onClick={() => handleApproveVolunteer(application.volunteerId)} className="approve-btn">
                          Approve
                        </button>
                      </div>
                    )}
                    {application.status === 'APPROVED' && (
                      <div className="actions">
                        <button onClick={() => handleCompleteVolunteer(application.volunteerId)} className="complete-btn">
                          Mark Complete
                        </button>
                      </div>
                    )}
                    {application.status === 'COMPLETED' && (
                      <div>
                        <p><strong>Hours Completed:</strong> {application.hoursCompleted}</p>
                        <p><strong>Completed:</strong> {new Date(application.completedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="donations-section">
            <div className="section-header">
              <h2>💰 Donations Received</h2>
              <p className="section-subtitle">Track your received donations and manage donor relationships</p>
            </div>

            {donations.length === 0 ? (
              <div className="no-data">
                <div className="no-data-icon">💝</div>
                <h3>No Donations Yet</h3>
                <p>Your received donations will appear here once donors start contributing to your campaigns.</p>
              </div>
            ) : (
              <>
                <div className="donations-summary">
                  <div className="summary-card">
                    <div className="summary-icon">💵</div>
                    <div className="summary-content">
                      <h3>${donations.reduce((total, d) => total + (Number(d.amount) || 0), 0).toLocaleString()}</h3>
                      <p>Total Raised</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon">👥</div>
                    <div className="summary-content">
                      <h3>{donations.length}</h3>
                      <p>Total Donations</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                      <h3>${Math.round(donations.reduce((total, d) => total + (Number(d.amount) || 0), 0) / donations.length).toLocaleString()}</h3>
                      <p>Average Gift</p>
                    </div>
                  </div>
                </div>

                <div className="donations-grid">
                  {donations.map((donation, index) => (
                    <div key={donation.paymentId || donation.donationId || index} className="donation-card">
                      <div className="donation-header">
                        <div className="donation-amount">
                          <span className="currency">$</span>
                          <span className="amount">{Number(donation.amount || 0).toLocaleString()}</span>
                        </div>
                        <div className={`donation-status status-${(donation.status || 'unknown').toLowerCase()}`}>
                          <span className="status-icon">
                            {donation.status === 'SUCCESS' ? '✅' :
                             donation.status === 'PENDING' ? '⏳' :
                             donation.status === 'FAILED' ? '❌' : '❓'}
                          </span>
                          <span className="status-text">{donation.status || 'Unknown'}</span>
                        </div>
                      </div>

                      <div className="donation-details">
                        <div className="detail-row">
                          <div className="detail-label">
                            <span className="detail-icon">👤</span>
                            From
                          </div>
                          <div className="detail-value">
                            {donation.donorEmail ? (
                              <div className="donor-info">
                                <strong>{donation.donorEmail}</strong>
                                {donation.donorName && <span className="donor-name">({donation.donorName})</span>}
                              </div>
                            ) : (
                              <span className="donor-id">Donor ID: {String(donation.donorId || 'Anonymous').slice(0, 8)}...</span>
                            )}
                          </div>
                        </div>

                        <div className="detail-row">
                          <div className="detail-label">
                            <span className="detail-icon">📅</span>
                            Date
                          </div>
                          <div className="detail-value">
                            {donation.timestamp ? new Date(donation.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Not available'}
                          </div>
                        </div>

                        {donation.campaignId && (
                          <div className="detail-row">
                            <div className="detail-label">
                              <span className="detail-icon">🎯</span>
                              Campaign
                            </div>
                            <div className="detail-value">
                              <span className="campaign-id">Campaign #{String(donation.campaignId).slice(0, 8)}...</span>
                            </div>
                          </div>
                        )}

                        {donation.paymentMethod && (
                          <div className="detail-row">
                            <div className="detail-label">
                              <span className="detail-icon">💳</span>
                              Method
                            </div>
                            <div className="detail-value">
                              {donation.paymentMethod}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="donation-actions">
                        <button
                          className="btn-secondary btn-small"
                          onClick={() => navigator.clipboard.writeText(donation.paymentId || donation.donationId)}
                          title="Copy Transaction ID"
                        >
                          📋 Copy ID
                        </button>
                        {donation.receiptUrl && (
                          <button
                            className="btn-secondary btn-small"
                            onClick={() => window.open(donation.receiptUrl, '_blank')}
                          >
                            📄 Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
