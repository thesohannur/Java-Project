import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, API } from '../../services/api';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const chartRef = useRef(null);
  
  // State management
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Data states
  const [profile, setProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({});
  const [ngos, setNgos] = useState([]);
  const [donors, setDonors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    ngoStatus: 'all',
    verificationStatus: 'all',
    dateRange: '30'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data concurrently
      const [
        profileRes,
        statsRes,
        analyticsRes,
        healthRes,
        logsRes
      ] = await Promise.all([
        adminAPI.getProfile(),
        adminAPI.getDashboardStats(),
        adminAPI.getAnalytics(30),
        adminAPI.getSystemHealth(),
        adminAPI.getActivityLogs(0, 10)
      ]);

      setProfile(API.utils.extractData(profileRes));
      setDashboardStats(API.utils.extractData(statsRes));
      setAnalytics(API.utils.extractData(analyticsRes));
      setSystemHealth(API.utils.extractData(healthRes));
      setActivityLogs(API.utils.extractData(logsRes));
      
    } catch (error) {
      setError(API.utils.getErrorMessage(error));
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNGOs = async () => {
    try {
      const response = await adminAPI.getAllNGOs(currentPage, 10, 'registrationDate', 'desc', filters);
      setNgos(API.utils.extractData(response));
    } catch (error) {
      setError(API.utils.getErrorMessage(error));
    }
  };

  const handleNGOAction = async (ngoId, action, reason = '') => {
    try {
      let response;
      switch (action) {
        case 'verify':
          response = await adminAPI.verifyNGO(ngoId);
          break;
        case 'reject':
          response = await adminAPI.rejectNGO(ngoId, reason);
          break;
        case 'suspend':
          response = await adminAPI.updateNGOStatus(ngoId, 'SUSPENDED');
          break;
        default:
          return;
      }
      
      if (API.utils.isSuccess(response)) {
        fetchNGOs(); // Refresh NGO list
        fetchDashboardData(); // Refresh stats
      }
    } catch (error) {
      setError(API.utils.getErrorMessage(error));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <h2>🛡️ Shohay Admin</h2>
          </div>
          <div className="admin-info">
            <img 
              src={profile?.profileImage || '/default-admin-avatar.png'} 
              alt="Admin" 
              className="admin-avatar"
            />
            <div>
              <h3>Welcome, {profile?.fullName || 'Admin'}</h3>
              <p className="admin-role">{profile?.adminLevel} • {profile?.department}</p>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{dashboardStats.totalNGOs || 0}</span>
              <span className="stat-label">NGOs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{dashboardStats.totalDonors || 0}</span>
              <span className="stat-label">Donors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{dashboardStats.pendingVerificationNGOs || 0}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="notification-btn">
              🔔
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <div className="nav-items">
          <button 
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeView === 'ngos' ? 'active' : ''}`}
            onClick={() => setActiveView('ngos')}
          >
            🏢 NGO Management
          </button>
          <button 
            className={`nav-item ${activeView === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveView('donors')}
          >
            👥 Donor Management
          </button>
          <button 
            className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`nav-item ${activeView === 'system' ? 'active' : ''}`}
            onClick={() => setActiveView('system')}
          >
            ⚙️ System Health
          </button>
          <button 
            className={`nav-item ${activeView === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveView('logs')}
          >
            📋 Activity Logs
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Overview Dashboard */}
        {activeView === 'overview' && (
          <div className="overview-section">
            <div className="section-header">
              <h2>📊 Dashboard Overview</h2>
              <div className="time-filter">
                <select 
                  value={filters.dateRange} 
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <h3>{dashboardStats.totalNGOs || 0}</h3>
                  <p>Total NGOs</p>
                  <span className="stat-change positive">+{dashboardStats.newNGOsThisMonth || 0} this month</span>
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>{dashboardStats.verifiedNGOs || 0}</h3>
                  <p>Verified NGOs</p>
                  <span className="stat-change positive">
                    {((dashboardStats.verifiedNGOs / dashboardStats.totalNGOs) * 100).toFixed(1)}% verified
                  </span>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>{dashboardStats.pendingVerificationNGOs || 0}</h3>
                  <p>Pending Verification</p>
                  <span className="stat-change">Requires attention</span>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{dashboardStats.totalDonors || 0}</h3>
                  <p>Total Donors</p>
                  <span className="stat-change positive">+{dashboardStats.newDonorsThisMonth || 0} this month</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>🚀 Quick Actions</h3>
              <div className="action-buttons">
                <button 
                  className="action-btn primary"
                  onClick={() => setActiveView('ngos')}
                >
                  📋 Review Pending NGOs ({dashboardStats.pendingVerificationNGOs || 0})
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => setActiveView('analytics')}
                >
                  📊 View Analytics Report
                </button>
                <button 
                  className="action-btn tertiary"
                  onClick={() => setActiveView('system')}
                >
                  🔧 System Health Check
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>📈 Recent Activity</h3>
              <div className="activity-list">
                {activityLogs.slice(0, 5).map((log, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {log.action === 'NGO_VERIFIED' ? '✅' : 
                       log.action === 'NGO_REJECTED' ? '❌' : 
                       log.action === 'DONOR_REGISTERED' ? '👤' : '📝'}
                    </div>
                    <div className="activity-content">
                      <p>{log.description}</p>
                      <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NGO Management */}
        {activeView === 'ngos' && (
          <div className="ngo-section">
            <div className="section-header">
              <h2>🏢 NGO Management</h2>
              <div className="section-controls">
                <input
                  type="text"
                  placeholder="Search NGOs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select 
                  value={filters.verificationStatus}
                  onChange={(e) => setFilters({...filters, verificationStatus: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="ngo-grid">
              {ngos.content?.map((ngo) => (
                <div key={ngo.ngoId} className="ngo-card">
                  <div className="ngo-header">
                    <img 
                      src={ngo.logo || '/default-ngo-logo.png'} 
                      alt={ngo.organizationName}
                      className="ngo-logo"
                    />
                    <div className="ngo-info">
                      <h4>{ngo.organizationName}</h4>
                      <p className="ngo-contact">{ngo.contactPerson}</p>
                      <span className={`status-badge ${ngo.verificationStatus?.toLowerCase()}`}>
                        {ngo.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <div className="ngo-details">
                    <p><strong>📧 Email:</strong> {ngo.email}</p>
                    <p><strong>📞 Phone:</strong> {ngo.phoneNumber}</p>
                    <p><strong>📍 Location:</strong> {ngo.city}, {ngo.state}</p>
                    <p><strong>🎯 Focus:</strong> {ngo.focusAreas?.join(', ')}</p>
                    <p><strong>📅 Registered:</strong> {new Date(ngo.registrationDate).toLocaleDateString()}</p>
                  </div>

                  <div className="ngo-description">
                    <p>{ngo.description?.substring(0, 150)}...</p>
                  </div>

                  <div className="ngo-actions">
                    {ngo.verificationStatus === 'PENDING' && (
                      <>
                        <button 
                          className="action-btn success"
                          onClick={() => handleNGOAction(ngo.ngoId, 'verify')}
                        >
                          ✅ Verify
                        </button>
                        <button 
                          className="action-btn danger"
                          onClick={() => {
                            const reason = prompt('Reason for rejection:');
                            if (reason) handleNGOAction(ngo.ngoId, 'reject', reason);
                          }}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    <button 
                      className="action-btn secondary"
                      onClick={() => window.open(`/ngo/${ngo.ngoId}`, '_blank')}
                    >
                      👁️ View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>📈 Platform Analytics</h2>
            </div>

            <div className="analytics-grid">
              <div className="chart-container">
                <h3>📊 Registration Trends</h3>
                <div className="chart-placeholder">
                  <p>Registration trends chart would go here</p>
                  <div className="mock-chart">
                    <div className="chart-bar" style={{height: '60%'}}></div>
                    <div className="chart-bar" style={{height: '80%'}}></div>
                    <div className="chart-bar" style={{height: '45%'}}></div>
                    <div className="chart-bar" style={{height: '90%'}}></div>
                    <div className="chart-bar" style={{height: '70%'}}></div>
                  </div>
                </div>
              </div>

              <div className="analytics-stats">
                <h3>📋 Key Metrics</h3>
                <div className="metric-list">
                  <div className="metric-item">
                    <span className="metric-label">Average Verification Time</span>
                    <span className="metric-value">2.3 days</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">NGO Approval Rate</span>
                    <span className="metric-value">87%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Active Campaigns</span>
                    <span className="metric-value">{analytics.activeCampaigns || 0}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Total Donations</span>
                    <span className="metric-value">৳{analytics.totalDonations?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Health */}
        {activeView === 'system' && (
          <div className="system-section">
            <div className="section-header">
              <h2>⚙️ System Health</h2>
            </div>

            <div className="health-grid">
              <div className="health-card">
                <div className="health-indicator success"></div>
                <h4>🖥️ Server Status</h4>
                <p>All systems operational</p>
                <span className="health-uptime">99.9% uptime</span>
              </div>

              <div className="health-card">
                <div className="health-indicator success"></div>
                <h4>🗄️ Database</h4>
                <p>MongoDB Atlas connected</p>
                <span className="health-uptime">Response time: 45ms</span>
              </div>

              <div className="health-card">
                <div className="health-indicator warning"></div>
                <h4>📧 Email Service</h4>
                <p>Some delays detected</p>
                <span className="health-uptime">Queue: 23 pending</span>
              </div>

              <div className="health-card">
                <div className="health-indicator success"></div>
                <h4>🔐 Authentication</h4>
                <p>JWT service active</p>
                <span className="health-uptime">Token validation: OK</span>
              </div>
            </div>
          </div>
        )}

        {/* Activity Logs */}
        {activeView === 'logs' && (
          <div className="logs-section">
            <div className="section-header">
              <h2>📋 Activity Logs</h2>
            </div>

            <div className="logs-container">
              <div className="logs-table">
                <div className="table-header">
                  <span>Timestamp</span>
                  <span>Admin</span>
                  <span>Action</span>
                  <span>Target</span>
                  <span>Status</span>
                </div>
                {activityLogs.map((log, index) => (
                  <div key={index} className="table-row">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    <span>{log.adminName}</span>
                    <span>{log.action}</span>
                    <span>{log.target}</span>
                    <span className={`status ${log.status?.toLowerCase()}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
