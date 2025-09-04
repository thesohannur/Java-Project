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
  
  // New states for feedback and reports
  const [feedbacks, setFeedbacks] = useState([]);
  const [reportConfig, setReportConfig] = useState({
    type: 'ngo-summary',
    dateRange: '30',
    format: 'pdf',
    includeCharts: true
  });
  const [generatingReport, setGeneratingReport] = useState(false);
  
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
      fetchFeedbacks();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - replace with actual API calls
      const mockStats = {
        totalNGOs: 245,
        totalDonors: 1850,
        verifiedNGOs: 198,
        pendingVerificationNGOs: 23,
        newNGOsThisMonth: 12,
        newDonorsThisMonth: 156,
        totalDonations: 2500000,
        activeCampaigns: 45
      };
      
      const mockProfile = {
        fullName: 'Admin User',
        adminLevel: 'SUPER_ADMIN',
        department: 'GENERAL',
        profileImage: null
      };
      
      const mockLogs = [
        {
          action: 'NGO_VERIFIED',
          description: 'Verified Helping Hands Foundation',
          timestamp: new Date(),
          adminName: 'Admin User',
          target: 'NGO-001',
          status: 'SUCCESS'
        },
        {
          action: 'DONOR_REGISTERED',
          description: 'New donor registration approved',
          timestamp: new Date(Date.now() - 3600000),
          adminName: 'Admin User',
          target: 'DONOR-123',
          status: 'SUCCESS'
        }
      ];

      setProfile(mockProfile);
      setDashboardStats(mockStats);
      setActivityLogs(mockLogs);
      setAnalytics({ activeCampaigns: 45, totalDonations: 2500000 });
      
    } catch (error) {
      setError('Failed to fetch dashboard data: ' + error.message);
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const mockFeedbacks = [
        {
          id: 1,
          type: 'bug',
          title: 'Login Issue',
          description: 'Unable to login with correct credentials',
          user: 'john@example.com',
          userType: 'donor',
          priority: 'high',
          status: 'open',
          createdAt: new Date('2024-01-15'),
          category: 'authentication'
        },
        {
          id: 2,
          type: 'feature',
          title: 'Mobile App Request',
          description: 'Please develop a mobile application for easier access',
          user: 'ngo@helpbd.org',
          userType: 'ngo',
          priority: 'medium',
          status: 'in-progress',
          createdAt: new Date('2024-01-14'),
          category: 'enhancement'
        },
        {
          id: 3,
          type: 'complaint',
          title: 'Slow Loading',
          description: 'Dashboard takes too long to load',
          user: 'donor@gmail.com',
          userType: 'donor',
          priority: 'medium',
          status: 'resolved',
          createdAt: new Date('2024-01-13'),
          category: 'performance'
        }
      ];
      setFeedbacks(mockFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchNGOs = async () => {
    try {
      // Mock NGO data
      const mockNGOs = {
        content: [
          {
            ngoId: 'NGO-001',
            organizationName: 'Helping Hands Foundation',
            contactPerson: 'John Doe',
            email: 'contact@helpinghands.org',
            phoneNumber: '+8801712345678',
            city: 'Dhaka',
            state: 'Dhaka',
            focusAreas: ['Education', 'Healthcare'],
            verificationStatus: 'PENDING',
            registrationDate: new Date('2024-01-10'),
            description: 'A non-profit organization dedicated to helping underprivileged communities...',
            logo: null
          },
          {
            ngoId: 'NGO-002',
            organizationName: 'Green Earth Initiative',
            contactPerson: 'Jane Smith',
            email: 'info@greenearth.org',
            phoneNumber: '+8801798765432',
            city: 'Chittagong',
            state: 'Chittagong',
            focusAreas: ['Environment', 'Climate Change'],
            verificationStatus: 'VERIFIED',
            registrationDate: new Date('2024-01-05'),
            description: 'Environmental conservation and climate change awareness organization...',
            logo: null
          }
        ]
      };
      setNgos(mockNGOs);
    } catch (error) {
      setError('Failed to fetch NGOs: ' + error.message);
    }
  };

  const handleNGOAction = async (ngoId, action, reason = '') => {
    try {
      // Mock action handling
      console.log(`Performing ${action} on NGO ${ngoId}`, reason);
      
      // Update local state
      setNgos(prev => ({
        ...prev,
        content: prev.content.map(ngo => 
          ngo.ngoId === ngoId 
            ? { ...ngo, verificationStatus: action === 'verify' ? 'VERIFIED' : 'REJECTED' }
            : ngo
        )
      }));
      
      // Refresh dashboard stats
      fetchDashboardData();
    } catch (error) {
      setError('Failed to perform action: ' + error.message);
    }
  };

  const handleFeedbackStatusUpdate = async (feedbackId, newStatus) => {
    try {
      setFeedbacks(prev => 
        prev.map(feedback => 
          feedback.id === feedbackId 
            ? { ...feedback, status: newStatus }
            : feedback
        )
      );
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const reportData = {
        title: `${reportConfig.type} Report`,
        dateRange: reportConfig.dateRange,
        generatedAt: new Date().toISOString(),
        data: dashboardStats
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shohay-${reportConfig.type}-report.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      setError('Failed to generate report: ' + error.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Load NGOs when switching to NGO view
  useEffect(() => {
    if (activeView === 'ngos') {
      fetchNGOs();
    }
  }, [activeView]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  // Render Feedback Section
  const renderFeedbackSection = () => (
    <div className="feedback-section">
      <div className="section-header">
        <h2>💬 User Feedback & Support</h2>
        <div className="feedback-filters">
          <select>
            <option value="all">All Types</option>
            <option value="bug">Bug Reports</option>
            <option value="feature">Feature Requests</option>
            <option value="complaint">Complaints</option>
          </select>
          <select>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="feedback-stats">
        <div className="stat-card">
          <div className="stat-number">{feedbacks.filter(f => f.status === 'open').length}</div>
          <div className="stat-label">Open Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{feedbacks.filter(f => f.status === 'in-progress').length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{feedbacks.filter(f => f.status === 'resolved').length}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{feedbacks.filter(f => f.priority === 'high').length}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>

      <div className="feedback-list">
        {feedbacks.map(feedback => (
          <div key={feedback.id} className={`feedback-item ${feedback.priority}`}>
            <div className="feedback-header">
              <div className="feedback-info">
                <h4>{feedback.title}</h4>
                <div className="feedback-meta">
                  <span className={`feedback-type ${feedback.type}`}>
                    {feedback.type === 'bug' ? '🐛' : feedback.type === 'feature' ? '✨' : '⚠️'}
                    {feedback.type}
                  </span>
                  <span className="feedback-user">👤 {feedback.user}</span>
                  <span className="feedback-date">📅 {feedback.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="feedback-actions">
                <select 
                  value={feedback.status}
                  onChange={(e) => handleFeedbackStatusUpdate(feedback.id, e.target.value)}
                  className={`status-select ${feedback.status}`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <span className={`priority-badge ${feedback.priority}`}>
                  {feedback.priority}
                </span>
              </div>
            </div>
            <div className="feedback-description">
              <p>{feedback.description}</p>
            </div>
            <div className="feedback-footer">
              <button className="btn-reply">💬 Reply</button>
              <button className="btn-assign">👤 Assign</button>
              <button className="btn-escalate">⬆️ Escalate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Report Generator Section
  const renderReportSection = () => (
    <div className="reports-section">
      <div className="section-header">
        <h2>📊 Report Generator</h2>
        <p>Generate comprehensive reports for analysis and compliance</p>
      </div>

      <div className="report-generator">
        <div className="report-config">
          <h3>Report Configuration</h3>
          
          <div className="config-group">
            <label>Report Type</label>
            <select 
              value={reportConfig.type}
              onChange={(e) => setReportConfig({...reportConfig, type: e.target.value})}
            >
              <option value="ngo-summary">NGO Summary Report</option>
              <option value="donor-analytics">Donor Analytics Report</option>
              <option value="financial-overview">Financial Overview</option>
              <option value="user-activity">User Activity Report</option>
              <option value="system-performance">System Performance</option>
              <option value="compliance-audit">Compliance Audit</option>
            </select>
          </div>

          <div className="config-group">
            <label>Date Range</label>
            <select 
              value={reportConfig.dateRange}
              onChange={(e) => setReportConfig({...reportConfig, dateRange: e.target.value})}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div className="config-group">
            <label>Output Format</label>
            <select 
              value={reportConfig.format}
              onChange={(e) => setReportConfig({...reportConfig, format: e.target.value})}
            >
              <option value="pdf">PDF Document</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV File</option>
              <option value="json">JSON Data</option>
            </select>
          </div>

          <div className="config-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
              />
              Include Charts and Visualizations
            </label>
          </div>

          <button 
            className="generate-report-btn"
            onClick={generateReport}
            disabled={generatingReport}
          >
            {generatingReport ? (
              <>
                <span className="spinner"></span>
                Generating Report...
              </>
            ) : (
              <>
                📊 Generate Report
              </>
            )}
          </button>
        </div>

        <div className="report-templates">
          <h3>Quick Report Templates</h3>
          <div className="template-grid">
            <div className="template-card" onClick={() => setReportConfig({...reportConfig, type: 'ngo-summary'})}>
              <div className="template-icon">🏢</div>
              <h4>NGO Performance</h4>
              <p>Comprehensive NGO activity and performance metrics</p>
            </div>
            <div className="template-card" onClick={() => setReportConfig({...reportConfig, type: 'financial-overview'})}>
              <div className="template-icon">💰</div>
              <h4>Financial Summary</h4>
              <p>Donation flows, fund allocation, and financial health</p>
            </div>
            <div className="template-card" onClick={() => setReportConfig({...reportConfig, type: 'user-activity'})}>
              <div className="template-icon">👥</div>
              <h4>User Engagement</h4>
              <p>User activity, registration trends, and engagement metrics</p>
            </div>
            <div className="template-card" onClick={() => setReportConfig({...reportConfig, type: 'compliance-audit'})}>
              <div className="template-icon">✅</div>
              <h4>Compliance Audit</h4>
              <p>Regulatory compliance and audit trail report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            className={`nav-item ${activeView === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveView('feedback')}
          >
            💬 Feedback & Support
          </button>
          <button 
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
          >
            📊 Reports
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
                    {dashboardStats.totalNGOs > 0 ? ((dashboardStats.verifiedNGOs / dashboardStats.totalNGOs) * 100).toFixed(1) : 0}% verified
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
                  onClick={() => setActiveView('reports')}
                >
                  📊 Generate Reports
                </button>
                <button 
                  className="action-btn tertiary"
                  onClick={() => setActiveView('feedback')}
                >
                  💬 Review Feedback
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

        {/* Feedback Section */}
        {activeView === 'feedback' && renderFeedbackSection()}

        {/* Reports Section */}
        {activeView === 'reports' && renderReportSection()}

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
