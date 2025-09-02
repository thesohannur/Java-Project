import React, { useState, useEffect, useRef } from 'react';
import eventsData from './data/event'; // Fixed import name and path (assuming src/data/event.js)

const DonorDashboard = () => {
  const [donationType, setDonationType] = useState('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [helpEmail, setHelpEmail] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [donationHistory, setDonationHistory] = useState([]);
  const contactRef = useRef(null);

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!donationType || !amount) {
      alert('Please select a donation type and enter an amount.');
      return;
    }
    if (Number(amount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    const donation = {
      event: selectedEvent
        ? `${selectedEvent.title} by ${selectedEvent.organization}`
        : 'General Donation',
      donationType,
      amount: Number(amount),
      comment,
      date: new Date().toLocaleString(),
    };
    setDonationHistory((prev) => [donation, ...prev]);
    alert('Thank you for your donation!');

    setDonationType('');
    setAmount('');
    setComment('');
    setSelectedEvent(null);
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (!helpEmail || !helpMessage) {
      alert('Please provide both email and message.');
      return;
    }
    console.log({ email: helpEmail, problem: helpMessage });
    alert('Thank you! We will get back to you soon.');
    setHelpEmail('');
    setHelpMessage('');
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
    },
    image: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '1rem',
    },
    eventTitle: {
      margin: '0.5rem 0 0.2rem 0',
    },
    org: {
      fontStyle: 'italic',
      marginBottom: '0.5rem',
    },
    button: {
      backgroundColor: '#15c915',
      border: 'none',
      padding: '0.5rem 1rem',
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '1rem',
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
      padding: '0.5rem',
      borderRadius: '5px',
      border: 'none',
      fontSize: '1rem',
    },
    label: {
      fontWeight: 'bold',
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
    contactText: {
      marginBottom: '1rem',
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
      padding: '1rem',
      backgroundColor: '#ffffff',
      border: '1px solid #dcdcdc',
      borderRadius: '10px',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      color: '#000000',
    },
    helpForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    footerTitle: {
      textAlign: 'center',
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#202c20ff',
    },
  };

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <div style={styles.topNav}>
        <span onClick={scrollToContact}>Contact</span>
        <span onClick={scrollToContact}>Help!</span>
        <span onClick={scrollToHistory}>Donation History</span>
      </div>

      <div style={{ padding: '2rem' }}>
        <h2>Donor Dashboard</h2>
        <p>Welcome to your donor dashboard!</p>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.appName}>Shohay | Donor Dashboard</span>
      </div>

      {/* Events Carousel */}
      <h1 style={styles.title}>🎁 Ongoing Donation Events</h1>
      <div style={styles.carouselWrapper}>
        <div style={styles.carouselTrack}>
          {[...eventsData, ...eventsData].map((event, index) => (
            <div
              key={`${event.title}-${index}`} // Unique key
              style={styles.card}
              onClick={() => setSelectedEvent(event)}
            >
              <img
                src={event.image || 'https://via.placeholder.com/300x180'} // Fallback image
                alt={event.title}
                style={styles.image}
              />
              <h2 style={styles.eventTitle}>{event.title}</h2>
              <p style={styles.org}>NGO: {event.organization}</p>
              <p>{event.description}</p>
              <button style={styles.button} onClick={() => setSelectedEvent(event)}>
                Donate Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Form */}
      <h2 style={{ textAlign: 'center' }}>Make a Donation</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Ongoing Event:</label>
          <p>📌 {selectedEvent ? `${selectedEvent.title} by ${selectedEvent.organization}` : 'None Selected'}</p>
        </div>

        <div>
          <label style={styles.label} htmlFor="donationType">Donation Type:</label>
          <select
            id="donationType"
            value={donationType}
            onChange={(e) => setDonationType(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Select Donation Type --</option>
            <option value="Toys">Toys</option>
            <option value="Goods">Goods</option>
            <option value="Foods">Foods</option>
            <option value="Volunteering Time">Volunteering Time</option>
            <option value="Blood">Blood</option>
          </select>
        </div>

        <div>
          <label style={styles.label} htmlFor="amount">Donation Amount (in Taka):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="Enter amount"
            min="1"
            required
          />
        </div>

        <div>
          <label style={styles.label} htmlFor="comment">Extra Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.input}
            rows={3}
          />
        </div>

        <button type="submit" style={styles.button}>Submit Donation</button>
      </form>

      {/* Donation History */}
      <div id="donation-history" style={styles.donationHistorySection}>
        <h2 style={styles.footerTitle}>Donation History</h2>
        {donationHistory.length === 0 ? (
          <p>No donations made yet.</p>
        ) : (
          donationHistory.map((donation, idx) => (
            <div key={`donation-${idx}`} style={styles.donationCard}>
              <p><strong>Event:</strong> {donation.event}</p>
              <p><strong>Type:</strong> {donation.donationType}</p>
              <p><strong>Amount:</strong> {donation.amount} Taka</p>
              <p><strong>Comment:</strong> {donation.comment || '-'}</p>
              <p><small>{donation.date}</small></p>
            </div>
          ))
        )}
      </div>

      {/* Contact & Help */}
      <div ref={contactRef} style={styles.contactSection}>
        <h2 style={styles.footerTitle}>Contact & Help</h2>
        <p style={styles.contactText}>
          Contact us at <strong>support@shohay.org</strong> for any questions or assistance.
        </p>

        <form style={styles.helpForm} onSubmit={handleHelpSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={helpEmail}
            onChange={(e) => setHelpEmail(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Describe your problem"
            value={helpMessage}
            onChange={(e) => setHelpMessage(e.target.value)}
            style={styles.input}
            rows={4}
            required
          />
          <button type="submit" style={styles.button}>Send Help Request</button>
        </form>
      </div>
    </div>
  );
};

export default DonorDashboard;