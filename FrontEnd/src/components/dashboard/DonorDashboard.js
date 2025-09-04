import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const DonorDashboard = () => {
  const [donorProfile, setDonorProfile] = useState(null);
  const [donationType, setDonationType] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [helpEmail, setHelpEmail] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [donorStats, setDonorStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    avgDonation: 0,
    rank: null
  });
  const contactRef = useRef(null);

  // Fetch donor profile from backend
  const fetchDonorProfile = async () => {
    try {
      const res = await axios.get('/api/donor/profile', { withCredentials: true });
      if (res.data && res.data.success) {
        setDonorProfile(res.data.data);
        // Calculate donor-specific stats from their donation history
        calculateDonorStats(res.data.data.donations || []);
      } else {
        console.error('Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching donor profile:', err);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats', { withCredentials: true });
      if (res.data && res.data.success) {
        setDashboardStats(res.data.data);
      } else {
        console.error('Failed to load dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events/', { withCredentials: true });
      if (res.data && res.data.success) {
        setEvents(res.data.data);
      } else {
        setErrorEvents('Failed to load events');
      }
    } catch (err) {
      setErrorEvents('Error fetching events');
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Calculate individual donor statistics
  const calculateDonorStats = (donations) => {
    if (!donations || donations.length === 0) {
      setDonorStats({
        totalDonated: 0,
        donationCount: 0,
        avgDonation: 0,
        rank: null
      });
      return;
    }

    const totalDonated = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    const donationCount = donations.length;
    const avgDonation = totalDonated / donationCount;

    setDonorStats({
      totalDonated,
      donationCount,
      avgDonation,
      rank: null // This would need to be calculated on the backend
    });
  };

  useEffect(() => {
    fetchDonorProfile();
    fetchEvents();
    fetchDashboardStats();

    // Add animation for event carousel
    const styleSheet = document.styleSheets[0];
    try {
      const animationExists = Array.from(styleSheet.cssRules || []).some(
        (rule) => rule.name === 'scroll'
      );
      if (!animationExists) {
        const keyframes = `
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      }
    } catch (e) {
      console.warn('Could not insert keyframes:', e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!donationType || !amount || Number(amount) <= 0) {
      alert('Please enter valid donation details.');
      return;
    }

    const donationData = {
      eventId: selectedEvent?.id || null,
      donationType,
      amount: Number(amount),
      comment,
    };

    try {
      const res = await axios.post('/api/donations', donationData, { withCredentials: true });
      if (res.data && res.data.success) {
        const donation = {
          id: res.data.data.id,
          event: selectedEvent
            ? `${selectedEvent.title} by ${selectedEvent.organization}`
            : 'General Donation',
          donationType,
          amount: Number(amount),
          comment,
          date: new Date().toLocaleString(),
        };

        setDonationHistory((prev) => [donation, ...prev]);
        
        // Update donor stats
        const newStats = {
          ...donorStats,
          totalDonated: donorStats.totalDonated + Number(amount),
          donationCount: donorStats.donationCount + 1,
          avgDonation: (donorStats.totalDonated + Number(amount)) / (donorStats.donationCount + 1)
        };
        setDonorStats(newStats);

        alert('Thank you for your donation!');
        setDonationType('');
        setAmount('');
        setComment('');
        setSelectedEvent(null);
      } else {
        alert('Failed to process donation. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting donation:', err);
      alert('An error occurred while processing your donation.');
    }
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    if (!helpEmail || !helpMessage) {
      alert('Please provide both email and message.');
      return;
    }

    try {
      const res = await axios.post('/api/support/contact', {
        email: helpEmail,
        message: helpMessage
      }, { withCredentials: true });

      if (res.data && res.data.success) {
        alert('Thank you! We will get back to you soon.');
        setHelpEmail('');
        setHelpMessage('');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error sending help request:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHistory = () => {
    document.getElementById('donation-history')?.scrollIntoView({ behavior: 'smooth' });
  };

  const styles = {
    page: {
      background: 'linear-gradient(to right, #a1ffce, #faffd1)',
      color: 'black',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
    },
    topNav: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      fontSize: '12px',
      color: '#20681fff',
      cursor: 'pointer',
      marginBottom: '1rem',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    appName: {
      fontSize: '20pt',
      fontWeight: 'bold',
      color: '#7b5c07ff',
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'linear-gradient(135deg, #ffffff, #f0f8ff)',
      padding: '1.5rem',
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
      border: '2px solid #e0f2fe',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1976d2',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    personalStatsSection: {
      background: 'linear-gradient(135deg, #e8f5e8, #f0fff0)',
      padding: '2rem',
      borderRadius: '15px',
      marginBottom: '2rem',
      border: '2px solid #4caf50',
    },
    carouselWrapper: {
      overflow: 'hidden',
      width: '100%',
      marginBottom: '3rem',
      position: 'relative',
    },
    carouselTrack: {
      display: 'flex',
      animation: 'scroll 30s linear infinite',
      gap: '1.5rem',
    },
    card: {
      borderRadius: '30px',
      borderWidth: '2px',
      borderColor: '#0c4f0d',
      borderStyle: 'solid',
      background: 'linear-gradient(to right, #a1ffce, #faffd1)',
      width: '300px',
      padding: '1rem',
      boxShadow: '0 10px 10px rgba(0,0,0,0.2)',
      color: '#0c4f0d',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
    },
    cardHover: {
      transform: 'scale(1.05)',
    },
    image: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '1rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '700px',
      margin: 'auto',
      background: 'linear-gradient(to right, #1ed074ff, #d6dbb1ff)',
      padding: '2.5rem',
      borderRadius: '10px',
    },
    input: {
      padding: '0.75rem',
      borderRadius: '8px',
      border: '2px solid #ddd',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    contactSection: {
      marginTop: '4rem',
      color: 'black',
      background: 'linear-gradient(to right, #34c379ff, #c5c7b4ff)',
      padding: '2rem',
      borderRadius: '10px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    donationHistorySection: {
      marginTop: '3rem',
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '10px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      color: '#042204',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
    donationCard: {
      padding: '1.5rem',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '12px',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      color: '#000000',
    },
    helpForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    button: {
      backgroundColor: '#15c915',
      border: 'none',
      padding: '0.75rem 1.5rem',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '1rem',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#12a312',
    },
    footerTitle: {
      textAlign: 'center',
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#202c20ff',
    },
    loadingText: {
      textAlign: 'center',
      color: '#666',
      fontStyle: 'italic',
    },
    errorText: {
      textAlign: 'center',
      color: '#d32f2f',
      backgroundColor: '#ffebee',
      padding: '1rem',
      borderRadius: '8px',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.topNav}>
        <span onClick={scrollToContact}>Contact</span>
        <span onClick={scrollToContact}>Help!</span>
        <span onClick={scrollToHistory}>Donation History</span>
      </div>

      <div style={styles.header}>
        <span style={styles.appName}>Shohay | Donor Dashboard</span>
      </div>

      {/* Donor Profile Section */}
      <div style={{ padding: '2rem' }}>
        <h2>Welcome to your Donor Dashboard</h2>
        {donorProfile ? (
          <div
            style={{
              backgroundColor: '#f0fff0',
              padding: '2rem',
              borderRadius: '15px',
              maxWidth: '600px',
              border: '2px solid #4caf50',
            }}
          >
            <h3>Your Profile</h3>
            <p>
              <strong>Name:</strong> {donorProfile.firstName} {donorProfile.lastName}
            </p>
            <p>
              <strong>Email:</strong> {donorProfile.email}
            </p>
            <p>
              <strong>Member Since:</strong> {donorProfile.registrationDate ? new Date(donorProfile.registrationDate).toLocaleDateString() : 'N/A'}
            </p>
            <p>
              <strong>Verification Status:</strong> 
              <span style={{ color: donorProfile.emailVerified ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
                {donorProfile.emailVerified ? ' ✅ Verified' : ' ⏳ Pending Verification'}
              </span>
            </p>
          </div>
        ) : (
          <p style={styles.loadingText}>Loading your profile...</p>
        )}
      </div>

      {/* Personal Statistics Section */}
      <div style={styles.personalStatsSection}>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2e7d32' }}>
          Your Impact
        </h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>৳{donorStats.totalDonated.toLocaleString()}</div>
            <div style={styles.statLabel}>Total Donated</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{donorStats.donationCount}</div>
            <div style={styles.statLabel}>Donations Made</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>৳{donorStats.avgDonation.toFixed(0)}</div>
            <div style={styles.statLabel}>Average Donation</div>
          </div>
        </div>
      </div>

      {/* Community Statistics Section */}
      {dashboardStats && (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1976d2' }}>
            Community Impact
          </h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{dashboardStats.totalDonors?.toLocaleString()}</div>
              <div style={styles.statLabel}>Total Donors</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>৳{dashboardStats.totalDonations?.toLocaleString()}</div>
              <div style={styles.statLabel}>Total Donations</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>৳{dashboardStats.averageDonation?.toFixed(0)}</div>
              <div style={styles.statLabel}>Community Average</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{dashboardStats.approvedDonors?.toLocaleString()}</div>
              <div style={styles.statLabel}>Verified Donors</div>
            </div>
          </div>
        </div>
      )}

      {/* Events Carousel */}
      <h1 style={styles.title}>🎁 Ongoing Donation Events</h1>
      <div style={styles.carouselWrapper}>
        {loadingEvents ? (
          <p style={styles.loadingText}>Loading events...</p>
        ) : errorEvents ? (
          <p style={styles.errorText}>{errorEvents}</p>
        ) : events.length === 0 ? (
          <p style={styles.loadingText}>No ongoing events at the moment.</p>
        ) : (
          <div style={styles.carouselTrack}>
            {[...events, ...events].map((event, index) => (
              <div
                key={`${event.title}-${index}`}
                style={{
                  ...styles.card,
                  ...(selectedEvent && selectedEvent.id === event.id ? { transform: 'scale(1.05)', borderColor: '#4caf50' } : {})
                }}
                onClick={() => setSelectedEvent(event)}
                onMouseEnter={(e) => {
                  if (!selectedEvent || selectedEvent.id !== event.id) {
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedEvent || selectedEvent.id !== event.id) {
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <img
                  src={event.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                  alt={event.title}
                  style={styles.image}
                />
                <h3>{event.title}</h3>
                <p>
                  <em>Organization: {event.organization}</em>
                </p>
                <p>{event.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    Goal: ৳{event.targetAmount?.toLocaleString() || 'N/A'}
                  </span>
                  <button style={styles.button}>
                    {selectedEvent && selectedEvent.id === event.id ? 'Selected ✓' : 'Select Event'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation Form */}
      <h2 style={{ textAlign: 'center' }}>Make a Donation</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Selected Event:</label>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: selectedEvent ? '#e8f5e8' : '#f5f5f5', 
            borderRadius: '8px',
            border: selectedEvent ? '2px solid #4caf50' : '2px solid #ddd'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              📌{' '}
              {selectedEvent
                ? `${selectedEvent.title} by ${selectedEvent.organization}`
                : 'No event selected - This will be a general donation'}
            </p>
            {selectedEvent && (
              <button 
                type="button" 
                onClick={() => setSelectedEvent(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#d32f2f', 
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textDecoration: 'underline',
                  marginTop: '0.5rem'
                }}
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        <div>
          <label style={styles.label}>Donation Type:</label>
          <select
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Select Donation Type --</option>
            <option value="Money">Money</option>
            <option value="Toys">Toys</option>
            <option value="Goods">Goods</option>
            <option value="Foods">Foods</option>
            <option value="Volunteering Time">Volunteering Time</option>
            <option value="Blood">Blood</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Medical Supplies">Medical Supplies</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Amount (in Taka):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            min="1"
            placeholder="Enter amount in ৳"
            required
          />
        </div>

        <div>
          <label style={styles.label}>Extra Comment (Optional):</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.input}
            rows={3}
            placeholder="Any special notes or dedication..."
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#12a312'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#15c915'}
        >
          Submit Donation
        </button>
      </form>

      {/* Donation History */}
      <div id="donation-history" style={styles.donationHistorySection}>
        <h2 style={styles.footerTitle}>Your Donation History</h2>
        {donationHistory.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <p>No donations made yet.</p>
            <p>Make your first donation above to start building your impact!</p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Showing {donationHistory.length} donation{donationHistory.length !== 1 ? 's' : ''}
            </p>
            {donationHistory.map((donation, idx) => (
              <div key={idx} style={styles.donationCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: '#2e7d32' }}>{donation.event}</h4>
                  <span style={{ 
                    backgroundColor: '#4caf50', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '12px', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    ৳{donation.amount.toLocaleString()}
                  </span>
                </div>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Type:</strong> {donation.donationType}
                </p>
                {donation.comment && (
                  <p style={{ margin: '0.5rem 0', fontStyle: 'italic', color: '#666' }}>
                    <strong>Note:</strong> "{donation.comment}"
                  </p>
                )}
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                  <strong>Date:</strong> {donation.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div ref={contactRef} style={styles.contactSection}>
        <h2 style={styles.footerTitle}>Contact & Help</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Have questions or need assistance? We're here to help! 
          Reach us at <strong>support@shohay.org</strong> or use the form below.
        </p>
        <form style={styles.helpForm} onSubmit={handleHelpSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            value={helpEmail}
            onChange={(e) => setHelpEmail(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Please describe your issue or question in detail..."
            value={helpMessage}
            onChange={(e) => setHelpMessage(e.target.value)}
            style={styles.input}
            rows={4}
            required
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#12a312'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#15c915'}
          >
            Send Help Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorDashboard;