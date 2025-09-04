// src/components/dashboard/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null); // show loading per row if desired

  const fetchUnapprovedCampaigns = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUnapprovedCampaigns();
      if (res.status === 204) {
        setCampaigns([]);
        setError('');
        return;
      }
      setCampaigns(res.data || []);
      setError('');
    } catch (err) {
      const s = err.response?.status;
      if (s === 404) setError('Endpoint not found (check /api prefix).');
      else if (s === 401) setError('Unauthorized — please sign in again.');
      else if (s === 403) setError('Forbidden — admin role required.');
      else if (s === 405) setError('Wrong HTTP method for this endpoint.');
      else setError(err.response?.data?.message || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUnapprovedCampaigns(); }, []);

  // Immediate approve without any confirm popup
  const handleApprove = async (campaignId) => {
    try {
      setBusyId(campaignId);
      await adminService.approveCampaign(campaignId);
      await fetchUnapprovedCampaigns();
    } catch (e) {
      alert(e.response?.data?.message || 'Approval failed');
    } finally {
      setBusyId(null);
    }
  };

  // Optional: keep reject with inline prompt removed as well; show your own modal if needed
  const handleReject = async (campaignId) => {
    const feedback = ''; // no popup; send empty or implement your own modal later
    try {
      setBusyId(campaignId);
      await adminService.rejectCampaign(campaignId, feedback);
      await fetchUnapprovedCampaigns();
    } catch (e) {
      alert(e.response?.data?.message || 'Rejection failed');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      {/* Keep Logout only in header */}
      <div className="dashboard-header">
        <div>
          <h1>Shohay Admin</h1>
          <p className="dashboard-subtitle">Oversee platform operations</p>
        </div>
        <div className="admin-info">
          <span>Signed in: {user?.email}</span>
        </div>
      </div>

      <div className="admin-content">
        <div className="section">
          <h2>Pending Campaign Approvals</h2>
          {error && <div className="error">{error}</div>}

          {campaigns.length === 0 ? (
            <div className="no-data">
              <p>No campaigns are pending approval.</p>
              <button onClick={fetchUnapprovedCampaigns} className="refresh-btn">Refresh</button>
            </div>
          ) : (
            <div className="campaigns-table-container">
              <table className="campaigns-table">
                <thead>
                  <tr>
                    <th>Campaign ID</th>
                    <th>NGO Email</th>
                    <th>Description</th>
                    <th>Volunteer Time</th>
                    <th>Expiration</th>
                    <th>Created</th>
                    <th>Reject Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.campaignId}>
                      <td>{c.campaignId}</td>
                      <td>{c.ngoEmail}</td>
                      <td className="description-cell">
                        <div title={c.description}>
                          {c.description?.length > 100 ? `${c.description.substring(0, 100)}…` : c.description}
                        </div>
                      </td>
                      <td>{c.volunteerTime || 'Not specified'}</td>
                      <td>{c.expirationTime ? new Date(c.expirationTime).toLocaleDateString() : 'No expiration'}</td>
                      <td>{new Date(c.creationTime).toLocaleDateString()}</td>
                      <td><span className={`reject-count ${c.rejectFlag > 0 ? 'has-rejects' : ''}`}>{c.rejectFlag || 0}</span></td>
                      <td className="actions-cell">
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(c.campaignId)}
                          disabled={busyId === c.campaignId}
                        >
                          {busyId === c.campaignId ? 'Approving…' : 'Approve'}
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleReject(c.campaignId)}
                          disabled={busyId === c.campaignId}
                        >
                          {busyId === c.campaignId ? 'Rejecting…' : 'Reject'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="table-actions">
                <button onClick={fetchUnapprovedCampaigns} className="refresh-btn">Refresh List</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
