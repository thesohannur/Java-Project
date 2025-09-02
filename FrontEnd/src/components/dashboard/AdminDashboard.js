import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import mockEvents from '../../data/event';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'records', 'analytics'

  const handleApprove = (id) => {
    setEvents(prev =>
      prev.map(event => (event.id === id ? { ...event, status: 'approved' } : event))
    );
  };

  const handleReject = (id) => {
    setEvents(prev =>
      prev.filter(event => event.id !== id)
    );
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#f5f9f7', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🛡️ Admin Dashboard</h1>
      <p>Welcome, {user?.fullName || user?.email || 'Admin'}</p>
      <button onClick={logout} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setView('dashboard')}>📋 Event Submissions</button>
        <button onClick={() => setView('records')}>📁 Approved Records</button>
        <button onClick={() => setView('analytics')}>📊 Analytics</button>
      </div>

      {/* Dashboard: Review Pending Events */}
      {view === 'dashboard' && (
        <>
          <h2>📋 Review Event Submissions</h2>
          {events.filter(e => e.status === 'pending').length === 0 ? (
            <p>No pending events.</p>
          ) : (
            events
              .filter(e => e.status === 'pending')
              .map(event => (
                <div
                  key={event.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <h3>{event.title}</h3>
                  <p><strong>NGO:</strong> {event.organization}</p>
                  <p>{event.description}</p>
                  <img src={event.image} alt={event.title} style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }} />
                  <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => handleApprove(event.id)} style={{ marginRight: '1rem', background: '#00e676', cursor: 'pointer' }}>✅ Approve</button>
                    <button onClick={() => handleReject(event.id)} style={{ background: '#ff5252', color: '#fff', cursor: 'pointer' }}>❌ Reject</button>
                  </div>
                </div>
              ))
          )}
        </>
      )}

      {/* Records View */}
      {view === 'records' && (
        <>
          <h2>📁 Approved Events</h2>
          {events.filter(e => e.status === 'approved').length === 0 ? (
            <p>No approved events yet.</p>
          ) : (
            events
              .filter(e => e.status === 'approved')
              .map(event => (
                <div
                  key={event.id}
                  style={{
                    background: '#e8f5e9',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <h3>{event.title}</h3>
                  <p><strong>NGO:</strong> {event.organization}</p>
                  <p><strong>Progress:</strong> {event.achieved} / {event.target}</p>
                </div>
              ))
          )}
        </>
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <>
          <h2>📊 Platform Analytics</h2>
          <p>Total Events: {events.length}</p>
          <p>Approved: {events.filter(e => e.status === 'approved').length}</p>
          <p>Pending: {events.filter(e => e.status === 'pending').length}</p>
          <p>
            Total Donations Collected:{' '}
            <strong>
              $
              {events
                .reduce((sum, event) => sum + (event.achieved || 0), 0)
                .toLocaleString()}
            </strong>
          </p>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
