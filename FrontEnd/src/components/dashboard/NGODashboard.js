import React, { useState, useEffect, useRef } from 'react';
import eventsData from '../../React JS files/src/data/event'; // import এর নাম changed

const NGODashboard = () => {
  const [events, setEvents] = useState(eventsData);  // এখানে variable নাম changed

  // বাকি কোড একই থাকবে...

 // ✅ Correct, assuming NGODashboard.js and data/ are both in /src


const NGODashboard = () => {
  const [event, setEvents] = useState(event); // ✅ CORRECT
  const helpSectionRef = useRef(null);
  const [helpVisible, setHelpVisible] = useState(false);



  // IntersectionObserver for help section visibility
  useEffect(() => {
    const currentRef = helpSectionRef.current; // Copy ref value here

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

  const [view, setView] = useState('dashboard'); // 'dashboard', 'contact', 'help', 'records'

  


  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    organization: '',
    description: '',
    target: '',
    achieved: '',
    image: '',
  });

  // NGODashboard.js ফাইলে
// ১. 'handleCardClick' function ঠিকমতো define করো:

const handleCardClick = (event) => {
  setSelectedEvent(event);
};

// ২. 'ardClick' এর পরিবর্তে এই ফাংশন ব্যবহার করো


  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewEventSubmit = (e) => {
    e.preventDefault();

    const { title, organization, description, target, achieved, image } = newEvent;
    if (!title || !organization || !description || !target || !achieved || !image) {
      alert('Please fill in all fields.');
      return;
    }

    const newEventObject = {
      ...newEvent,
      target: Number(target),
      achieved: Number(achieved),
      image, // assuming this is a URL string
    };

    setEvents([...events, newEventObject]);

    // Clear form
    setNewEvent({
      title: '',
      organization: '',
      description: '',
      target: '',
      achieved: '',
      image: '',
    });
  };

  return (
    
    <div
    
      style={{
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #75d9a5ff, #c2cc75ff)',
        color: '#116d3eff',
      }}
    >
         <div style={{ padding: '2rem' }}>
      <h2>NGO Dashboard</h2>
      <p>Welcome to your NGO dashboard!</p>
    </div>
      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <button onClick={() => setView('dashboard')}>🏠 Dashboard</button>
        <button onClick={() => setView('records')}>📁 Previous Record</button>
        <button onClick={() => setView('help')}>❓ Help</button>
        <button onClick={() => setView('contact')}>📞 Contact</button>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>📊 NGO Dashboard - Event Progress</h1>

      {/* Dashboard View */}
      {view === 'dashboard' && (
        <>
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              marginBottom: '3rem',
            }}
          >
            {/* Gradient fade overlays */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '80px',
                background: 'linear-gradient(to right, #a1ffce, transparent)',
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '80px',
                background: 'linear-gradient(to left, #faffd1, transparent)',
                zIndex: 1,
              }}
            />
            <div className="carousel-track">
              {[...events, ...events].map((event, index) => {
                const progress = (event.achieved / event.target) * 100;

                return (
                  <div
                    key={index}
                    onClick={() => handleCardClick(event)}
                    className="event-card"
                    style={{
                      width: '300px',
                      background: 'linear-gradient(to right, #28c574ff, #d7df9aff)',
                      borderRadius: '10px',
                      padding: '1rem',
                      marginRight: '1rem',
                      cursor: 'pointer',
                      backdropFilter: 'blur(3px)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      flexShrink: 0,
                      color: '#0b3c23ff',
                    }}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                      }}
                    />
                    <h3>{event.title}</h3>
                    <p>
                      <strong>NGO:</strong> {event.organization}
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>{event.description}</p>
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ height: '10px', background: '#8ef6afff', borderRadius: '5px' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: progress >= 100 ? '#00e676' : '#0b8ce9',
                            borderRadius: '5px',
                          }}
                        />
                      </div>
                      <small>
                        {event.achieved} / {event.target} achieved
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <div
              style={{
                marginTop: '3rem',
                background: 'linear-gradient(to right, #a1ffce, #faffd1)',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backdropFilter: 'blur(4px)',
              }}
            >
              <h2>📌 Detailed Progress: {selectedEvent.title}</h2>
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }}
              />
              <p>
                <strong>Organization:</strong> {selectedEvent.organization}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Target:</strong> {selectedEvent.target}
              </p>
              <p>
                <strong>Achieved:</strong> {selectedEvent.achieved}
              </p>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ height: '15px', background: '#ccc', borderRadius: '8px' }}>
                  <div
                    style={{
                      width: `${(selectedEvent.achieved / selectedEvent.target) * 100}%`,
                      height: '100%',
                      background: '#0b8ce9',
                      borderRadius: '8px',
                    }}
                  />
                </div>
                <p style={{ marginTop: '0.5rem' }}>
                  {((selectedEvent.achieved / selectedEvent.target) * 100).toFixed(1)}% complete
                </p>
              </div>
            </div>
          )}

          {/* New Event Form */}
          <div
            style={{
              background: 'linear-gradient(to right, #89de9dff, #adb387ff)',
              padding: '2rem',
              marginTop: '4rem',
              borderRadius: '10px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              backdropFilter: 'blur(4px)',
            }}
          >
            <h2>➕ Create New Event</h2>
            <form onSubmit={handleNewEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" name="title" placeholder="Title" value={newEvent.title} onChange={handleNewEventChange} />
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                value={newEvent.organization}
                onChange={handleNewEventChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newEvent.description}
                onChange={handleNewEventChange}
                rows={3}
              />
              <input type="number" name="target" placeholder="Target Amount" value={newEvent.target} onChange={handleNewEventChange} />
              <input
                type="number"
                name="achieved"
                placeholder="Achieved Amount"
                value={newEvent.achieved}
                onChange={handleNewEventChange}
              />
              <input type="text" name="image" placeholder="Image URL" value={newEvent.image} onChange={handleNewEventChange} />
              <button
                type="submit"
                style={{
                  background: '#00e676',
                  color: '#000',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Add Event
              </button>
            </form>
          </div>
        </>
      )}

      {/* Previous Records */}
      {view === 'records' && (
        <div
          style={{
            background: '#f0f4f8',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: 'auto',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <h2>📁 Previous Records</h2>
          {events.map((event, index) => (
            <div
              key={index}
              style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}
            >
              <h3>{event.title}</h3>
              <p>
                <strong>Organization:</strong> {event.organization}
              </p>
              <p>{event.description}</p>
              <p>
                Progress: {event.achieved}/{event.target}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      {view === 'help' && (
        <div
          ref={helpSectionRef}
          style={{
            background: '#f0f4f8',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: 'auto',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            opacity: helpVisible ? 1 : 0.5,
            transition: 'opacity 0.5s ease',
          }}
        >
          <h2>❓ Help</h2>
          <p>Welcome to the NGO Dashboard! Here's how you can use this interface:</p>
          <ul>
            <li>
              <strong>View Events:</strong> Scroll through the carousel or click a card to view details.
            </li>
            <li>
              <strong>Add Event:</strong> Fill the form below the dashboard to add a new event.
            </li>
            <li>
              <strong>Previous Record:</strong> Shows past and current events with progress.
            </li>
            <li>
              <strong>Contact:</strong> Reach out to us for support or questions.
            </li>
          </ul>
        </div>
      )}

      {/* Contact Section */}
      {view === 'contact' && (
        <div
          style={{
            background: '#f0f4f8',
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '600px',
            margin: 'auto',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          <h2>📞 Contact Us</h2>
          <p>
            Email: <a href="mailto:contact@ngo.org">contact@ngo.org</a>
          </p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 NGO Street, City, Country</p>
          <form
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea rows="4" placeholder="Your Message"></textarea>
            <button
              type="submit"
              style={{
                background: '#0b8ce9',
                color: '#fff',
                padding: '0.8rem',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      )}

      {/* Embedded Styles */}
      <style>
        {`
          .carousel-track {
            display: flex;
            width: max-content;
            animation: scroll-left 30s linear infinite;
          }

          @keyframes scroll-left {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .carousel-track:hover {
            animation-play-state: paused;
          }

          input, textarea {
            padding: 0.6rem;
            border-radius: 5px;
            border: none;
            outline: none;
          }

          button {
            padding: 0.6rem 1.2rem;
            border-radius: 5px;
            border: none;
            cursor: pointer;
          }

          /* Floating animation */
          @keyframes float-in {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .float-in {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.5s ease-out;
          }

          .float-in.visible {
            animation: float-in 1s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
};
export default NGODashboard;
