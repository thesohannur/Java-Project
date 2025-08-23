import React from 'react';
import '../styles/Landing.css';

const Landing = ({ onShowAuth }) => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Shohay</h1>
        <p>Connecting donors with those in need</p>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2>Make a Difference Today</h2>
          <p>Join our community of donors, NGOs, and volunteers working together to create positive change.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={onShowAuth}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <h3>🤝 Donate</h3>
          <p>Contribute to causes you care about and make a direct impact.</p>
        </div>
        <div className="feature">
          <h3>🌍 Connect</h3>
          <p>Join forces with NGOs and other donors to amplify your impact.</p>
        </div>
        <div className="feature">
          <h3>📊 Track</h3>
          <p>See exactly how your contributions are making a difference.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
